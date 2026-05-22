"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCog, Pencil, LogOut } from "lucide-react";

export default function ProfileAdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("Aisyah Rahma");
  const [email, setEmail] = useState("aisyah123@gmail.com");
  const [imgError, setImgError] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (!token || role !== "admin") {
    } else {
      setIsAuthorized(true);
    }

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    router.push("/");
  };

  if (!isAuthorized) return null;

  const AvatarBox = ({
    sizeClasses,
    textClass,
  }: {
    sizeClasses: string;
    textClass: string;
  }) => (
    <div
      className={`${sizeClasses} flex-shrink-0 bg-[#c5a98e] flex items-center justify-center rounded-3xl overflow-hidden`}
    >
      {imgError ? (
        <span className={`${textClass} font-bold text-white uppercase`}>
          {username.charAt(0)}
        </span>
      ) : (
        <Image
          src="/profilepic.jpg"
          alt="profile"
          width={120}
          height={120}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF5F0",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER TOPBAR */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => router.back()}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: backHover ? "#2D4A2D" : "#fff",
              border: "1px solid #E0D8D0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            <ArrowLeft
              size={18}
              color={backHover ? "#fff" : "#314D31"}
              style={{ transition: "color 0.2s ease" }}
            />
          </button>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1A2E1A",
            }}
          >
            Profile Admin
          </h2>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main
        style={{
          padding: "8px 40px 40px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card White Profile */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE8E2",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <AvatarBox
                sizeClasses="w-[100px] h-[100px]"
                textClass="text-4xl"
              />
              <div>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#1A2E1A",
                    marginBottom: "4px",
                  }}
                >
                  {username}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  {email}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "12px",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#333",
                  padding: "4px",
                }}
              >
                <UserCog size={24} />
              </button>

              <button
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
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON PLACED OUTSIDE CARD WITH GAP */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: "8px",
              border: "1.5px solid #2D4A2D",
              backgroundColor: "transparent",
              color: "#2D4A2D",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2D4A2D";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#2D4A2D";
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
