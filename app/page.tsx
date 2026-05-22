"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Map,
  ListFilter,
  Star,
  Navigation,
  Volume2,
  Users,
  Wifi,
  Gem,
  Rocket,
  ArrowRight,
  Play,
  BrainCog,
  BadgeCheck,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("explore");
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const sections = ["explore", "about"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinkClass = (id: string) =>
    activeSection === id
      ? "relative text-sm font-bold text-[#354e30] after:content-[''] after:block after:mt-0.5 after:border-b-2 after:border-[#354e30] after:scale-x-100 transition-all"
      : "relative text-sm text-[#6b7c6a] hover:text-[#c1697a] transition-all after:content-[''] after:block after:mt-0.5 after:border-b-2 after:border-[#c1697a] after:scale-x-0 hover:after:scale-x-[0.7] after:transition-transform after:duration-100 after:ease-linear";

  return (
    <div className="min-h-screen bg-[#f5f2ee] font-sans">
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#f5f2ee]/95 shadow-md backdrop-blur-md"
            : "bg-[#f5f2ee]"
        } border-b border-[#e0dbd4]`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("explore")}
            className="flex items-center gap-2"
          >
            <Image
              src="/Group 3.png"
              alt="logo"
              width={47}
              height={47}
              className="object-contain"
            />
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("explore")}
              className={navLinkClass("explore")}
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={navLinkClass("about")}
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth?mode=signin"
              className="text-sm font-medium text-[#354e30] hover:text-[#202f1d] px-2 py-1.5 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold bg-[#354e30] text-white px-5 py-2 rounded-lg hover:bg-[#2a3d25] transition-all duration-200 shadow-sm"
            >
              Sign Up
            </Link>
            <button
              ref={hamburgerRef}
              className="md:hidden text-[#354e30] p-1 ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <div
          ref={menuRef}
          className={`absolute top-16 left-0 w-full bg-[#f5f2ee] border-b border-[#e0dbd4] px-6 py-6 flex flex-col gap-4 shadow-xl transition-all duration-300 md:hidden z-40 ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => scrollToSection("explore")}
            className="text-xl font-medium text-[#354e30] text-left py-2"
          >
            Explore
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-xl font-medium text-[#354e30] text-left py-2"
          >
            About
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="explore" className="scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#354e30] leading-tight">
              Find a <span className="text-[#c1697a]">Quiet Spot</span> Amid the
              City's Hustle and Bustle
            </h1>
            <p className="mt-5 text-[#6b7c6a] text-base leading-relaxed max-w-md">
              Pojok Teduh helps you discover and share the most peaceful,
              low-noise spots in your urban neighborhood.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="flex items-center gap-2 bg-[#354e30] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2a3d25] transition-all duration-200 text-sm shadow-sm"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="flex items-center gap-2 border border-[#354e30] text-[#354e30] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#354e30] hover:text-white transition-all duration-200 text-sm">
                <Play className="w-4 h-4" /> Watch the Demo
              </button>
            </div>
          </div>

          <div className="relative group h-80">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#e0dbd4]">
              <Image
                src="/bg-library.webp"
                alt="quiet spot"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl shadow-md px-4 py-3 flex items-start gap-3 max-w-[210px] z-10">
              <BadgeCheck className="w-5 h-5 text-[#354e30] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#354e30]">
                  Quiet Score: 4.5
                </p>
                <p className="text-[10px] text-[#6b7c6a] font-medium">
                  Verified Sanctuary
                </p>
                <p className="text-[10px] text-[#6b7c6a] mt-1 italic">
                  "The quietest spot in the Menteng area for deep work."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* URBAN REALITY */}
        <div className="bg-[#2d4228] text-white py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#c1697a] mb-4 uppercase">
                Urban Reality
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Your Productivity Is Disrupted
                <br />
                by <span className="text-[#c1697a]">City Noise</span>
              </h2>
            </div>
            <div className="space-y-7">
              {[
                {
                  icon: <Volume2 className="w-5 h-5" />,
                  title: "Constant Noise Pollution",
                  desc: "Vehicle horns and the hustle of the streets disrupt your deepest focus.",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Endless Crowds",
                  desc: "Popular cafes are always packed, making it hard to find a comfortable place to sit.",
                },
                {
                  icon: <Wifi className="w-5 h-5" />,
                  title: "Unstable Connectivity",
                  desc: "Spending hours only to realize the place lacks basic facilities like reliable internet.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 group cursor-default"
                >
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#c1697a] group-hover:bg-[#c1697a] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[#a8c49e] text-xs mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="scroll-mt-16">
        {/* SOLUTIONS */}
        <div className="bg-[#f5f2ee] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#354e30]">
              Smart Solutions for Your
              <br />
              Peace of Mind
            </h2>
            <p className="mt-4 text-[#6b7c6a] text-sm leading-relaxed max-w-md mx-auto">
              Pojok Teduh carefully selects every corner of the city to ensure
              you enjoy maximum comfort.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Map className="w-6 h-6 text-[#354e30]" />,
                title: "Top Recommendations",
                desc: "Explore the area with the Recommendation.",
                bg: "bg-[#e8eddf] hover:bg-[#d8e5cc]",
                titleColor: "text-[#354e30]",
              },
              {
                icon: <ListFilter className="w-6 h-6 text-[#c1697a]" />,
                title: "Filter",
                desc: "Find a spot that suits your needs—Wi-Fi, outlets, or quiet atmosphere.",
                bg: "bg-[#f7e4e7] hover:bg-[#f0d0d5]",
                titleColor: "text-[#c1697a]",
              },
              {
                icon: <Star className="w-6 h-6 text-[#c1697a]" />,
                title: "Satisfaction Score",
                desc: "View the calmness level based on real-time user reports.",
                bg: "bg-[#f7e4e7] hover:bg-[#f0d0d5]",
                titleColor: "text-[#c1697a]",
              },
              {
                icon: <Navigation className="w-6 h-6 text-[#354e30]" />,
                title: "Direct Navigation",
                desc: "Get directions to the location via Google Maps or Waze.",
                bg: "bg-[#e8eddf] hover:bg-[#d8e5cc]",
                titleColor: "text-[#354e30]",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`${card.bg} rounded-2xl p-7 cursor-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="mb-4">{card.icon}</div>
                <h3
                  className={`font-bold text-xl ${card.titleColor} tracking-tight`}
                >
                  {card.title}
                </h3>
                <p className="text-[#6b7c6a] text-xs mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* QUALITY OF LIFE */}
        <section className="relative bg-[#f5f2ee] overflow-hidden min-h-[500px] flex items-center">
          <div className="relative z-30 max-w-6xl mx-auto px-6 w-full">
            <div className="grid md:grid-cols-2">
              <div className="py-20 md:pr-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#354e30] leading-tight mb-14 max-w-xl">
                  Improving Your Quality of Life in Every Corner of the City
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      icon: <BrainCog className="w-5 h-5 text-[#354e30]" />,
                      title: "Significant Stress Reduction",
                      desc: "Finding a quiet spot instantly lowers your cortisol levels in the middle of a busy day.",
                    },
                    {
                      icon: <Gem className="w-5 h-5 text-[#c1697a]" />,
                      title: "Access to Hidden Gems",
                      desc: "Discover private libraries, hidden cafes, and city parks that few people know about.",
                    },
                    {
                      icon: <Rocket className="w-5 h-5 text-[#354e30]" />,
                      title: "Unlimited Productivity",
                      desc: "Get your work done twice as fast with an environment that supports deep work.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="mt-1 shrink-0 opacity-80">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-[#354e30]">
                          {item.title}
                        </h3>
                        <p className="text-[#6b7c6a] text-sm mt-1.5 leading-relaxed max-w-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden md:block"></div>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 z-10 hidden md:block">
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#f5f2ee] from-0% via-[#f5f2ee] via-10% to-transparent to-60%" />
            <Image
              src="/bg-cafe.jpeg"
              alt="cafe spot"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#f5f2ee] py-20 px-6">
          <div className="max-w-6xl mx-auto bg-[#2d4228] rounded-[2.5rem] p-12 md:p-20 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
              Start finding your
              <br />
              <span className="text-[#c1697a]">perfect spot</span> today.
            </h2>
            <p className="mt-6 text-[#a8c49e] text-base leading-relaxed max-w-xl mx-auto">
              Join thousands of other city dwellers who have
              <br />
              found their sanctuary at Pojok Teduh.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-[#1a2e18] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#111f10] transition-all duration-200 shadow-md text-sm"
              >
                Sign Up Now
              </Link>
              <button className="bg-white/90 text-[#2d4228] px-6 py-2.5 rounded-lg font-semibold hover:bg-white transition-all duration-200 shadow-md text-sm">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1e2d1b] text-[#a8c49e] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div>
            <p className="text-white font-bold text-base">Pojok Teduh</p>
            <p className="text-xs mt-1">
              © 2026 Pojok Teduh. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
