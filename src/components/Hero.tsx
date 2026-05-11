"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { HeroContent } from "@/types/site-content";

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-24 lg:pt-36 lg:pb-32 wave-divider">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#55B6F6]/5 via-transparent to-[#6EC2F7]/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#55B6F6]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6EC2F7]/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#55B6F6]/30 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#6EC2F7]/30 rounded-full animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-[#55B6F6]/20 rounded-full animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimateOnScroll direction="left" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#55B6F6]/10 border border-[#55B6F6]/20 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-[#55B6F6]" />
                <span className="text-sm font-medium text-[#55B6F6]">
                  {content.badgeText}
                </span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={150}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight">
                {content.title}{" "}
                <span className="gradient-text">{content.highlightedTitle}</span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={300}>
              <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
                {content.description}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={450}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="group px-8 py-4 btn-gradient rounded-xl text-lg font-semibold flex items-center justify-center gap-2 animate-glow"
                >
                  {content.primaryButtonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </a>

                <a
                  href="#courses"
                  className="px-8 py-4 bg-white text-[#55B6F6] border-2 border-[#55B6F6]/30 rounded-xl hover:bg-[#55B6F6]/5 hover:border-[#55B6F6] transition-all duration-300 text-lg font-semibold text-center"
                >
                  {content.secondaryButtonText}
                </a>
              </div>
            </AnimateOnScroll>

            {/* Trust indicators */}
            <AnimateOnScroll direction="up" delay={600}>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-3">
                  {["👩‍🎓", "👨‍🎓", "👩‍💼", "👨‍💻"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] border-3 border-white flex items-center justify-center text-lg shadow-md"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    4.9/5 từ 500+ đánh giá
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Image */}
          <AnimateOnScroll direction="right" delay={200}>
            <div className="relative transform rotate-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] rounded-3xl blur-3xl opacity-15 transform rotate-1 scale-105" />
              <div className="relative rounded-3xl overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, black 60%, transparent 100%)', maskComposite: 'intersect', WebkitMaskComposite: 'destination-in' }}>
                <Image
                  src={content.imageSrc}
                  alt={content.imageAlt}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{content.floatPassRateLabel}</p>
                    <p className="text-2xl font-bold text-[#0F172A]">{content.floatPassRateValue}</p>
                  </div>
                </div>
              </div>

              {/* Floating card top-left */}
              <div className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-2xl p-3 border border-slate-100 animate-float-delayed hidden sm:block z-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-lg">
                    🎓
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{content.floatStudentsLabel}</p>
                    <p className="text-sm font-bold text-[#0F172A]">{content.floatStudentsValue}</p>
                  </div>
                </div>
              </div>

              {/* Floating card right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-3 border border-slate-100 animate-float-delayed hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6EC2F7] to-[#55B6F6] flex items-center justify-center text-white text-sm font-bold">
                    🇩🇪
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{content.floatEnrollmentLabel}</p>
                    <p className="text-sm font-bold text-[#0F172A]">{content.floatEnrollmentValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
