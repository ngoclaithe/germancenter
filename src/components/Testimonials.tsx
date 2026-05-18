"use client";

import { useState, useEffect, useCallback } from "react";
import { SafeImage } from "./SafeImage";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { TestimonialsContent } from "@/types/site-content";

interface TestimonialsProps {
  content: TestimonialsContent;
}

export function Testimonials({ content }: TestimonialsProps) {
  const testimonials = content.items;

  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => setMounted(true), []);

  // Calculate position for each card in the ellipse
  const getCardStyle = (index: number) => {
    const diff = ((index - active + total) % total);
    // Map to angle: active=0° (front), then spread evenly
    const angle = (diff / total) * 2 * Math.PI;

    const radiusX = 500; // horizontal radius
    const radiusZ = 250; // depth radius
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ;
    const scale = 0.6 + 0.4 * ((z + radiusZ) / (2 * radiusZ)); // 0.6 → 1.0
    const opacity = z > 0 ? 1 : 0.4 + 0.6 * ((z + radiusZ) / (2 * radiusZ));
    const zIndex = Math.round(z + radiusZ);

    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      zIndex,
      opacity,
      filter: diff === 0 ? "none" : `blur(${Math.max(0, 1 - scale) * 3}px)`,
    };
  };

  const activeTestimonial = testimonials[active];

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#55B6F6]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[#6EC2F7]/5 rounded-full blur-3xl -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#55B6F6]/10 border border-[#55B6F6]/20 mb-5">
              <span className="text-sm font-semibold text-[#55B6F6]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              {content.title}{" "}
              <span className="gradient-text">{content.highlightedTitle}</span>
            </h2>
          </div>
        </AnimateOnScroll>

        {/* 3D Elliptical Carousel */}
        <AnimateOnScroll direction="up" delay={200}>
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{ height: "300px", perspective: "1000px" }}
          >
            {mounted && (
            <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 ease-out"
                  style={getCardStyle(index)}
                  onClick={() => setActive(index)}
                >
                  <div className={`relative rounded-full overflow-hidden border-4 transition-all duration-500 ${
                    index === active
                      ? "w-[180px] h-[180px] border-[#55B6F6] shadow-2xl shadow-[#55B6F6]/30"
                      : "w-[120px] h-[120px] border-white shadow-lg"
                  }`}>
                    <SafeImage
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                      fallbackClassName="absolute inset-0 bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] rounded-full flex items-center justify-center"
                    />
                  </div>
                  {index === active && (
                    <p className="text-center mt-2 text-sm font-bold text-[#0F172A] whitespace-nowrap">
                      {t.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Active testimonial content */}
          <div className="max-w-2xl mx-auto mt-8">
            <div
              key={active}
              className="text-center animate-fadeIn"
            >
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-2 w-10 h-10 text-[#55B6F6]/10" />
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed italic px-8">
                  &ldquo;{activeTestimonial.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex flex-col items-center gap-1">
                <h4 className="text-lg font-bold text-[#0F172A]">{activeTestimonial.name}</h4>
                <p className="text-sm text-slate-500">{activeTestimonial.role}</p>
                <span className="mt-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#55B6F6]/10 to-[#6EC2F7]/10 text-[#55B6F6] rounded-full">
                  {activeTestimonial.level}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border-2 border-[#55B6F6]/30 flex items-center justify-center text-[#55B6F6] hover:bg-[#55B6F6] hover:text-white hover:border-[#55B6F6] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === active
                      ? "w-8 h-3 bg-gradient-to-r from-[#55B6F6] to-[#6EC2F7]"
                      : "w-3 h-3 bg-slate-300 hover:bg-[#55B6F6]/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border-2 border-[#55B6F6]/30 flex items-center justify-center text-[#55B6F6] hover:bg-[#55B6F6] hover:text-white hover:border-[#55B6F6] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Action buttons */}
          {(content.feedbackUrl || content.certificateUrl) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              {content.feedbackUrl && (
                <a
                  href={content.feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#55B6F6]/20 text-[#55B6F6] text-sm font-semibold hover:bg-[#55B6F6] hover:text-white transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Tổng hợp feedback học viên
                </a>
              )}
              {content.certificateUrl && (
                <a
                  href={content.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#55B6F6]/20 text-[#55B6F6] text-sm font-semibold hover:bg-[#55B6F6] hover:text-white transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Tổng hợp bằng học viên thi đỗ
                </a>
              )}
            </div>
          )}
        </AnimateOnScroll>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
