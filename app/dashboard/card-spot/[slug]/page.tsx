"use client";

import Image from "next/image";
import { ArrowLeft, Bookmark, Clock, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

const emojis = [
  { val: 1, src: "/pensive.png", srcColor: "/pensive-color.png", label: "Very Bad" },
  { val: 2, src: "/frowning.png", srcColor: "/frowning-color.png", label: "Bad" },
  { val: 3, src: "/neutral.png", srcColor: "/neutral-color.png", label: "Neutral" },
  { val: 4, src: "/smiley.png", srcColor: "/smiley-color.png", label: "Good" },
  { val: 5, src: "/beaming.png", srcColor: "/beaming-color.png", label: "Great" },
];

function ReviewModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    setIsSubmitting(true);
    await onSubmit(rating, text.trim());
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[24px] p-8 w-full max-w-[420px] relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <h2 className="text-[24px] font-extrabold text-[#1f2937] text-center">
              Rate and Review
            </h2>
            <p className="text-[13px] text-gray-400 text-center mt-1">
              Tell us what you feel and think!
            </p>

            <div className="flex justify-center gap-4 my-8">
              {emojis.map((e) => (
                <button
                  key={e.val}
                  onClick={() => setRating(e.val)}
                  className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${rating === e.val ? "scale-125 opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  <Image
                    src={rating === e.val ? e.srcColor : e.src}
                    alt={e.label}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="bg-[#EBEDEA] border border-gray-200 rounded-2xl p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-transparent text-[13px] text-gray-700 resize-none h-[100px] outline-none placeholder-gray-400"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || !text.trim() || isSubmitting}
                  className="bg-[#2f4b2f] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg hover:bg-[#3d6b3d] disabled:opacity-40 transition-all"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-[#f0faf0] border border-[#2f4b2f]/20 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 14 L12 20 L22 9"
                  stroke="#2f4b2f"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-[18px] font-bold text-gray-800">
              Review Submitted!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // 1. Fetch Detail Spot berdasarkan Slug
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const res = await fetch(`${apiUrl}/spots/${slug}`);
        if (!res.ok) throw new Error("Spot not found");
        const json = await res.json();
        const data = json.data || json;
        setPlace(data);
        
        // 2. Jika sukses dapat ID spot, baru kita fetch reviewnya
        if (data && data.id) {
            fetchReviews(data.id);
        }
      } catch (err) {
        console.error("Gagal menarik data detail spot:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [slug]);

  // Fungsi untuk menarik review dari Backend
  // Fungsi untuk menarik review dari Backend
  // Fungsi untuk menarik review dari Backend
  const fetchReviews = async (spotId: number) => {
    try {
        const res = await fetch(`${apiUrl}/spots/${spotId}/reviews`, { cache: 'no-store' });
        const json = await res.json();
        
        console.log("Struktur data dari Backend:", json);

        // PERBAIKAN: Backend kamu membungkus ulasan di dalam json.data.reviews
        if (json.data && Array.isArray(json.data.reviews)) {
            setReviews(json.data.reviews);
        } else {
            setReviews([]);
        }
    } catch (err) {
        console.error("Gagal menarik data review:", err);
        setReviews([]);
    }
  }

  // 3. Cek status Bookmark
  // Pastikan ini ada di dalam useEffect utama
// 1. Fetch Detail Spot DAN Review (Cukup panggil di sini saja)
  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/spots/${slug}`, { cache: 'no-store' });
        const json = await res.json();
        const data = json.data || json;
        setPlace(data);
        
        // Panggil review di sini agar sinkron setelah data spot didapat
        if (data?.id) {
          await fetchReviews(data.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [slug]);

  const fetchPlaceDetail = async () => {
    try {
        const res = await fetch(`${apiUrl}/spots/${slug}`, { cache: 'no-store' });
        const json = await res.json();
        const data = json.data || json;
        
        console.log("Spot ID yang didapat dari Backend:", data.id); // <--- LIHAT INI DI CONSOLE
        setPlace(data);
        
        if (data?.id) {
          fetchReviews(data.id);
        }
    } catch (err) {
        console.error("Gagal menarik data detail spot:", err);
    } finally {
        setLoading(false);
    }
};

  const toggleBookmark = () => {
    if (!place) return;
    const stored = localStorage.getItem("bookmarks");
    const bookmarks = stored ? JSON.parse(stored) : [];
    if (isBookmarked) {
      localStorage.setItem(
        "bookmarks",
        JSON.stringify(bookmarks.filter((b: any) => b.slug !== slug)),
      );
      setIsBookmarked(false);
    } else {
      localStorage.setItem(
        "bookmarks",
        JSON.stringify([...bookmarks, { slug, ...place }]),
      );
      setIsBookmarked(true);
    }
  };

  // 4. Submit Review Baru ke Backend (Method POST)
  // 4. Submit Review Baru ke Backend (Method POST)
  const handleNewReview = async (rating: number, text: string) => {
    if (!place || !place.id) return;
    
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                spot_id: Number(place.id), // Pastikan ID adalah angka
                rating: rating,
                comment: text
            })
        });

        if (res.ok) {
            // Kita BUKAN melakukan setReviews manual lagi,
            // tapi langsung memanggil fetchReviews untuk mengambil data terbaru dari database
            // Ini jauh lebih aman daripada memaksa state secara manual.
            await fetchReviews(Number(place.id));
            alert("Ulasan berhasil disimpan!");
        } else {
             const err = await res.json();
             console.error("Error dari server:", err);
             alert("Gagal menyimpan ulasan.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF2F3] font-bold text-[#2f4b2f]">
        Memuat detail spot...
      </div>
    );
    
  if (!place)
    return (
      <div className="p-10 text-center text-[#2f4b2f] font-bold">
        Spot yang kamu cari tidak ditemukan.
      </div>
    );

  const displayTags = [place.spotType, place.atmosphere, place.visitType, place.mood].filter(Boolean);
  const operatingHours = typeof place.operationalHours === 'string' ? place.operationalHours : "08:00 - 22:00";

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#FBF2F3" }}
    >
      <div className="relative w-full h-[260px]">
        <Image
          src={place.photoUrl || "/bg-library.webp"}
          alt={place.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF2F3]/30 via-[#FBF2F3]/70 to-[#FBF2F3]" />

        <div className="absolute top-5 left-5 right-5 flex items-center justify-between px-2 py-2 rounded-full bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 ml-1">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#2f4b2f] group transition-all"
            >
              <ArrowLeft
                size={18}
                className="text-[#2f4b2f] group-hover:text-white transition-colors"
              />
            </button>
            <span className="text-[#2f4b2f] text-[15px] font-bold tracking-tight">
              Detail Spot
            </span>
          </div>

          <button
            onClick={toggleBookmark}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center mr-1 shadow-sm"
          >
            <Bookmark
              size={17}
              className={
                isBookmarked ? "text-[#2f4b2f] fill-[#2f4b2f]" : "text-[#2f4b2f]"
              }
            />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-20 pt-5">
        {showReview && (
          <ReviewModal
            onClose={() => setShowReview(false)}
            onSubmit={(rating, text) => {
              handleNewReview(rating, text);
              setTimeout(() => setShowReview(false), 2000); 
            }}
          />
        )}

        <div className="flex items-start justify-between">
          <h1 className="text-[2rem] font-bold text-[#2f4b2f] leading-tight tracking-tight">
            {place.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 flex-shrink-0 ml-3">
            <Image src="/smiley-black.png" alt="rating" width={18} height={18} />
            <span className="font-bold text-[#2f4b2f] text-[14px]">
              {place.rating || "4.8"}
            </span>
          </div>
        </div>

        <p className="text-[#6b7280] text-[13px] mt-2 leading-relaxed">
          {place.description}
        </p>
        
        {/* PERBAIKAN: Fallback Alamat jika kosong di Database */}
        <p className="text-[#2f4b2f] text-[12px] font-semibold mt-4 italic">
          📍 {place.address || "Jakarta Raya, Indonesia"}
        </p>

        <div className="flex gap-4 mt-5 items-start">
          <div className="flex flex-col gap-2.5 flex-1">
             <div className="flex flex-wrap gap-2">
                {displayTags.map((tag: string, index) => (
                <span
                    key={index}
                    className="px-4 py-1.5 rounded-full bg-[#2f4b2f]/10 text-[#2f4b2f] text-[12px] font-bold capitalize"
                >
                    {tag}
                </span>
                ))}
             </div>
             
             {place.facilities && (
                 <div className="mt-2">
                     <span className="text-[12px] font-bold text-[#2f4b2f]">Fasilitas: </span>
                     <span className="text-[12px] text-gray-600">{place.facilities}</span>
                 </div>
             )}
          </div>

          <div className="bg-white rounded-2xl p-4 min-w-[170px] border border-[#2f4b2f]/20">
            <div className="flex items-center gap-1.5 mb-3 text-[12px] font-bold text-[#2f4b2f]">
              <Clock size={13} /> Operating Hours
            </div>
             <div className="flex justify-between items-center mb-1.5 text-[11px]">
                <span className="text-gray-400">Setiap Hari</span>
                <span className="font-bold text-[#2f4b2f]">
                  {operatingHours}
                </span>
              </div>
          </div>
        </div>

        {/* PERBAIKAN: Tombol Google Maps otomatis mencari berdasarkan Nama Tempat */}
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`, "_blank")}
          className="mt-6 mb-12 flex items-center gap-2 bg-[#2f4b2f] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#3d6b3d] transition-all"
        >
          Go There <ArrowRight size={16} />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[16px] text-[#2f4b2f]">
            Latest Review ({reviews.length})
          </h2>
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-1.5 bg-[#2f4b2f] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#3d6b3d] transition-all"
          >
            Write a Review
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {reviews.length === 0 ? (
              <p className="text-center text-sm text-gray-500 my-4 italic">Belum ada ulasan. Jadilah yang pertama memberikan review!</p>
          ) : (
             reviews.map((review: any) => (
                <div
                key={review.id}
                className="bg-white rounded-[24px] p-4 shadow-sm flex gap-3 items-start border border-gray-50"
                >
                <div className="w-10 h-10 rounded-full bg-[#c5a98e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {review.user?.username?.charAt(0).toUpperCase() || review.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-[13px] text-[#2f4b2f]">
                            {review.user?.username || review.name || "Anonymous"}
                        </p>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            ★ {review.rating}/5
                        </span>
                    </div>
                    
                    <p className="text-[12px] text-gray-400 mt-1 leading-relaxed font-medium">
                    {review.comment || review.text}
                    </p>
                </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}