"use client";

import Image from "next/image";
import {
  Search,
  Bookmark,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const places = [
  {
    id: 1,
    slug: "gowork-fatmawati",
    name: "GoWork Fatmawati",
    type: "Coworking Space",
    rating: 4.8,
    ratingIcon: "/beaming-black.png",
    image: "/gowork.png",
  },
  {
    id: 2,
    slug: "foreword-library",
    name: "ForeWord Library",
    type: "Library",
    rating: 4.8,
    ratingIcon: "/beaming-black.png",
    image: "/foreword.png",
  },
  {
    id: 3,
    slug: "urban-forest-cipete",
    name: "Urban Forest Cipete",
    type: "Park",
    rating: 4.6,
    ratingIcon: "/beaming-black.png",
    image: "/urbanforest.png",
  },
  {
    id: 4,
    slug: "dialogue-artspace",
    name: "Dia.Lo.Gue Artspace",
    type: "Cafe, Art Gallery",
    rating: 4.5,
    ratingIcon: "/smiley-black.png",
    image: "/dialogue.png",
  },
];

const recentPlaces = [
  {
    id: 1,
    slug: "erasmus-huis",
    name: "Erasmus Huis",
    type: "Cultural Center",
    rating: 4.8,
    lastVisited: "5 mins ago",
    ratingIcon: "/beaming-black.png",
    image: "/erasmus.png",
    description:
      "A Dutch cultural center library with a minimalist, all-white interior design.",
  },
  {
    id: 2,
    slug: "tebet-eco-park",
    name: "Tebet Eco Park",
    type: "Park",
    rating: 4.7,
    lastVisited: "20 mins ago",
    ratingIcon: "/beaming-black.png",
    image: "/tebet.png",
    description:
      "Perfect for those who want to clear their minds in the heart of the city.",
  },
  {
    id: 3,
    slug: "taman-cempaka",
    name: "Taman Cempaka",
    type: "Park",
    rating: 4.6,
    lastVisited: "1 hour ago",
    ratingIcon: "/smiley-black.png",
    image: "/cempaka.png",
    description: "Perfect for those who are tired of being indoors.",
  },
];

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

export default function DashboardPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userInitial, setUserInitial] = useState("A");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCrowdedness, setSelectedCrowdedness] = useState<string[]>([]);
  const [allPlaces, setAllPlaces] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      router.push("/auth");
    } else {
      setIsAuthorized(true);
      if (storedUsername) {
        setUserInitial(storedUsername.charAt(0).toUpperCase());
      }
    }

    fetch("/data/places.json")
      .then((res) => res.json())
      .then((data) => {
        const placesArray = Object.keys(data).map((slug) => ({
          slug,
          ...data[slug],
        }));
        setAllPlaces(placesArray);
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleSearchExecute = () => {
    if (
      !searchQuery.trim() &&
      selectedFacilities.length === 0 &&
      selectedCrowdedness.length === 0
    ) {
      return;
    }

    const matchedSlugs = allPlaces
      .filter((place) => {
        const tagsLower = place.tags.map((t: string) => t.toLowerCase());

        const nameMatch =
          !searchQuery ||
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.type.toLowerCase().includes(searchQuery.toLowerCase());

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

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedFacilities.length)
      params.set("facilities", selectedFacilities.join(","));
    if (selectedCrowdedness.length)
      params.set("crowdedness", selectedCrowdedness.join(","));
    if (matchedSlugs.length) params.set("slugs", matchedSlugs.join(","));

    setIsSearchOpen(false);
    router.push(`/dashboard/results?${params.toString()}`);
  };

  const toggleFilter = (
    item: string,
    state: string[],
    setState: (v: string[]) => void,
  ) => {
    setState(
      state.includes(item) ? state.filter((i) => i !== item) : [...state, item],
    );
  };

  const onMouseDown = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement | null>,
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#2f4b2f] px-6 py-3 flex items-center justify-between rounded-b-[32px] shadow-md">
        <Image
          src="/logo white.png"
          alt="logo"
          width={150}
          height={32}
          className="h-8 w-auto object-contain cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

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
          <Bookmark
            className="text-white cursor-pointer hover:opacity-80 transition-opacity"
            size={20}
            onClick={() => router.push("/dashboard/bookmark")}
          />
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
                        setSelectedFacilities,
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
                        setSelectedFacilities,
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
                        setSelectedCrowdedness,
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

      {/* HERO */}
      <div className="relative w-full h-[350px]">
        <Image
          src="/bg-library.webp"
          alt="hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/25 to-[#FBF2F3]" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-center px-4">
          <h1 className="text-[2rem] font-bold text-[#2f4b2f] leading-tight tracking-tight">
            Discover Your Teduh Spot!
          </h1>
          <p className="text-[#2f4b2f] mt-2 max-w-sm text-sm font-medium">
            Discover quiet spaces, curated for focus and tranquility in the
            heart of the city.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-6 pb-12 mt-6">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[16px] text-[#2f4b2f]">
              Top Satisfaction Picks
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
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => handleCardClick(place.slug)}
                className="min-w-[220px] bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition-shadow"
              >
                <div className="relative rounded-xl overflow-hidden h-[130px]">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-2 py-1 text-[10px] font-bold text-black">
                    <span>{place.type}</span>
                    <span className="flex items-center gap-1">
                      <Image
                        src={place.ratingIcon}
                        alt="rating"
                        width={12}
                        height={12}
                      />
                      {place.rating}
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-sm text-[#2f4b2f]">
                  {place.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                  A cozy spot with a relaxed atmosphere—perfect for taking a
                  quick break.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[16px] text-[#2f4b2f]">
              Recently Viewed
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
            {recentPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => handleCardClick(place.slug)}
                className="min-w-[300px] bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <Image
                  src={place.image}
                  alt={place.name}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-[#2f4b2f] truncate">
                    {place.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                    {place.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <span className="text-[9px] text-gray-400">
                      Last Visited: {place.lastVisited}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-600">
                      <Image
                        src={place.ratingIcon}
                        alt="rating"
                        width={10}
                        height={10}
                      />
                      {place.rating}
                    </span>
                  </div>
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
