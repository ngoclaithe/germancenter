"use client";

import { useState } from "react";
import { SafeImage } from "./SafeImage";
import Link from "next/link";
import { Clock, Users, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { CoursesContent } from "@/types/site-content";

interface CoursesProps {
  content: CoursesContent;
}

export function Courses({ content }: CoursesProps) {
  const [activeIndex, setActiveIndex] = useState(2); // B1 is default active (popular)
  const courses = content.items;

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : courses.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < courses.length - 1 ? prev + 1 : 0));

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#55B6F6]/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#55B6F6]/10 border border-[#55B6F6]/20 mb-5">
              <span className="text-sm font-semibold text-[#55B6F6]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              {content.title} <span className="gradient-text">{content.highlightedTitle}</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Stacked cards carousel */}
        <AnimateOnScroll direction="up" delay={200}>
          <div className="relative flex items-center justify-center" style={{ height: "580px", perspective: "1200px" }}>
            {/* Prev button - left side */}
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:left-4 lg:left-8 z-20 w-12 h-12 rounded-full border-2 border-[#55B6F6]/30 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#55B6F6] hover:bg-[#55B6F6] hover:text-white hover:border-[#55B6F6] transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Cards */}
            {courses.map((course, index) => {
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = index === activeIndex;

              if (absOffset > 2) return null;

              return (
                <div
                  key={index}
                  className="absolute w-[340px] sm:w-[400px] transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    transform: `
                      translateX(${offset * 80}px)
                      translateZ(${-absOffset * 120}px)
                      rotateY(${offset * -5}deg)
                      scale(${1 - absOffset * 0.08})
                    `,
                    zIndex: 10 - absOffset,
                    opacity: absOffset > 1 ? 0.5 : 1,
                    filter: isActive ? "none" : `blur(${absOffset * 1}px)`,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    className={`rounded-3xl overflow-hidden border-2 transition-all duration-500 ${
                      isActive
                        ? "border-[#55B6F6] shadow-2xl shadow-[#55B6F6]/20"
                        : "border-slate-200 shadow-lg"
                    }`}
                  >
                    <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#55B6F6]/10 to-[#6EC2F7]/10">
                      <SafeImage
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {course.level}
                        </div>
                      </div>
                      {course.popular && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#55B6F6] to-[#6EC2F7] text-white text-xs font-semibold shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            Phổ biến nhất
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-6">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{course.title}</h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{course.description}</p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#55B6F6]" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#55B6F6]" />
                          <span>Max 10</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {course.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-[#55B6F6]/10 flex items-center justify-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#55B6F6]" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {course.originalPrice && (
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-slate-400 line-through text-sm font-medium">{course.originalPrice} VNĐ</span>
                              {(() => {
                                const origNum = parseInt(course.originalPrice.replace(/\D/g, ""));
                                const saleNum = parseInt(course.price.replace(/\D/g, ""));
                                if (origNum && saleNum && origNum > saleNum) {
                                  const discount = Math.round(((origNum - saleNum) / origNum) * 100);
                                  return (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
                                      -{discount}%
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                          <div>
                            <span className="text-2xl font-bold text-[#0F172A]">{course.price}</span>
                            <span className="text-slate-500 ml-1 text-sm">VNĐ</span>
                          </div>
                        </div>
                        <Link href={`/khoa-hoc/${course.level.toLowerCase()}`} className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold flex items-center gap-1.5">
                          Xem chi tiết
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                      
                      {course.demoUrl && (
                        <div className="pt-3">
                          <a
                            href={course.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-5 py-2.5 rounded-xl border-2 border-[#55B6F6]/20 text-[#55B6F6] text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#55B6F6] hover:text-white transition-all duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Xem buổi học demo
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next button - right side */}
            <button
              onClick={handleNext}
              className="absolute right-0 sm:right-4 lg:right-8 z-20 w-12 h-12 rounded-full border-2 border-[#55B6F6]/30 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#55B6F6] hover:bg-[#55B6F6] hover:text-white hover:border-[#55B6F6] transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots indicator - top of carousel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {courses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? "w-8 h-3 bg-gradient-to-r from-[#55B6F6] to-[#6EC2F7]"
                      : "w-3 h-3 bg-slate-300 hover:bg-[#55B6F6]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
