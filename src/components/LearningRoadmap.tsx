"use client";

import { Check } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { LearningRoadmapContent } from "@/types/site-content";

interface LearningRoadmapProps {
  content: LearningRoadmapContent;
}

export function LearningRoadmap({ content }: LearningRoadmapProps) {
  const levels = content.levels;

  return (
    <section id="roadmap" className="py-24 bg-[#F0F8FF] relative overflow-hidden wave-divider-dark">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6EC2F7]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#55B6F6]/10 border border-[#55B6F6]/20 mb-5">
              <span className="text-sm font-semibold text-[#55B6F6]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              <span className="gradient-text">{content.title}</span> {content.highlightedTitle}
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Desktop S-Curve Roadmap */}
        <div className="hidden lg:block">
          {levels.map((level, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={index}>
                {/* Row: node + card, alternating sides */}
                <AnimateOnScroll direction={isLeft ? "left" : "right"} delay={index * 150}>
                  <div className={`flex items-center gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Card side */}
                    <div className="w-[380px] flex-shrink-0">
                      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-[#55B6F6]/30 hover:shadow-2xl hover:shadow-[#55B6F6]/10 transition-all duration-500 hover:-translate-y-1 ${level.rotate}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#0F172A]">{level.title}</h3>
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#55B6F6]/10 to-[#6EC2F7]/10 text-xs font-bold text-[#55B6F6]">
                            {level.duration}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{level.description}</p>
                        <ul className="space-y-2">
                          {level.skills.map((skill, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <Check className="w-4 h-4 text-[#55B6F6] mt-0.5 flex-shrink-0" />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex-shrink-0 relative group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity scale-150" />
                      <div className="relative w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex flex-col items-center justify-center text-white shadow-xl border-4 border-white group-hover:scale-110 transition-all duration-500 z-10">
                        <span className="text-2xl leading-none">{level.emoji}</span>
                        <span className="text-xs font-bold mt-0.5">{level.level}</span>
                      </div>
                    </div>

                    {/* Spacer for the other side */}
                    <div className="flex-1" />
                  </div>
                </AnimateOnScroll>

                {/* S-Curve connector between nodes */}
                {index < levels.length - 1 && (
                  <div className="flex justify-center my-[-8px]">
                    <svg
                      width="400"
                      height="100"
                      viewBox="0 0 400 100"
                      fill="none"
                      className={isLeft ? "" : "scale-x-[-1]"}
                    >
                      <path
                        d="M 80 0 C 80 40, 320 60, 320 100"
                        stroke="url(#connGrad)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="14 10"
                        opacity="0.5"
                      />
                      {/* Small dots along path */}
                      <circle cx="140" cy="25" r="4" fill="#55B6F6" opacity="0.3" />
                      <circle cx="200" cy="50" r="5" fill="#6EC2F7" opacity="0.25" />
                      <circle cx="260" cy="75" r="4" fill="#55B6F6" opacity="0.3" />
                      <defs>
                        <linearGradient id="connGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#55B6F6" />
                          <stop offset="100%" stopColor="#6EC2F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {/* Finish */}
          <AnimateOnScroll direction="up" delay={1000}>
            <div className="flex justify-center mt-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-3xl shadow-2xl border-4 border-white">
                  🎓
                </div>
                <p className="mt-4 text-lg font-bold gradient-text">{content.finishText}</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Mobile Stack */}
        <div className="lg:hidden space-y-6">
          {levels.map((level, index) => (
            <AnimateOnScroll key={index} direction="left" delay={index * 100}>
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-white font-bold shadow-lg border-4 border-white">
                      {level.level}
                    </div>
                    {index < levels.length - 1 && (
                      <div className="w-1 h-20 bg-gradient-to-b from-[#55B6F6] to-[#6EC2F7] mt-2 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-1">{level.title}</h3>
                    <p className="text-sm font-semibold text-[#55B6F6] mb-3">{level.duration}</p>
                    <p className="text-slate-600 mb-4">{level.description}</p>
                    <ul className="space-y-2">
                      {level.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-[#55B6F6] mt-0.5 flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
          <div className="flex justify-center pt-4">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-2xl shadow-lg border-4 border-white">
                🎓
              </div>
              <p className="mt-2 text-sm font-bold gradient-text">{content.finishText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
