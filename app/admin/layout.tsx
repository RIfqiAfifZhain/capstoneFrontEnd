"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={15} strokeWidth={2} />,
    },
    {
      label: "Management Spot",
      href: "/admin/management-spot",
      icon: <FolderOpen size={15} strokeWidth={2} />,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #171717;
        }

        input::placeholder {
          color: #B7BDB2;
          font-style: italic;
          opacity: 1;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#F7F3F0",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "208px",
            minHeight: "100vh",
            backgroundColor: "#314D31",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            paddingTop: "22px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              paddingLeft: "28px",
              marginBottom: "44px",
            }}
          >
            <h1
              style={{
                color: "#EBEDEA",
                fontSize: "17px",
                fontWeight: "700",
                letterSpacing: "-0.3px",
                lineHeight: 1,
              }}
            >
              Pojok Teduh
            </h1>
          </div>

          {/* Nav */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              paddingRight: "0px",
            }}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    height: "46px",
                    paddingLeft: "28px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#314D31" : "rgba(255,255,255,0.90)",
                    backgroundColor: isActive ? "#E7EAE4" : "transparent",
                    borderRadius: "0px",
                    marginRight: "0px",
                    transition: "all 0.15s ease",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Container */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F7F3F0",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
