"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";

type BookmarkedPlace = {
  slug: string;
  name: string;
  image: string;
  type: string;
  rating: number;
  ratingIcon: string;
};

export default function BookmarkPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background:
          "linear-gradient(180deg, #f5c6cb 0%, #fbe8ea 30%, #fdf0f1 100%)",
      }}
    >
      {/* HEADER*/}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md rounded-full p-2 pr-10 shadow-sm border border-white/20">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 hover:bg-[#2f4b2f] group"
          >
            <ArrowLeft
              size={20}
              className="text-[#2f4b2f] transition-colors duration-300 group-hover:text-white"
            />
          </button>
          <span className="text-[#2f4b2f] font-bold text-lg tracking-tight">
            Bookmark
          </span>
        </div>
      </div>

      {/* MAIN CONTENT*/}
      <div className="max-w-6xl mx-auto px-10 pt-4 pb-12">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 gap-4 text-center">
            <Bookmark size={48} className="text-[#2f4b2f]/20" />
            <p className="text-[#2f4b2f]/50 text-base font-medium">
              No bookmarks yet.
              <br />
              Start saving your favorite quiet spots!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {bookmarks.map((place, index) => (
              <div
                key={place.slug}
                onClick={() =>
                  router.push(`/dashboard/card-spot/${place.slug}`)
                }
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  index !== bookmarks.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[#2f4b2f] text-[15px] font-bold leading-snug">
                    {place.name}
                  </p>
                  <p className="text-gray-400 text-[12px] mt-0.5">
                    {place.type}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(place.slug);
                  }}
                  className="flex-shrink-0"
                >
                  <Bookmark
                    size={18}
                    className="text-[#2f4b2f] fill-[#2f4b2f]"
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
