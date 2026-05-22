"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/bg-library.webp"
        alt="background"
        fill
        className="object-cover blur-[2px] scale-100 brightness-90"
      />
      <div className="absolute inset-0 bg-white/40"></div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[360px] mb-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#354e30] hover:text-[#202f1d] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <AuthCard isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
      </div>
    </main>
  );
}

function AuthCard({
  isSignUp,
  setIsSignUp,
}: {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    // Menentukan endpoint API Swagger secara dinamis berdasarkan input email
    let endpoint = "";
    const isAdminEmail = email.toLowerCase().includes("admin");

    if (isSignUp) {
      endpoint = isAdminEmail ? "/auth/admin/register" : "/auth/user/register";
    } else {
      endpoint = isAdminEmail ? "/auth/admin/login" : "/auth/user/login";
    }

    const payload = {
      ...(isSignUp && { username }),
      email,
      password,
    };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isSignUp ? "Registrasi Berhasil!" : "Login Berhasil!");

        if (!isSignUp) {
          const token = result.token || result.data?.token;
          const storedName = result.username || result.data?.username;

          if (token) {
            localStorage.setItem("token", token);
          }
          if (storedName) {
            localStorage.setItem("username", storedName);
          }
          if (email) {
            localStorage.setItem("email", email);
          }

          // Menyimpan penanda hak akses (role) ke localStorage berdasarkan endpoint yang ditembak
          if (isAdminEmail) {
            localStorage.setItem("role", "admin");
            router.push("/admin");
          } else {
            localStorage.setItem("role", "user");
            router.push("/dashboard");
          }
        } else {
          setIsSignUp(false);
        }
      } else {
        alert("Gagal: " + (result.message || "Data tidak valid"));
      }
    } catch (error) {
      alert("Koneksi gagal ke backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-6 w-full max-w-[360px] mx-auto">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/Group 3.png"
          alt="logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>

      <h2 className="text-center text-sm mt-4 text-[#354e30] font-semibold">
        Welcome, Kawan Teduh!
      </h2>

      <form className="space-y-4 mt-8" onSubmit={handleAuth}>
        {isSignUp && (
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
        )}

        <Input
          label="Email"
          placeholder="example@mail.com"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          placeholder="******"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        {!isSignUp && (
          <div className="text-right text-xs font-medium text-[#354e30] mt-0.5 cursor-pointer hover:underline transition">
            Forgot password?
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#354e30] text-[#ebedea] py-3 rounded-md hover:bg-[#202f1d] transition font-medium mt-2 disabled:opacity-50"
        >
          {loading ? "Memproses..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <div className="text-center text-sm mt-4 text-[#354e30]">
        {isSignUp ? (
          <>
            Have an account?{" "}
            <span
              className="font-semibold cursor-pointer hover:text-black transition"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </span>
          </>
        ) : (
          <>
            Didn&apos;t have an account?{" "}
            <span
              className="font-semibold cursor-pointer hover:text-black transition"
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: any;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm mb-1 text-[#354e30] font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-gray-100 text-black rounded-md px-3 py-2 pr-10 outline-none text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#354e30] transition"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#354e30] transition-colors focus:outline-none"
          >
            {show ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
