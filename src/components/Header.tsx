"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "#about", label: "Về chúng tôi" },
  { href: "#roadmap", label: "Lộ trình" },
  { href: "#courses", label: "Khóa học" },
  { href: "#method", label: "Phương pháp" },
  { href: "#testimonials", label: "Cảm nhận" },
  { href: "#contact", label: "Liên hệ" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <Image
            src="/images/logo_linguagerman.png"
            alt="Lingua German Logo"
            width={64}
            height={64}
            className="group-hover:scale-105 transition-all duration-300"
          />
          <div>
            <span className="text-lg font-bold text-[#0F172A]">Lingua</span>
            <span className="text-lg font-bold gradient-text ml-1">German</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#FF2D78] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#FF2D78] after:to-[#FF6B9D] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#contact"
            className="group px-6 py-2.5 btn-gradient rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            Đăng ký ngay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-[#FF2D78] transition-colors"
          aria-label="Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:text-[#FF2D78] hover:bg-[#FF2D78]/5 rounded-xl transition-all font-medium"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 px-4">
            <a
              href="#contact"
              onClick={() => setIsMobileOpen(false)}
              className="block w-full text-center px-6 py-3 btn-gradient rounded-xl font-semibold"
            >
              Đăng ký ngay
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
