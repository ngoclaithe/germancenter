"use client";

import { AnimateOnScroll } from "./AnimateOnScroll";
import type { TeachingMethodContent } from "@/types/site-content";

interface TeachingMethodProps {
  content: TeachingMethodContent;
}

export function TeachingMethod({ content }: TeachingMethodProps) {
  const methods = content.methods;

  return (
    <section id="method" className="py-24 bg-[#FFF5F8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B9D]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              {content.title}{" "}
              <span className="gradient-text">{content.highlightedTitle}</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method, index) => (
            <AnimateOnScroll key={index} direction="up" delay={index * 100}>
              <div
                className={`group relative bg-gradient-to-br ${method.bg} rounded-3xl border border-slate-200 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF2D78]/10 hover:-translate-y-2 hover:border-[#FF2D78]/30 overflow-hidden ${method.rotate} ${
                  method.size === "large" ? "lg:col-span-1 lg:row-span-1" : ""
                }`}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  {/* Large emoji */}
                  <div className="text-5xl mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 inline-block">
                    {method.emoji}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{method.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{method.description}</p>
                </div>

                {/* Decorative background emoji */}
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500 select-none">
                  {method.emoji}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Stats row */}
        <AnimateOnScroll direction="up" delay={600}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {content.stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <span className="text-3xl">{stat.emoji}</span>
                <div>
                  <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
