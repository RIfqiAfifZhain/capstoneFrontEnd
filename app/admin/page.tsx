"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

type Spot = {
  id: number;
  name: string;
  category: string;
  img: string;
  edited: string;
};

const INITIAL_SPOTS: Spot[] = [
  {
    id: 1,
    name: "Museum Layang-Layang",
    category: "park",
    img: "/museumlayang.png",
    edited: "6 minutes ago",
  },
  {
    id: 2,
    name: "Galeri Salihara",
    category: "park",
    img: "/salihara.jpg",
    edited: "45 minutes ago",
  },
  {
    id: 3,
    name: "TierSpace",
    category: "cafe",
    img: "/tierspace.png",
    edited: "8 hours ago",
  },
  {
    id: 4,
    name: "Perpustakaan Freedom",
    category: "library",
    img: "/freedomlib.jpg",
    edited: "1 day ago",
  },
  {
    id: 5,
    name: "GoWork Fatmawati",
    category: "cafe",
    img: "/gowork.png",
    edited: "2 days ago",
  },
  {
    id: 6,
    name: "Cinere Garden Food Street",
    category: "cafe",
    img: "/cinere.jpg",
    edited: "3 days ago",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [spots] = useState<Spot[]>(INITIAL_SPOTS);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/auth");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const cafeCount = spots.filter((s) => s.category === "cafe").length;
  const libraryCount = spots.filter((s) => s.category === "library").length;
  const parkCount = spots.filter((s) => s.category === "park").length;
  const latestEdits = spots.slice(0, 3);

  const stats = [
    { label: "Cafe Spot", count: cafeCount },
    { label: "Library Spot", count: libraryCount },
    { label: "Park Spot", count: parkCount },
  ];

  if (!isAuthorized) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF5F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
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

      <main style={{ padding: "8px 40px 40px", flex: 1 }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#354E30",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "4px",
          }}
        >
          Hello, Admin!
        </h2>
        <p style={{ fontSize: "13px", color: "#354E30", marginBottom: "24px" }}>
          Here&apos;s what&apos;s happening today!
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1.4px solid #2F2F2F",
                borderRadius: "16px",
                padding: "18px 20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "#2D4A2D",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "600",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <TrendingUp size={10} /> 2.5%
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#1A2E1A",
                  lineHeight: 1,
                  marginBottom: "6px",
                  marginTop: "4px",
                }}
              >
                {stat.count}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#354E30",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#354E30",
            marginBottom: "12px",
          }}
        >
          Latest Edits
        </h3>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #EDE8E2",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {latestEdits.map((spot, i) => (
            <div
              key={spot.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                borderBottom:
                  i < latestEdits.length - 1 ? "1px solid #F0EAE4" : "none",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
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
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1A2E1A",
                    marginBottom: "2px",
                  }}
                >
                  {spot.name}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  Last edited {spot.edited}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
