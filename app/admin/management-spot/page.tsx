"use client";

import { useState, useRef } from "react";
import { Search, Plus, Pencil, Trash2, Save, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ──

type Spot = {
  id: number;
  name: string;
  location: string;
  category: string;
  address: string;
  coordinates: string;
  description: string;
  facilities: string[];
  crowdedness: string[];
  openHour: string;
  closeHour: string;
  img: string;
};

type ModalMode = "add" | "edit" | null;

// ─── Initial data ───

const INITIAL_SPOTS: Spot[] = [
  {
    id: 1,
    name: "Museum Layang-Layang",
    location: "Jakarta Selatan",
    category: "park",
    address: "Jl. H. Kamang No.38, RT.5/RW.10, Pd. Labu, Kec. Ciland...",
    coordinates: "-6.30797 106.79062",
    description: "Museum unik yang menyimpan koleksi ribuan layang-layang dari berbagai penjuru nusantara dan dunia.",
    facilities: ["Indoor", "Quiet"],
    crowdedness: ["Low"],
    openHour: "09:00",
    closeHour: "17:00",
    img: "/museumlayang.png",
  },
  {
    id: 2,
    name: "Galeri Salihara",
    location: "Jakarta Selatan",
    category: "park",
    address: "Jl. Salihara No.16, Pasar Minggu, Jakarta Selatan",
    coordinates: "-6.28912 106.83211",
    description: "Galeri seni kontemporer dengan program budaya yang beragam.",
    facilities: ["Indoor", "Groups"],
    crowdedness: ["Low"],
    openHour: "10:00",
    closeHour: "20:00",
    img: "/salihara.jpg",
  },
  {
    id: 3,
    name: "TierSpace",
    location: "Jakarta Selatan",
    category: "cafe",
    address: "Jl. Kemang Raya No.1, Jakarta Selatan",
    coordinates: "-6.26123 106.81456",
    description: "Coworking space modern dengan fasilitas lengkap.",
    facilities: ["Indoor", "Focused", "Alone"],
    crowdedness: ["Low"],
    openHour: "08:00",
    closeHour: "22:00",
    img: "/tierspace.png",
  },
  {
    id: 4,
    name: "Perpustakaan Freedom",
    location: "Jakarta Selatan",
    category: "library",
    address: "Jl. TB Simatupang, Jakarta Selatan",
    coordinates: "-6.30155 106.79823",
    description: "Perpustakaan modern dengan koleksi buku yang lengkap.",
    facilities: ["Indoor", "Quiet", "Alone"],
    crowdedness: ["Low"],
    openHour: "08:00",
    closeHour: "20:00",
    img: "/freedomlib.jpg",
  },
  {
    id: 5,
    name: "GoWork Fatmawati",
    location: "Jakarta Selatan",
    category: "cafe",
    address: "Jl. Fatmawati Raya No.7, Jakarta Selatan",
    coordinates: "-6.28456 106.79234",
    description: "Ruang kerja bersama dengan suasana profesional.",
    facilities: ["Indoor", "Focused", "Groups"],
    crowdedness: ["High"],
    openHour: "07:00",
    closeHour: "22:00",
    img: "/gowork.png",
  },
  {
    id: 6,
    name: "Cinere Garden Food Street",
    location: "Jakarta Selatan",
    category: "cafe",
    address: "Jl. Cinere Raya, Jakarta Selatan",
    coordinates: "-6.35123 106.77891",
    description: "Kawasan kuliner outdoor yang asri dan sejuk.",
    facilities: ["Outdoor", "Groups", "Relaxed"],
    crowdedness: ["High"],
    openHour: "11:00",
    closeHour: "23:00",
    img: "/cinere.jpg",
  },
];

const FACILITIES = ["Indoor", "Busy", "Groups", "Relaxed", "Outdoor", "Quiet", "Alone", "Focused"];
const CROWDEDNESS = ["Low", "High"];
const CATEGORIES = ["cafe", "library", "park"];

// ── Input style ────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#FFFFFF",
  fontSize: "13px",
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
  fontStyle: "normal",
};

// ─── Shared Topbar ────

function Topbar() {
  const router = useRouter();
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
      <div style={{ flex: 1, marginRight: "24px", position: "relative" }}>
        <input
          placeholder="Find your quiet spot..."
          style={{
            width: "100%",
            padding: "10px 40px 10px 16px",
            borderRadius: "50px",
            border: "1px solid #E0D8D0",
            backgroundColor: "#F0EAE4",
            fontSize: "13px",
            color: "#555",
            outline: "none",
            boxSizing: "border-box",
            fontStyle: "normal",
          }}
        />
        <Search size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
      </div>

      {/* Avatar */}
      <button
        onClick={() => router.push("/admin/profile")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "40px",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EAE4")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <span style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}>Aisyah Rahma</span>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <img
            src="/profilepic.jpg"
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </button>
    </header>
  );
}

// ─── SaveSuccessModal ─────

function SaveSuccessModal({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "40px 32px 32px",
          maxWidth: "320px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            margin: "0 auto 20px",
            width: "64px",
            height: "64px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#EFEFEF", borderRadius: "14px" }} />
          <svg viewBox="0 0 40 40" fill="none" width="36" height="36" style={{ position: "relative", zIndex: 1 }}>
            <polyline points="6,21 16,31 34,11" stroke="#2D6A4F" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="6" y1="36" x2="34" y2="36" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px" }}>
          All Changes Saved!
        </h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>
          Data for <strong>{name}</strong> has been updated and safely stored in your database.
        </p>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#2D4A2D",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Back to Management Spot
        </button>
      </div>
    </div>
  );
}

// ─── DeleteModal ────

function DeleteModal({ spot, onConfirm, onCancel }: { spot: Spot; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "40px 32px 32px",
          maxWidth: "320px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            margin: "0 auto 20px",
            width: "64px",
            height: "64px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#FDECEA", borderRadius: "14px" }} />
          <svg viewBox="0 0 40 36" fill="none" width="36" height="36" style={{ position: "relative", zIndex: 1 }}>
            <path d="M20 2L2 34h36L20 2z" stroke="#C0392B" strokeWidth="2" strokeLinejoin="round" fill="none" />
            <line x1="20" y1="14" x2="20" y2="24" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="29" r="1.2" fill="#C0392B" />
          </svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px", lineHeight: 1.35 }}>
          Are you sure want to<br />delete this spot?
        </h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>
          You are about to permanently delete {spot.name}. All booking history, analytics, and associated metadata will be lost. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "13px", borderRadius: "12px", border: "none",
              backgroundColor: "#FDECEA", color: "#C0392B", fontSize: "13px",
              fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "13px", borderRadius: "12px", border: "none",
              backgroundColor: "#7B1F1F", color: "#fff", fontSize: "13px",
              fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteSuccessModal ────

function DeleteSuccessModal({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "40px 32px 32px",
          maxWidth: "320px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            margin: "0 auto 20px",
            width: "64px",
            height: "64px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#EFEFEF", borderRadius: "14px" }} />
          <svg viewBox="0 0 40 40" fill="none" width="36" height="36" style={{ position: "relative", zIndex: 1 }}>
            <polyline points="6,21 16,31 34,11" stroke="#2D6A4F" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="6" y1="36" x2="34" y2="36" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px" }}>
          All Done! Spot is Gone
        </h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>
          &apos;{name}&apos; has been successfully deleted. Nothing left to do here.
        </p>
        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            backgroundColor: "#2D4A2D", color: "#fff", fontSize: "13px",
            fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Back to Management Spot
        </button>
      </div>
    </div>
  );
}

// ─── SpotForm ──────

function SpotForm({
  initial,
  onSave,
  onCancel,
  mode,
}: {
  initial: Partial<Spot>;
  onSave: (data: Omit<Spot, "id">, spotName: string) => void;
  onCancel: () => void;
  mode: ModalMode;
}) {
  const [form, setForm] = useState({
    name: initial.name ?? "",
    location: initial.location ?? "Jakarta Selatan",
    category: initial.category ?? "",
    address: initial.address ?? "",
    coordinates: initial.coordinates ?? "",
    description: initial.description ?? "",
    facilities: initial.facilities ?? [],
    crowdedness: initial.crowdedness ?? [],
    openHour: initial.openHour ?? "",
    closeHour: initial.closeHour ?? "",
    img: initial.img ?? "",
  });
  const [imagePreview, setImagePreview] = useState<string>(initial.img ?? "");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, img: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const fieldBox: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF5F0", display: "flex", flexDirection: "column" }}>
      <Topbar />

      <main style={{ padding: "8px 40px 60px", flex: 1 }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1A2E1A", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
          {mode === "add" ? "Add New Spot" : "Edit Spot"}
        </h2>
        <p style={{ fontSize: "13px", color: "#283B24", marginBottom: "28px" }}>
          {mode === "add" ? "Register a new location within the Sanctuary network." : "Update anything you want to."}
        </p>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Spot Name</label>
            <div style={fieldBox}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter spot name..."
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Category</label>
            <div style={fieldBox}>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Address</label>
            <div style={fieldBox}>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Fill an address..."
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Coordinates</label>
            <div style={fieldBox}>
              <input
                value={form.coordinates}
                onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
                placeholder="Lat, Long"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "6px" }}>Description</label>
          <div style={fieldBox}>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the atmosphere, mood, and unique features of this spot..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        {/* Facilities & Crowdedness */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>Facilities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {FACILITIES.map((f) => {
                const active = form.facilities.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => setForm({ ...form, facilities: toggleTag(form.facilities, f) })}
                    style={{
                      padding: "5px 12px", borderRadius: "20px",
                      border: `1px solid ${active ? "transparent" : "#C8B8A8"}`,
                      backgroundColor: active ? "#2D4A2D" : "transparent",
                      color: active ? "#fff" : "#555",
                      fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>Crowdedness</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {CROWDEDNESS.map((c) => {
                const active = form.crowdedness.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, crowdedness: toggleTag(form.crowdedness, c) })}
                    style={{
                      padding: "5px 16px", borderRadius: "20px",
                      border: `1px solid ${active ? "transparent" : "#C8B8A8"}`,
                      backgroundColor: active ? "#2D4A2D" : "transparent",
                      color: active ? "#fff" : "#555",
                      fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>Operating Hours</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldBox}>
              <input type="time" value={form.openHour} onChange={(e) => setForm({ ...form, openHour: e.target.value })} style={inputStyle} />
            </div>
            <div style={fieldBox}>
              <input type="time" value={form.closeHour} onChange={(e) => setForm({ ...form, closeHour: e.target.value })} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Spot Image */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>Spot Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageFile(f);
            }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            style={{
              borderRadius: "12px",
              backgroundColor: isDragOver ? "#EEF3EE" : "#FFFFFF",
              boxShadow: isDragOver
                ? "0 0 0 2px #2D4A2D inset, 0 1px 4px rgba(0,0,0,0.06)"
                : "0 1px 4px rgba(0,0,0,0.06)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.15s",
              minHeight: "160px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute", bottom: "10px", right: "12px",
                    backgroundColor: "rgba(0,0,0,0.55)", color: "#fff",
                    fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
                  }}
                >
                  Click to change
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Upload size={28} color="#C8B8A8" />
                <p style={{ fontSize: "13px", color: "#AAA", margin: 0 }}>Drop your image here</p>
                <p style={{ fontSize: "11px", color: "#CCC", margin: 0 }}>or click to browse</p>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 28px", borderRadius: "8px", border: "1px solid #E0D8D0",
              backgroundColor: "#F5EDE8", color: "#888", fontSize: "14px", fontWeight: "500", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form, form.name)}
            style={{
              padding: "10px 28px", borderRadius: "8px", border: "none",
              backgroundColor: "#2D4A2D", color: "#FFFFFF", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <Save size={15} />
            Save Spot
          </button>
        </div>
      </main>
    </div>
  );
}

// ─── BoxPlusIcon ────

function BoxPlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="14" height="14" rx="3" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="8" y1="4.5" x2="8" y2="11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.5" y1="8" x2="11.5" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main Page ───────

export default function ManagementSpotPage() {
  const [spots, setSpots] = useState<Spot[]>(INITIAL_SPOTS);
  const [view, setView] = useState<"list" | "form">("list");
  const [formMode, setFormMode] = useState<ModalMode>(null);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Spot | null>(null);
  const [deletedName, setDeletedName] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  let nextId = Math.max(...spots.map((s) => s.id), 0) + 1;

  const handleAddClick = () => {
    setEditingSpot(null);
    setFormMode("add");
    setView("form");
  };

  const handleEditClick = (spot: Spot) => {
    setEditingSpot(spot);
    setFormMode("edit");
    setView("form");
  };

  const handleSave = (data: Omit<Spot, "id">, spotName: string) => {
    if (formMode === "add") {
      setSpots((prev) => [{ ...data, id: nextId++ }, ...prev]);
    } else if (formMode === "edit" && editingSpot) {
      setSpots((prev) => prev.map((s) => (s.id === editingSpot.id ? { ...data, id: s.id } : s)));
    }
    setView("list");
    setFormMode(null);
    setEditingSpot(null);
    setSavedName(spotName || "Spot");
  };

  const handleDeleteClick = (spot: Spot) => setDeleteTarget(spot);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    setSpots((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeletedName(name);
  };

  if (view === "form") {
    return (
      <SpotForm
        initial={editingSpot ?? {}}
        onSave={handleSave}
        onCancel={() => { setView("list"); setFormMode(null); setEditingSpot(null); }}
        mode={formMode}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF5F0", display: "flex", flexDirection: "column" }}>
      <Topbar />

      <main style={{ padding: "8px 40px 40px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1A2E1A", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
              Hello, Admin!
            </h2>
            <p style={{ fontSize: "13px", color: "#354E30" }}>What would you do today?</p>
          </div>

          {/* Add Spot button */}
          <button
            onClick={handleAddClick}
            style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
              borderRadius: "8px", border: "none", backgroundColor: "#2D4A2D",
              color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
            }}
          >
            <BoxPlusIcon />
            Add Spot
          </button>
        </div>

        {/* Spot List */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #EDE8E2", borderRadius: "14px", overflow: "hidden" }}>
          {spots.map((spot, i) => (
            <div
              key={spot.id}
              style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px",
                borderBottom: i < spots.length - 1 ? "1px solid #F0EAE4" : "none",
              }}
            >
              <div style={{ width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#E8DDD4" }}>
                <img src={spot.img} alt={spot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1A2E1A", marginBottom: "2px" }}>{spot.name}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{spot.location}</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEditClick(spot)}
                  style={{
                    width: "36px", height: "36px", borderRadius: "8px", border: "none",
                    backgroundColor: "#2D4A2D", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDeleteClick(spot)}
                  style={{
                    width: "36px", height: "36px", borderRadius: "8px", border: "none",
                    backgroundColor: "#8B1A1A", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Save Success Modal */}
      {savedName && <SaveSuccessModal name={savedName} onBack={() => setSavedName(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          spot={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Delete Success Modal */}
      {deletedName && <DeleteSuccessModal name={deletedName} onBack={() => setDeletedName(null)} />}
    </div>
  );
}