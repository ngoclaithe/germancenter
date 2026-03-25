"use client";

import { BookOpen, Mic, Award, Settings, Search, Upload, BarChart3, Layers } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function SocialProof() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FF2D78]/5 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <p className="text-xl sm:text-2xl text-slate-600 mb-6 font-medium">
              Chỉ bằng một trung tâm duy nhất
            </p>
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#FF2D78]/20 bg-white shadow-xl shadow-[#FF2D78]/10">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight gradient-text">
                LINGUA GERMAN
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Floating cards layout */}
        <div className="relative h-[420px] sm:h-[380px] lg:h-[340px]">
          {/* Dashed connection lines - SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            viewBox="0 0 1000 340"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M200 160 C 300 100, 400 80, 500 120"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M500 120 C 600 160, 650 200, 750 140"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M750 140 C 820 120, 880 100, 920 160"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.4"
            />
            {/* Decorative dots on path */}
            <circle cx="350" cy="95" r="3" fill="#FF2D78" opacity="0.5" />
            <circle cx="355" cy="91" r="2" fill="#FF6B9D" opacity="0.5" />
            <circle cx="360" cy="95" r="2" fill="#FF2D78" opacity="0.5" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF2D78" />
                <stop offset="100%" stopColor="#FF6B9D" />
              </linearGradient>
            </defs>
          </svg>

          {/* Card 1 - Dàn lộ trình */}
          <AnimateOnScroll direction="left" delay={0}>
            <div className="absolute left-0 sm:left-[2%] lg:left-[2%] top-[10px] sm:top-[20px] w-[220px] sm:w-[240px]">
              <div className="group bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-5 hover:shadow-2xl transition-all duration-500 -rotate-6 hover:rotate-0 hover:bg-white hover:scale-105 hover:-translate-y-1" style={{ filter: 'drop-shadow(0 8px 24px rgba(37,99,235,0.12))' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF2D78]/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-[#FF2D78]" />
                  </div>
                  <span className="text-xs text-[#FF2D78] font-semibold uppercase tracking-wider">Lộ trình</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">LỘ TRÌNH HỌC</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Đơn giản dễ dàng cho mỗi trình độ từ A1 đến C1, thẳng tiến đến Đức.
                </p>
                <div className="inline-flex px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white text-xs font-semibold">
                  Xem chi tiết →
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Card 2 - Luyện nói */}
          <AnimateOnScroll direction="up" delay={200}>
            <div className="absolute left-[30%] sm:left-[30%] lg:left-[30%] top-[140px] sm:top-[100px] lg:top-[80px] w-[200px] sm:w-[220px]">
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-5 hover:shadow-2xl transition-all duration-500 rotate-[4deg] hover:rotate-0 hover:bg-white hover:scale-105 hover:-translate-y-1 text-center" style={{ filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.12))' }}>
                {/* Circular animation graphic */}
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="#e2e8f0"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="url(#circleGrad)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="160 54"
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                    <defs>
                      <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF2D78" />
                        <stop offset="100%" stopColor="#FF6B9D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-[#FF2D78]" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">LUYỆN NÓI</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thêm các hiệu ứng chuyển tiếp từ cơ bản đến nâng cao chỉ 1 click.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Card 3 - Tối ưu thi cử */}
          <AnimateOnScroll direction="up" delay={400}>
            <div className="absolute right-[20%] sm:right-[22%] lg:right-[22%] top-[0px] sm:top-[10px] w-[200px] sm:w-[220px]">
              <div className="group bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-5 hover:shadow-2xl transition-all duration-500 rotate-[5deg] hover:rotate-0 hover:bg-white hover:scale-105 hover:-translate-y-1" style={{ filter: 'drop-shadow(0 8px 24px rgba(37,99,235,0.15))' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-[#FF6B9D] font-semibold uppercase tracking-wider">Tối ưu</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-[#0F172A]">THI CỬ</h3>
                  {/* Bar chart visualization */}
                  <div className="flex items-end gap-0.5 h-10">
                    {[70, 85, 65, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-t-sm bg-gradient-to-t from-[#FF2D78] to-[#FF6B9D] transition-all duration-500 group-hover:opacity-100"
                        style={{
                          height: `${h}%`,
                          opacity: 0.5 + i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Card 4 - Plugin / Công cụ hỗ trợ */}
          <AnimateOnScroll direction="right" delay={600}>
            <div className="absolute right-0 sm:right-[2%] lg:right-[2%] top-[100px] sm:top-[90px] lg:top-[60px]">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 font-semibold text-right mb-1 uppercase tracking-wider">
                  Hỗ trợ toàn diện
                </span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { icon: Layers, label: "Tài liệu" },
                    { icon: BookOpen, label: "Bài tập" },
                    { icon: Award, label: "Chứng chỉ" },
                    { icon: BarChart3, label: "Tiến bộ" },
                    { icon: Settings, label: "Tùy chỉnh" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div
                      key={i}
                      className={`group/item flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                        i === 3
                          ? "bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] border-transparent text-white shadow-lg"
                          : "bg-white border-slate-200 hover:border-[#FF2D78]/30 hover:shadow-md"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${i === 3 ? "text-white" : "text-slate-400 group-hover/item:text-[#FF2D78]"}`} />
                      <span className={`text-xs font-medium ${i === 3 ? "text-white" : "text-slate-600"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
