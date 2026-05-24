// fail: src/lib/api.ts

// Mengambil URL dari .env.local, atau menggunakan default localhost:8080
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Fungsi bantuan untuk sentiasa membawa Token ke Backend (jika pengguna sudah log masuk)
export const getAuthHeaders = () => {
  let token = null;
  
  // Pastikan ia berjalan di browser (client-side)
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};