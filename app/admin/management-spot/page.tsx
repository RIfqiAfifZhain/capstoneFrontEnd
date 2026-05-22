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
};

type ModalMode = "add" | "edit" | null;

const INITIAL_SPOTS: Spot[] = [
  {
    id: 1,
    name: "Museum Layang-Layang",
    location: "Jakarta Selatan",
    category: "park",
    address: "Jl. H. Kamang No.38, RT.5/RW.10, Pd. Labu, Kec. Ciland...",
    coordinates: "-6.30797 106.79062",
    description:
      "Museum unik yang menyimpan koleksi ribuan layang-layang dari berbagai penjuru nusantara dan dunia.",
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
          Aisyah Rahma
        </span>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
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

function SaveSuccessModal({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#EFEFEF",
              borderRadius: "14px",
            }}
          />
          <svg
            viewBox="0 0 40 40"
            fill="none"
            width="36"
            height="36"
            style={{ position: "relative", zIndex: 1 }}
          >
            <polyline
              points="6,21 16,31 34,11"
              stroke="#2D6A4F"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="6"
              y1="36"
              x2="34"
              y2="36"
              stroke="#2D6A4F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111",
            marginBottom: "12px",
          }}
        >
          All Changes Saved!
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#131B11",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          Data for <strong>{name}</strong> has been updated.
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
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d6b3d")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2D4A2D")
          }
        >
          Back to Management Spot
        </button>
      </div>
    </div>
  );
}

function DeleteModal({
  spot,
  onConfirm,
  onCancel,
}: {
  spot: Spot;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#FDECEA",
              borderRadius: "14px",
            }}
          />
          <svg
            viewBox="0 0 40 36"
            fill="none"
            width="36"
            height="36"
            style={{ position: "relative", zIndex: 1 }}
          >
            <path
              d="M20 2L2 34h36L20 2z"
              stroke="#C0392B"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="20"
              y1="14"
              x2="20"
              y2="24"
              stroke="#C0392B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="29" r="1.2" fill="#C0392B" />
          </svg>
        </div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111",
            marginBottom: "12px",
          }}
        >
          Delete this spot?
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#131B11",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          Confirm to delete {spot.name}.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#FDECEA",
              color: "#C0392B",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fad7d4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FDECEA")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#8B1A1A",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#a52a2a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#8B1A1A")
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteSuccessModal({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#111",
            marginBottom: "12px",
          }}
        >
          Done!
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#131B11",
            lineHeight: 1.75,
            marginBottom: "28px",
          }}
        >
          &apos;{name}&apos; has been deleted.
        </p>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "7px",
            border: "none",
            backgroundColor: "#2D4A2D",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d6b3d")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2D4A2D")
          }
        >
          Back to Management
        </button>
      </div>
    </div>
  );
}

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

  const fieldBox: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF5F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar />
      <main style={{ padding: "8px 40px 60px", flex: 1 }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#1A2E1A",
            marginBottom: "4px",
          }}
        >
          {mode === "add" ? "Add New Spot" : "Edit Spot"}
        </h2>
        <p style={{ fontSize: "13px", color: "#283B24", marginBottom: "28px" }}>
          Update spot information here.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Spot Name
            </label>
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
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Category
            </label>
            <div
              style={{
                ...fieldBox,
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  cursor: "pointer",
                  paddingRight: "36px",
                }}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: "14px",
                  color: "#666",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Address
            </label>
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
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Coordinates
            </label>
            <div style={fieldBox}>
              <input
                value={form.coordinates}
                onChange={(e) =>
                  setForm({ ...form, coordinates: e.target.value })
                }
                placeholder="Lat, Long"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "600",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Description
          </label>
          <div style={fieldBox}>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the atmosphere..."
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Facilities
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {FACILITIES.map((f) => {
                const active = form.facilities.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() =>
                      setForm({
                        ...form,
                        facilities: toggleTag(form.facilities, f),
                      })
                    }
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      border: `1px solid ${active ? "transparent" : "#C8B8A8"}`,
                      backgroundColor: active ? "#2D4A2D" : "transparent",
                      color: active ? "#fff" : "#555",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.backgroundColor = "#f0efeb";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Crowdedness
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {CROWDEDNESS.map((c) => {
                const active = form.crowdedness.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() =>
                      setForm({
                        ...form,
                        crowdedness: toggleTag(form.crowdedness, c),
                      })
                    }
                    style={{
                      padding: "5px 16px",
                      borderRadius: "20px",
                      border: `1px solid ${active ? "transparent" : "#C8B8A8"}`,
                      backgroundColor: active ? "#2D4A2D" : "transparent",
                      color: active ? "#fff" : "#555",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        e.currentTarget.style.backgroundColor = "#f0efeb";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Open Hour
            </label>
            <div style={fieldBox}>
              <input
                type="time"
                value={form.openHour}
                onChange={(e) => setForm({ ...form, openHour: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Close Hour
            </label>
            <div style={fieldBox}>
              <input
                type="time"
                value={form.closeHour}
                onChange={(e) =>
                  setForm({ ...form, closeHour: e.target.value })
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "600",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Spot Image
          </label>
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
            style={{
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              cursor: "pointer",
              overflow: "hidden",
              minHeight: "160px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{ textAlign: "center" }}>
                <Upload size={28} color="#C8B8A8" />
                <p style={{ fontSize: "13px", color: "#AAA" }}>
                  Click to upload image
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "10px 28px",
              borderRadius: "8px",
              border: "1px solid #E0D8D0",
              backgroundColor: "#F5EDE8",
              color: "#888",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#ede0d4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#F5EDE8")
            }
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form, form.name)}
            style={{
              padding: "10px 28px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2D4A2D",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d6b3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2D4A2D")
            }
          >
            <Save size={15} />
            Save Spot
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ManagementSpotPage() {
  const [spots, setSpots] = useState<Spot[]>(INITIAL_SPOTS);
  const [view, setView] = useState<"list" | "form">("list");
  const [formMode, setFormMode] = useState<ModalMode>(null);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Spot | null>(null);
  const [deletedName, setDeletedName] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  let nextId = Math.max(...spots.map((s) => s.id), 0) + 1;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.replace("/auth");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null;

  if (view === "form") {
    return (
      <SpotForm
        initial={editingSpot ?? {}}
        onSave={(data, name) => {
          if (formMode === "add") {
            setSpots((prev) => [{ ...data, id: nextId++ }, ...prev]);
          } else if (formMode === "edit" && editingSpot) {
            setSpots((prev) =>
              prev.map((s) =>
                s.id === editingSpot.id ? { ...data, id: s.id } : s,
              ),
            );
          }
          setView("list");
          setFormMode(null);
          setEditingSpot(null);
          setSavedName(name || "Spot");
        }}
        onCancel={() => {
          setView("list");
          setFormMode(null);
          setEditingSpot(null);
        }}
        mode={formMode}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF5F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar />
      <main style={{ padding: "8px 40px 40px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{ fontSize: "22px", fontWeight: "700", color: "#1A2E1A" }}
            >
              Hello, Admin!
            </h2>
            <p style={{ fontSize: "13px", color: "#354E30" }}>
              What would you do today?
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSpot(null);
              setFormMode("add");
              setView("form");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2D4A2D",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d6b3d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2D4A2D")
            }
          >
            <Plus size={16} />
            Add Spot
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #EDE8E2",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {spots.map((spot, i) => (
            <div
              key={spot.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px",
                borderBottom:
                  i < spots.length - 1 ? "1px solid #F0EAE4" : "none",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: "#E8DDD4",
                }}
              >
                <img
                  src={spot.img}
                  alt={spot.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1A2E1A",
                  }}
                >
                  {spot.name}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {spot.location}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    setEditingSpot(spot);
                    setFormMode("edit");
                    setView("form");
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#2D4A2D",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3d6b3d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2D4A2D")
                  }
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(spot)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#8B1A1A",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#a52a2a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#8B1A1A")
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {savedName && (
        <SaveSuccessModal name={savedName} onBack={() => setSavedName(null)} />
      )}
      {deleteTarget && (
        <DeleteModal
          spot={deleteTarget}
          onConfirm={() => {
            const name = deleteTarget.name;
            setSpots((prev) => prev.filter((s) => s.id !== deleteTarget.id));
            setDeleteTarget(null);
            setDeletedName(name);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {deletedName && (
        <DeleteSuccessModal
          name={deletedName}
          onBack={() => setDeletedName(null)}
        />
      )}
    </div>
  );
}
