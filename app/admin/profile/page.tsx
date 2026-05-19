"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCog, Pencil, X, Save } from "lucide-react";

export default function ProfileAdminPage() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aisyah Rahma",
    email: "aisyah123@gmail.com",
    avatar:
      "/profilepic.jpg",
  });
  const [draft, setDraft] = useState(profile);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.35)",
    fontSize: "14px",
    color: "#283B24",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D9857A 0%, #F5E8E8 28%, #FAF0F0 60%)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "28px 36px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(8px)",
            borderRadius: "50px",
            padding: "8px 28px 8px 8px",
          }}
        >
          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={18} color="#333" />
          </button>

          <span style={{ fontSize: "16px", fontWeight: "700", color: "#1A1A1A" }}>
            Profile Admin
          </span>
        </div>
      </div>

      {/* Profile content */}
      <div style={{ padding: "12px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "14px",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "#E8DDD4",
            }}
          >
            <img
              src={profile.avatar}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Name"
                  style={inputStyle}
                />
                <input
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="Email"
                  type="email"
                  style={inputStyle}
                />
              </div>
            ) : (
              <>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#1A1A1A", marginBottom: "4px" }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: "13px", color: "#888" }}>{profile.email}</div>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
            {!editing && <UserCog size={22} color="#999" style={{ cursor: "pointer" }} />}

            {editing ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => { setDraft(profile); setEditing(false); }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.5)",
                    backgroundColor: "rgba(255,255,255,0.4)",
                    color: "#555",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={() => { setProfile(draft); setEditing(false); }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#2D4A2D",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setDraft(profile); setEditing(true); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 22px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#2D4A2D",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}