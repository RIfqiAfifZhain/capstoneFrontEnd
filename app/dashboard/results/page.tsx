"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Kita tangkap semua filter (keyword, spot_type, dll) dari URL
        // lalu lemparkan langsung ke API Backend untuk dicari di Database Neon
        const res = await fetch(`${apiUrl}/spots/search?${searchParams.toString()}`);
        const json = await res.json();
        
        const data = json.data || json || [];
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal menarik data pencarian:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  return (
    <div 
      className="min-h-screen bg-[#FBF2F3] px-6 py-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-[#2f4b2f] hover:text-white transition-colors text-[#2f4b2f]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-[#2f4b2f]">Search Results</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <p className="text-[#2f4b2f] font-semibold italic">Mencari tempat teduh untukmu...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
           <p className="text-gray-500 text-sm italic">
             Tidak ada tempat yang sesuai dengan kriteria pencarianmu. Coba ubah filternya ya!
           </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((place) => {
            // Kita kumpulkan atribut untuk dijadikan "Tags" UI
            const displayTags = [
              place.spotType,
              place.atmosphere,
              place.visitType,
              place.mood,
              place.crowdedness
            ].filter(Boolean);

            return (
              <div
                key={place.id}
                onClick={() => router.push(`/dashboard/card-spot/${place.slug}`)}
                className="bg-white p-3 rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition border border-transparent hover:border-[#2f4b2f]/20 flex gap-4 items-center"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={place.photoUrl || "/bg-library.webp"}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-[#2f4b2f] truncate">{place.name}</h2>
                  <p className="text-[11px] text-gray-400 mt-1 capitalize leading-relaxed">
                    {displayTags.join(" • ")}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Image src="/smiley-black.png" alt="rating" width={14} height={14} />
                    <span className="text-[12px] font-bold text-gray-700">{place.rating || "4.8"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}