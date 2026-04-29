"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { AboutContent } from "@/types/site-content";

interface AboutProps {
  content: AboutContent;
}

export function About({ content }: AboutProps) {

  return (
    <section
      id="about"
      className="relative overflow-visible py-8 lg:py-12"
    >
      <AnimateOnScroll direction="up" delay={0}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bordered card wrapper - z-[1] */}
        <div className="relative z-[1] bg-gradient-to-br from-[#EEF2FF] via-[#F0F4FF] to-[#EDE9FE] rounded-3xl border border-[#FF2D78]/15 shadow-xl shadow-[#FF2D78]/8 rotate-[-1deg]">

          {/* Background decorations */}
          <div className="absolute top-10 right-10 w-80 h-80 bg-[#FF2D78]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-[#FF6B9D]/8 rounded-full blur-3xl" />

          {/* TEXT CONTENT */}
          <div className="relative py-12 lg:py-20 lg:w-[70%] ml-4 sm:ml-8 lg:ml-12">
            <AnimateOnScroll direction="left" delay={0}>
              <div className="lg:pr-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-6">
                  <span className="text-sm font-semibold text-[#FF2D78]">
                    {content.badgeText}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0F172A] leading-tight mb-2">
                  <span className="gradient-text">{content.heading}</span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-500 font-medium mb-8">
                  <span className="text-[#FF2D78] font-semibold">{content.subheading}</span>
                </p>

                <div className="space-y-4">
                  {content.highlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-md bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-[15px] sm:text-base text-slate-700 leading-relaxed group-hover:text-[#0F172A] transition-colors duration-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="px-8 py-3.5 btn-gradient rounded-xl text-base font-semibold text-center"
                  >
                    Tư vấn miễn phí
                  </a>
                  <a
                    href="#courses"
                    className="px-8 py-3.5 bg-white text-[#FF2D78] border-2 border-[#FF2D78]/30 rounded-xl hover:bg-[#FF2D78]/5 hover:border-[#FF2D78] transition-all duration-300 text-base font-semibold text-center"
                  >
                    Xem khóa học
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* STUDENT IMAGE - OUTSIDE card, higher z-index, pops above the border */}
        <div className="hidden lg:block absolute z-[2] right-4 xl:right-8 bottom-0 pointer-events-none">
          <AnimateOnScroll direction="right" delay={200}>
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              width={480}
              height={640}
              className="h-[780px] xl:h-[820px] object-contain drop-shadow-[0_20px_40px_rgba(37,99,235,0.15)]"
              style={{ width: "auto" }}
              priority
            />
          </AnimateOnScroll>
        </div>

        {/* Mobile: student below card */}
        <div className="lg:hidden flex justify-center -mt-8">
          <Image
            src={content.imageSrc}
            alt={content.imageAlt}
            width={300}
            height={400}
            className="h-[350px] sm:h-[400px] object-contain drop-shadow-[0_10px_20px_rgba(37,99,235,0.1)]"
            style={{ width: "auto" }}
          />
        </div>
      </div>
      </AnimateOnScroll>
    </section>
  );
}
