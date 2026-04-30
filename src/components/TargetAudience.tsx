"use client";

import { SafeImage } from "./SafeImage";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { TargetAudienceContent } from "@/types/site-content";

interface TargetAudienceProps {
  content: TargetAudienceContent;
}

export function TargetAudience({ content }: TargetAudienceProps) {
  const audiences = content.items;
  const cardStyles = [
    { color: "from-[#FF2D78]/10 to-[#FF2D78]/5", borderColor: "border-[#FF2D78]/20" },
    { color: "from-[#FF6B9D]/10 to-[#FF6B9D]/5", borderColor: "border-[#FF6B9D]/20" },
    { color: "from-[#FF2D78]/10 to-[#FF6B9D]/5", borderColor: "border-[#FF2D78]/20" },
    { color: "from-[#FF6B9D]/10 to-[#FF2D78]/5", borderColor: "border-[#FF6B9D]/20" },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF2D78]/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF6B9D]/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimateOnScroll direction="up" delay={0}>
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight">
              {content.title}{" "}
              <span className="gradient-text">{content.highlightedTitle}</span>
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            // Keep visual style deterministic while text/image is CMS-driven.
            // Falls back to first style if item count exceeds presets.
            
            <AnimateOnScroll key={index} direction="up" delay={index * 150}>
              <div
                className={`group relative bg-gradient-to-br ${cardStyles[index]?.color ?? cardStyles[0].color} rounded-2xl border ${cardStyles[index]?.borderColor ?? cardStyles[0].borderColor} p-6 pt-0 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF2D78]/10 hover:-translate-y-2 overflow-visible`}
              >
                {/* Character image - pops above card */}
                <div className="flex justify-center -mt-4 mb-4">
                  <div className="relative">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="object-contain drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center pb-4">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
