// lib/spots-data.ts
// Letakkan file ini di: src/lib/spots-data.ts (atau lib/spots-data.ts)

export type Spot = {
  slug: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  ratingEmoji: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
  operatingHours: { day: string; hours: string; closed: boolean }[];
};

export const spots: Spot[] = [
  {
    slug: "gowork-fatmawati",
    name: "GoWork Fatmawati",
    type: "Coworking Space",
    image: "/gowork.png",
    rating: 4.8,
    ratingEmoji: "😁",
    shortDesc:
      "Commercial workspace with premium amenities and reliable internet.",
    fullDesc:
      "A commercial workspace with premium amenities. It's perfect if you need a highly reliable internet connection and a work environment surrounded by other professionals.",
    tags: ["Indoor", "Quiet", "Group", "Alone", "Focused", "Low"],
    operatingHours: [
      { day: "Mon – Fri", hours: "8 AM – 8 PM", closed: false },
      { day: "Sat", hours: "9 AM – 10 PM", closed: false },
      { day: "Sun", hours: "Closed", closed: true },
    ],
  },
  {
    slug: "foreword",
    name: "ForeWord Library",
    type: "Library",
    image: "/foreword.png",
    rating: 4.8,
    ratingEmoji: "😁",
    shortDesc: "A private library with a cozy atmosphere for deep focus.",
    fullDesc:
      "A private library with a cozy and stylish atmosphere. This place is designed to maintain a peaceful environment, making it perfect for those who need to concentrate fully without any noise disturbances.",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
    operatingHours: [
      { day: "Tue – Fri", hours: "11 AM – 7:30 PM", closed: false },
      { day: "Sat", hours: "9 AM – 5 PM", closed: false },
      { day: "Sun – Mon", hours: "Closed", closed: true },
    ],
  },
  {
    slug: "urban-forest-cipete",
    name: "Urban Forest Cipete",
    type: "Park",
    image: "/urbanforest.png",
    rating: 4.6,
    ratingEmoji: "😄",
    shortDesc: "Lush green open space in the heart of the city.",
    fullDesc:
      "A lush green open space in the heart of the city. Perfect for those who are tired of being indoors and want to get some work done in a relaxed atmosphere while enjoying the fresh air under the trees.",
    tags: ["Outdoor", "High", "Busy", "Group", "Relaxed"],
    operatingHours: [
      { day: "Sun – Sat", hours: "7 AM – 10 PM", closed: false },
    ],
  },
  {
    slug: "dialogue-artspace",
    name: "Dia.Lo.Gue Artspace",
    type: "Cafe, Art Gallery",
    image: "/dialogue.png",
    rating: 4.5,
    ratingEmoji: "😊",
    shortDesc:
      "Contemporary art gallery with iconic all-white minimalist interior.",
    fullDesc:
      "A contemporary art gallery featuring an iconic all-white minimalist interior design. The atmosphere is professional yet relaxed, making it the perfect spot for those who want to read, work on assignments, or simply seek inspiration among the artworks.",
    tags: ["Indoor", "Low", "Quiet", "Alone", "Focused"],
    operatingHours: [
      { day: "Mon – Fri", hours: "11 AM – 8 PM", closed: false },
      { day: "Sat – Sun", hours: "8 AM – 8 PM", closed: false },
    ],
  },
];

export function getSpotBySlug(slug: string): Spot | undefined {
  return spots.find((s) => s.slug === slug);
}
