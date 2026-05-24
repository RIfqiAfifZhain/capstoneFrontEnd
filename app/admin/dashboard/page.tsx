"use client";

import Image from "next/image";
import {
  Search,
  Bookmark,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PlusCircle, // Tambahan icon untuk tombol Add Spot
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const facilitiesOptions = [
  "Indoor",
  "Busy",
  "Groups",
  "Relaxed",
  "Outdoor",
  "Quiet",
  "Alone",
  "Focused",
];
const crowdednessOptions = ["Low", "High"];

export default function AdminDashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Variabel untuk fitur Drag & Scroll
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  // State Autentikasi
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userInitial, setUserInitial] = useState("A");

  // State Pencarian
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCrowdedness, setSelectedCrowdedness] = useState<string[]>([]);

  // State Data API Backend
  const [apiSpots, setApiSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek Autentikasi & Role Admin
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Jika bukan admin, tendang kembali ke dashboard user
    if (!token || role !== "admin") {
      alert("Akses ditolak. Anda bukan Admin.");
      router.push("/dashboard");
      return;
    } else {
      setIsAuthorized(true);
      if (storedUsername) {
        setUserInitial(storedUsername.charAt(0).toUpperCase());
      }
    }

    // 2. Tarik Data Hidup dari API Vercel
    const fetchSpots = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        // Menggunakan rute admin agar data lebih lengkap jika diperlukan
        const res = await fetch(`${apiUrl}/admins/spots`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const json = await res.json();

        const spotsData = json.data || json;
        setApiSpots(Array.isArray(spotsData) ? spotsData : []);
      } catch (err) {
        console.error("Gagal menarik data dari API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [router]);

  // Fungsi Hapus (Hanya untuk Admin)
  const deleteSpot = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tempat ini? Tindakan ini tidak dapat dibatalkan.")) return;
    
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    try {
      const res = await fetch(`${apiUrl}/admins/spots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if(res.ok) {
         alert("Spot berhasil dihapus.");
         window.location.reload(); 
      } else {
         alert("Gagal menghapus spot.");
      }
    } catch (err) {
      console.error("Gagal menghapus", err);
    }
  };

  const handleSearchExecute = () => {
    if (
      !searchQuery.trim() &&
      selectedFacilities.length === 0 &&
      selectedCrowdedness.length === 0
    ) {
      return;
    }

    const params = new URLSearchParams();

    if (searchQuery) params.set("keyword", searchQuery);

    const facilitiesStr = selectedFacilities.map((f) => f.toLowerCase());

    if (facilitiesStr.includes("indoor")) params.set("spot_type", "indoor");
    if (facilitiesStr.includes("outdoor")) params.set("spot_type", "outdoor");

    if (facilitiesStr.includes("busy")) params.set("atmosphere", "busy");
    if (facilitiesStr.includes("quiet")) params.set("atmosphere", "quiet");

    if (facilitiesStr.includes("groups")) params.set("visit_type", "group");
    if (facilitiesStr.includes("alone")) params.set("visit_type", "alone");

    if (facilitiesStr.includes("relaxed")) params.set("mood", "relaxed");
    if (facilitiesStr.includes("focused")) params.set("mood", "focused");

    if (selectedCrowdedness.includes("Low")) params.set("crowdedness", "low");
    if (selectedCrowdedness.includes("High")) params.set("crowdedness", "high");

    setIsSearchOpen(false);

    router.push(`/dashboard/results?${params.toString()}`);
  };

  const toggleFilter = (
    item: string,
    state: string[],
    setState: (v: string[]) => void
  ) => {
    setState(
      state.includes(item) ? state.filter((i) => i !== item) : [...state, item]
    );
  };

  const onMouseDown = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    dragDistance.current = Math.abs(walk);
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const handleCardClick = (slug: string) => {
    if (dragDistance.current < 5) {
      router.push(`/dashboard/card-spot/${slug}`);
    }
  };

  const scrollRecent = (direction: "left" | "right") => {
    if (recentScrollRef.current) {
      const scrollAmount = 300;
      recentScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!isAuthorized) return null;

  return (
    <div
      className="min-h-screen bg-[#FBF2F3]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#2f4b2f] px-6 py-3 flex items-center justify-between rounded-b-[32px] shadow-md border-b-4 border-yellow-400">
        <div className="flex items-center gap-4">
          <Image
            src="/logo white.png"
            alt="logo"
            width={150}
            height={32}
            className="h-8 w-auto object-contain cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
          <span className="bg-yellow-400 text-[#2f4b2f] text-xs font-bold px-2 py-1 rounded-md">ADMIN MODE</span>
        </div>

        <div
          className="relative w-[42%] cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
        >
          <div className="w-full px-4 py-1.5 rounded-full bg-[#EBEDEA] text-[#C0C8BF] text-sm flex justify-between items-center italic">
            Find your quiet spot...
            <Search size={16} className="text-[#C0C8BF]" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/spots/add")}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#2f4b2f] text-sm font-bold px-4 py-2 rounded-full transition-colors"
          >
            <PlusCircle size={16} /> Add Spot
          </button>
          
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="w-9 h-9 rounded-full bg-[#c5a98e] flex items-center justify-center border border-white/20 cursor-pointer"
          >
            <span className="text-white text-xs font-bold tracking-wide">
              {userInitial}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH FILTER MODAL */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-3xl flex flex-col gap-8 shadow-md"
            style={{
              width: "660px",
              padding: "40px 44px 44px 44px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH INPUT */}
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchExecute()}
                placeholder="Find your quiet spot..."
                className="w-full px-5 py-3 rounded-full bg-[#f5f5f5] text-sm outline-none placeholder:text-gray-400 placeholder:italic text-gray-800"
              />
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>

            {/* FACILITIES */}
            <div>
              <h2 className="text-[14px] font-bold text-gray-800 mb-4">
                Facilities
              </h2>
              <div className="flex gap-3 mb-3">
                {facilitiesOptions.slice(0, 4).map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      toggleFilter(
                        item,
                        selectedFacilities,
                        setSelectedFacilities
                      )
                    }
                    className={`flex-1 py-2 rounded-xl border text-[13px] transition-all duration-200 ${
                      selectedFacilities.includes(item)
                        ? "bg-[#354e30] text-white border-[#354e30]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#354e30] hover:text-[#354e30]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                {facilitiesOptions.slice(4, 8).map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      toggleFilter(
                        item,
                        selectedFacilities,
                        setSelectedFacilities
                      )
                    }
                    className={`flex-1 py-2 rounded-xl border text-[13px] transition-all duration-200 ${
                      selectedFacilities.includes(item)
                        ? "bg-[#354e30] text-white border-[#354e30]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#354e30] hover:text-[#354e30]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CROWDEDNESS */}
            <div>
              <h2 className="text-[14px] font-bold text-gray-800 mb-4">
                Crowdedness
              </h2>
              <div className="flex gap-3">
                {crowdednessOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      toggleFilter(
                        item,
                        selectedCrowdedness,
                        setSelectedCrowdedness
                      )
                    }
                    className={`px-12 py-2 rounded-xl border text-[13px] transition-all duration-200 ${
                      selectedCrowdedness.includes(item)
                        ? "bg-[#354e30] text-white border-[#354e30]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#354e30] hover:text-[#354e30]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={handleSearchExecute}
                className="group flex items-center gap-2 bg-[#354e30] text-white text-[14px] font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Search
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT (Tanpa Hero Banner) */}
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-[#2f4b2f] font-semibold italic">
            Memuat data admin...
          </div>
        ) : (
          <>
            {/* TOP SATISFACTION PICKS */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[16px] text-[#2f4b2f]">
                  Manage Top Spots
                </h2>
              </div>
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none no-scrollbar"
                onMouseDown={(e) => onMouseDown(e, scrollRef)}
                onMouseMove={(e) => onMouseMove(e, scrollRef)}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                {apiSpots.slice(0, Math.ceil(apiSpots.length / 2)).map((place) => (
                  <div
                    key={place.id || place.slug}
                    onClick={() => handleCardClick(place.slug)}
                    className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition-shadow relative"
                  >
                    <div className="relative rounded-xl overflow-hidden h-[130px]">
                      <Image
                        src={place.photoUrl || "/bg-library.webp"}
                        alt={place.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 py-1 text-[10px] font-bold text-black">
                        <span className="capitalize">{place.spotType}</span>
                        <span className="flex items-center gap-1">
                          <Image
                            src="/smiley-black.png"
                            alt="rating"
                            width={12}
                            height={12}
                          />
                          {place.rating || "4.8"}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-3 font-bold text-sm text-[#2f4b2f] truncate">
                      {place.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                      {place.description}
                    </p>
                    
                    {/* TOMBOL CRUD ADMIN */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/spots/edit/${place.id}`);
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSpot(place.id);
                        }}
                        className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* EXPLORE OTHER SPOTS */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[16px] text-[#2f4b2f]">
                  Manage Other Spots
                </h2>
              </div>
              <div
                ref={recentScrollRef}
                className="flex gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none no-scrollbar scroll-smooth"
                onMouseDown={(e) => onMouseDown(e, recentScrollRef)}
                onMouseMove={(e) => onMouseMove(e, recentScrollRef)}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                {apiSpots.slice(Math.ceil(apiSpots.length / 2)).map((place) => (
                  <div
                    key={place.id || place.slug}
                    onClick={() => handleCardClick(place.slug)}
                    className="min-w-[300px] bg-white rounded-2xl shadow-sm p-3 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                        <Image
                        src={place.photoUrl || "/bg-library.webp"}
                        alt={place.name}
                        width={80}
                        height={80}
                        className="rounded-xl object-cover h-[80px]"
                        />
                        <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#2f4b2f] truncate">
                            {place.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                            {place.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                            <span className="text-[9px] text-gray-400 capitalize">
                            {place.spotType} • {place.atmosphere}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600">
                            <Image
                                src="/smiley-black.png"
                                alt="rating"
                                width={10}
                                height={10}
                            />
                            {place.rating || "4.5"}
                            </span>
                        </div>
                        </div>
                    </div>
                    
                    {/* TOMBOL CRUD ADMIN */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 w-full">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/spots/edit/${place.id}`);
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSpot(place.id);
                        }}
                        className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>

                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => scrollRecent("left")}
                  className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-[#2f4b2f]"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollRecent("right")}
                  className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-[#2f4b2f]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}