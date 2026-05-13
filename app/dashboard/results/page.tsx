"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const places = [
  {
    id: 1,
    slug: "gowork-fatmawati",
    name: "GoWork Fatmawati",
    tags: ["Indoor", "Quiet", "Group", "Focused"],
    crowdedness: "High",
  },
  {
    id: 2,
    slug: "foreword-library",
    name: "ForeWord Library",
    tags: ["Indoor", "Quiet", "Alone", "Focused"],
    crowdedness: "Low",
  },
  {
    id: 3,
    slug: "urban-forest-cipete",
    name: "Urban Forest Cipete",
    tags: ["Outdoor", "Relaxed", "Alone", "Busy"],
    crowdedness: "Low",
  },
  {
    id: 4,
    slug: "dialogue-artspace",
    name: "Dia.Lo.Gue Artspace",
    tags: ["Indoor", "Quiet", "Alone", "Focused"],
    crowdedness: "High",
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q")?.toLowerCase() || "";
  const facilities = searchParams.get("facilities")?.split(",") || [];
  const crowdedness = searchParams.get("crowdedness")?.split(",") || [];

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const matchQuery = !query || p.name.toLowerCase().includes(query);

      const matchFacilities =
        facilities.length === 0 ||
        facilities.every((f) =>
          p.tags.map((t) => t.toLowerCase()).includes(f.toLowerCase()),
        );

      const matchCrowd =
        crowdedness.length === 0 ||
        crowdedness.some(
          (c) => p.crowdedness.toLowerCase() === c.toLowerCase(),
        );

      return matchQuery && matchFacilities && matchCrowd;
    });
  }, [query, facilities, crowdedness]);

  useEffect(() => {
    if (filtered.length === 1) {
      router.replace(`/dashboard/card-spot/${filtered[0].slug}`);
    }
  }, [filtered, router]);

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-8">
      {/* HEADER DENGAN ICON BACK */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-[#2f4b2f]" />
        </button>
        <h1 className="text-lg font-bold text-[#2f4b2f]">Search Results</h1>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm italic ml-2">
          No places found. Try adjusting your filters.
        </p>
      )}

      {/* RESULTS */}
      <div className="flex flex-col gap-3">
        {filtered.map((place) => (
          <div
            key={place.id}
            onClick={() => router.push(`/dashboard/card-spot/${place.slug}`)}
            className="bg-white p-4 rounded-xl cursor-pointer hover:shadow-sm transition border border-transparent hover:border-[#2f4b2f]/20"
          >
            <h2 className="font-semibold text-[#2f4b2f]">{place.name}</h2>

            <p className="text-xs text-gray-500 mt-1">
              {place.tags.join(", ")} • {place.crowdedness}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
