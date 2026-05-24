"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, Upload, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

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
  // Field tambahan dari database
  photoUrl?: string;
  spotType?: string;
  atmosphere?: string;
  latitude?: string;
  longitude?: string;
  operationalHours?: string;
};

type ModalMode = "add" | "edit" | null;

const FACILITIES = [
  "Indoor",
  "Busy",
  "Groups",
  "Relaxed",
  "Outdoor",
  "Quiet",
  "Alone",
  "Focused",
];
const CROWDEDNESS = ["Low", "High"];
const CATEGORIES = ["cafe", "library", "park"];

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
};

function Topbar() {
  const router = useRouter();
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "20px 40px",
      }}
    >
      <button
        onClick={() => router.push("/admin/profile-admin")}
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
        <span style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}>
          {username}
        </span>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#c5a98e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </button>
    </header>
  );
}

function SaveSuccessModal({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "40px 32px 32px", maxWidth: "320px", width: "90%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px" }}>All Changes Saved!</h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>Data for <strong>{name}</strong> has been updated.</p>
        <button onClick={onBack} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", backgroundColor: "#2D4A2D", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Back to Management Spot</button>
      </div>
    </div>
  );
}

function DeleteModal({ spot, onConfirm, onCancel }: { spot: Spot; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "40px 32px 32px", maxWidth: "320px", width: "90%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px" }}>Delete this spot?</h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>Confirm to delete {spot.name}.</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "13px", borderRadius: "7px", border: "none", backgroundColor: "#FDECEA", color: "#C0392B", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "13px", borderRadius: "7px", border: "none", backgroundColor: "#8B1A1A", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function DeleteSuccessModal({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "40px 32px 32px", maxWidth: "320px", width: "90%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "12px" }}>Done!</h3>
        <p style={{ fontSize: "12px", color: "#131B11", lineHeight: 1.75, marginBottom: "28px" }}>&apos;{name}&apos; has been deleted.</p>
        <button onClick={onBack} style={{ width: "100%", padding: "14px", borderRadius: "7px", border: "none", backgroundColor: "#2D4A2D", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Back to Management</button>
      </div>
    </div>
  );
}

// 🌟 KOMPONEN FORM DENGAN PENERJEMAH DATA
function SpotForm({
  initial,
  onSave,
  onCancel,
  mode,
}: {
  initial: Partial<Spot>;
  onSave: (data: any, spotName: string, file: File | null) => Promise<void>;
  onCancel: () => void;
  mode: ModalMode;
}) {
  // --- FUNGSI PENERJEMAH DARI STRING DATABASE KE ARRAY UI ---
  const parseFacilities = (fac: any) => {
    if (Array.isArray(fac)) return fac;
    if (typeof fac === "string" && fac.trim() !== "") {
      return fac.split(",").map((s) => s.trim());
    }
    return [];
  };

  const parseCrowdedness = (crowd: any) => {
    if (Array.isArray(crowd)) return crowd;
    if (typeof crowd === "string" && crowd.trim() !== "") {
      return [crowd.charAt(0).toUpperCase() + crowd.slice(1).toLowerCase()];
    }
    return [];
  };

  const parseHours = (hoursStr: any) => {
    if (typeof hoursStr === "string" && hoursStr.includes("-")) {
      const [open, close] = hoursStr.split("-");
      return { open: open?.trim() || "08:00", close: close?.trim() || "22:00" };
    }
    return { open: "08:00", close: "22:00" };
  };

  const { open: initialOpen, close: initialClose } = parseHours(initial.operationalHours);
  const initialCoords = initial.latitude && initial.longitude ? `${initial.latitude}, ${initial.longitude}` : "";

  const [form, setForm] = useState({
    name: initial.name ?? "",
    location: initial.location ?? "Jakarta Selatan",
    category: initial.category ?? initial.spotType ?? "",
    address: initial.address ?? "",
    coordinates: initial.coordinates ?? initialCoords,
    description: initial.description ?? "",
    facilities: parseFacilities(initial.facilities),
    crowdedness: parseCrowdedness(initial.crowdedness),
    openHour: initial.openHour ?? initialOpen,
    closeHour: initial.closeHour ?? initialClose,
    img: initial.img ?? initial.photoUrl ?? "",
  });

  const [imagePreview, setImagePreview] = useState<string>(initial.img ?? initial.photoUrl ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file); // 🌟 Simpan file asli untuk dikirim ke Backend
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const fieldBox: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);
    await onSave(form, form.name, selectedFile);
    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF5F0", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <main style={{ padding: "8px 40px 60px", flex: 1 }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1A2E1A", marginBottom: "4px" }}>
          {mode === "add" ? "Add New Spot" : "Edit Spot"}
        </h2>
        <p style={{ fontSize: "13px", color: "#283B24", marginBottom: "28px" }}>Update spot information here.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Spot Name</label>
            <div style={fieldBox}><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter spot name..." style={inputStyle} /></div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Category / Spot Type</label>
            <div style={{ ...fieldBox, position: "relative", display: "flex", alignItems: "center" }}>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: "36px" }}>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", color: "#666", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Address</label>
            <div style={fieldBox}><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Fill an address..." style={inputStyle} /></div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Coordinates</label>
            <div style={fieldBox}><input value={form.coordinates} onChange={(e) => setForm({ ...form, coordinates: e.target.value })} placeholder="Lat, Long" style={inputStyle} /></div>
          </div>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Description</label>
          <div style={fieldBox}><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the atmosphere..." rows={5} style={{ ...inputStyle, resize: "vertical" }} /></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Facilities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {FACILITIES.map((f) => {
                const active = form.facilities.includes(f);
                return (
                  <button key={f} onClick={() => setForm({ ...form, facilities: toggleTag(form.facilities, f) })} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${active ? "transparent" : "#C8B8A8"}`, backgroundColor: active ? "#2D4A2D" : "transparent", color: active ? "#fff" : "#555", fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s ease" }}>{f}</button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Crowdedness</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {CROWDEDNESS.map((c) => {
                const active = form.crowdedness.includes(c);
                return (
                  <button key={c} onClick={() => setForm({ ...form, crowdedness: toggleTag(form.crowdedness, c) })} style={{ padding: "5px 16px", borderRadius: "20px", border: `1px solid ${active ? "transparent" : "#C8B8A8"}`, backgroundColor: active ? "#2D4A2D" : "transparent", color: active ? "#fff" : "#555", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>{c}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Open Hour</label>
            <div style={fieldBox}><input type="time" value={form.openHour} onChange={(e) => setForm({ ...form, openHour: e.target.value })} style={inputStyle} /></div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Close Hour</label>
            <div style={fieldBox}><input type="time" value={form.closeHour} onChange={(e) => setForm({ ...form, closeHour: e.target.value })} style={inputStyle} /></div>
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Spot Image</label>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
          <div onClick={() => fileInputRef.current?.click()} style={{ borderRadius: "12px", backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer", overflow: "hidden", minHeight: "160px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Upload size={28} color="#C8B8A8" />
                <p style={{ fontSize: "13px", color: "#AAA", margin: 0 }}>Click to upload image</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={onCancel} style={{ padding: "10px 28px", borderRadius: "8px", border: "1px solid #E0D8D0", backgroundColor: "#F5EDE8", color: "#888", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSaveClick} disabled={isSubmitting} style={{ padding: "10px 28px", borderRadius: "8px", border: "none", backgroundColor: "#2D4A2D", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            {isSubmitting ? "Saving..." : <><Save size={15} /> Save Spot</>}
          </button>
        </div>
      </main>
    </div>
  );
}

// === MAIN PAGE ===
export default function ManagementSpotPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [formMode, setFormMode] = useState<ModalMode>(null);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Spot | null>(null);
  const [deletedName, setDeletedName] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // 🌟 1. FETCH DATA ASLI DARI BACKEND
  const fetchSpots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/admins/spots`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const json = await res.json();
      const spotsData = json.data || json;
      setSpots(Array.isArray(spotsData) ? spotsData : []);
    } catch (err) {
      console.error("Gagal menarik data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.replace("/auth");
    } else {
      setIsAuthorized(true);
      fetchSpots(); // Tarik data saat masuk
    }
  }, [router]);

  // 🌟 2. FUNGSI SAVE KE BACKEND (POST/PUT)
  const handleSaveToDB = async (data: any, spotName: string, file: File | null) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const submitData = new FormData();
      submitData.append("name", data.name);
      submitData.append("address", data.address);
      submitData.append("description", data.description);
      submitData.append("facilities", data.facilities.join(", "));
      submitData.append("operationalHours", `${data.openHour} - ${data.closeHour}`);
      
      // 🌟 Ekstraksi tags dari array facilities milik UI
      const tags = data.facilities.map((f: string) => f.toLowerCase());
      
      const spotType = tags.includes("outdoor") ? "outdoor" : "indoor";
      const atmosphere = tags.includes("busy") ? "busy" : "quiet";
      const visitType = tags.includes("groups") ? "group" : "alone";
      const mood = tags.includes("relaxed") ? "relaxed" : "focused";
      const crowdedness = data.crowdedness.length > 0 ? data.crowdedness[0].toLowerCase() : "low";

      // Masukkan data ENUM yang sudah pasti valid ke database
      submitData.append("category", data.category || "cafe");
      submitData.append("spotType", spotType);
      submitData.append("atmosphere", atmosphere);
      submitData.append("visitType", visitType);
      submitData.append("mood", mood);
      submitData.append("crowdedness", crowdedness);

      // 🌟 PERBAIKAN: Pecah dan Validasi Koordinat (Lat, Long)
      if (data.coordinates) {
        const coords = data.coordinates.split(",");
        const lat = coords[0]?.trim();
        const lng = coords[1]?.trim();
        
        // Hanya kirim ke database JIKA isinya benar-benar ANGKA
        if (lat && !isNaN(Number(lat))) submitData.append("latitude", lat);
        if (lng && !isNaN(Number(lng))) submitData.append("longitude", lng);
      }

      // Masukkan Foto jika ada
      if (file) {
        submitData.append("photoUrl", file);
      }

      const method = formMode === "edit" ? "PUT" : "POST";
      const url = formMode === "edit" 
        ? `${apiUrl}/admins/spots/${editingSpot?.id}` 
        : `${apiUrl}/admins/spots`;

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      if (res.ok) {
        await fetchSpots(); // Tarik ulang data terbaru dari database
        setView("list");
        setFormMode(null);
        setEditingSpot(null);
        setSavedName(spotName || "Spot"); // Munculkan Modal Sukses
      } else {
        const errorJson = await res.json();
        alert(`Gagal menyimpan: ${errorJson.message}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };

  // 🌟 3. FUNGSI DELETE DARI BACKEND
  const handleDeleteFromDB = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      
      const res = await fetch(`${apiUrl}/admins/spots/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const name = deleteTarget.name;
        setDeleteTarget(null);
        setDeletedName(name); // Munculkan Modal Delete Success
        await fetchSpots(); // Refresh data
      } else {
        alert("Gagal menghapus spot.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (!isAuthorized) return null;

  if (view === "form") {
    return (
      <SpotForm
        initial={editingSpot ?? {}}
        onSave={handleSaveToDB}
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
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1A2E1A" }}>Hello, Admin!</h2>
            <p style={{ fontSize: "13px", color: "#354E30" }}>What would you do today?</p>
          </div>
          <button
            onClick={() => { setEditingSpot(null); setFormMode("add"); setView("form"); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#2D4A2D", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6b3d")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2D4A2D")}
          >
            <Plus size={16} /> Add Spot
          </button>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #EDE8E2", borderRadius: "14px", overflow: "hidden" }}>
          {loading ? (
             <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Memuat data dari database...</div>
          ) : spots.length === 0 ? (
             <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>Belum ada spot yang ditambahkan.</div>
          ) : (
            spots.map((spot, i) => (
              <div key={spot.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderBottom: i < spots.length - 1 ? "1px solid #F0EAE4" : "none" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#E8DDD4" }}>
                  <img src={spot.photoUrl || spot.img || "/bg-library.webp"} alt={spot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1A2E1A" }}>{spot.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>{spot.address || spot.location}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => { setEditingSpot(spot); setFormMode("edit"); setView("form"); }}
                    style={{ width: "36px", height: "36px", borderRadius: "8px", border: "none", backgroundColor: "#2D4A2D", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  ><Pencil size={14} /></button>
                  <button
                    onClick={() => setDeleteTarget(spot)}
                    style={{ width: "36px", height: "36px", borderRadius: "8px", border: "none", backgroundColor: "#8B1A1A", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  ><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {savedName && <SaveSuccessModal name={savedName} onBack={() => setSavedName(null)} />}
      {deleteTarget && <DeleteModal spot={deleteTarget} onConfirm={handleDeleteFromDB} onCancel={() => setDeleteTarget(null)} />}
      {deletedName && <DeleteSuccessModal name={deletedName} onBack={() => setDeletedName(null)} />}
    </div>
  );
}