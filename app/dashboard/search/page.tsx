"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const facilities = ["Indoor", "Busy", "Groups", "Relaxed", "Outdoor", "Quiet", "Alone", "Focused"];
const crowdedness = ["Low", "High"];

// ── DATA SEMUA SPOTS ──
const placeData = [
  {
    slug: "gowork-fatmawati",
    name: "GoWork Fatmawati",
    type: "Coworking Space",
    tags: ["Indoor", "Quiet", "Group", "Alone", "Focused", "Low"],
  },
  {
    slug: "foreword-library",
    name: "ForeWord Library",
    type: "Library",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
  },
  {
    slug: "urban-forest-cipete",
    name: "Urban Forest Cipete",
    type: "Park",
    tags: ["Outdoor", "High", "Busy", "Group", "Relaxed"],
  },
  {
    slug: "dialogue-artspace",
    name: "Dia.Lo.Gue Artspace",
    type: "Cafe, Art Gallery",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
  },
  {
    slug: "erasmus-huis",
    name: "Erasmus Huis",
    type: "Cultural Center",
    tags: ["Indoor", "Quiet", "Alone", "Focused", "Low"],
  },
  {
    slug: "tebet-eco-park",
    name: "Tebet Eco Park",
    type: "Park",
    tags: ["Outdoor", "Relaxed", "Group", "High"],
  },
  {
    slug: "taman-cempaka",
    name: "Taman Cempaka",
    type: "Park",
    tags: ["Outdoor", "Relaxed", "Alone", "Low"],
  },
];

// ── CARA PAKAI ──
// Di halaman/layout mana pun:
//   const [showFilter, setShowFilter] = useState(false);
//   <SearchFilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
//
// Trigger dari navbar search bar:
//   <input onClick={() => setShowFilter(true)} ... />

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchFilterModal({ isOpen, onClose }: SearchFilterModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCrowdedness, setSelectedCrowdedness] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleFacility = (item: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const toggleCrowdedness = (item: string) => {
    setSelectedCrowdedness((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSearch = () => {
    // Filter spots berdasarkan pilihan
    const matchedSlugs = placeData
      .filter((place) => {
        const tagsLower = place.tags.map((t) => t.toLowerCase());

        const nameMatch =
          !query ||
          place.name.toLowerCase().includes(query.toLowerCase()) ||
          place.type.toLowerCase().includes(query.toLowerCase());

        const facilityMatch =
          selectedFacilities.length === 0 ||
          selectedFacilities.some((f) => {
            if (f === "Groups") return tagsLower.includes("group");
            return tagsLower.includes(f.toLowerCase());
          });

        const crowdMatch =
          selectedCrowdedness.length === 0 ||
          selectedCrowdedness.some((c) => tagsLower.includes(c.toLowerCase()));

        return nameMatch && facilityMatch && crowdMatch;
      })
      .map((p) => p.slug);

    // Build query params lalu navigate ke /results
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedFacilities.length) params.set("facilities", selectedFacilities.join(","));
    if (selectedCrowdedness.length) params.set("crowdedness", selectedCrowdedness.join(","));
    if (matchedSlugs.length) params.set("slugs", matchedSlugs.join(","));

    onClose();
    router.push(`/results?${params.toString()}`);
  };

  return (
    // Overlay — klik di luar untuk tutup modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal card */}
      <div
        className="bg-white rounded-3xl flex flex-col gap-8 shadow-md"
        style={{
          width: "660px",
          padding: "40px 44px 44px 44px",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── SEARCH INPUT ── */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Find your quiet spot..."
            className="w-full px-5 py-3 rounded-full bg-[#f5f5f5] text-sm outline-none placeholder:text-gray-400 placeholder:italic"
          />
          <Search
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>

        {/* ── FACILITIES ── */}
        <div>
          <h2 className="text-[14px] font-bold text-gray-800 mb-4">
            Facilities
          </h2>

          {/* Row 1: Indoor  Busy  Groups  Relaxed */}
          <div className="flex gap-3 mb-3">
            {facilities.slice(0, 4).map((item) => (
              <button
                key={item}
                onClick={() => toggleFacility(item)}
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

          {/* Row 2: Outdoor  Quiet  Alone  Focused */}
          <div className="flex gap-3">
            {facilities.slice(4, 8).map((item) => (
              <button
                key={item}
                onClick={() => toggleFacility(item)}
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

        {/* ── CROWDEDNESS ── */}
        <div>
          <h2 className="text-[14px] font-bold text-gray-800 mb-4">
            Crowdedness
          </h2>
          <div className="flex gap-3">
            {crowdedness.map((item) => (
              <button
                key={item}
                onClick={() => toggleCrowdedness(item)}
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

        {/* ── SEARCH BUTTON ── */}
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="group flex items-center gap-2 bg-[#354e30] text-white text-[14px] font-semibold px-8 py-3 rounded-2xl hover:bg-[#c37379] transition-all duration-300"
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
  );
}