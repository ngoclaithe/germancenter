"use client";

import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function TeachingMethod() {
  const methods = [
    {
      emoji: "🗣️",
      title: "Nói trước tiên",
      description: "Thực hành nói từ ngày đầu với hội thoại thực tế và đóng vai. 60% thời lượng lớp dành cho luyện nói.",
      size: "large",
      rotate: "rotate-[-1deg]",
      bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8",
    },
    {
      emoji: "👥",
      title: "Học tương tác",
      description: "Hoạt động nhóm hấp dẫn, trò chơi và dự án cộng tác.",
      size: "small",
      rotate: "rotate-[1deg]",
      bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8",
    },
    {
      emoji: "🎯",
      title: "Luyện thi thực tế",
      description: "Thi thử định kỳ theo format Goethe và TestDaF. Tỷ lệ đậu 95%.",
      size: "small",
      rotate: "rotate-[-2deg]",
      bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8",
    },
    {
      emoji: "⚡",
      title: "Phương pháp tăng tốc",
      description: "Kỹ thuật đã được chứng minh giúp học nhanh gấp 3 lần phương pháp truyền thống.",
      size: "small",
      rotate: "rotate-[2deg]",
      bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8",
    },
    {
      emoji: "🎧",
      title: "Phát âm chuẩn",
      description: "Luyện nghe với người bản ngữ để có giọng phát âm chính xác. Công nghệ AI nhận diện giọng nói.",
      size: "large",
      rotate: "rotate-[1deg]",
      bg: "from-[#FF2D78]/8 to-[#FF6B9D]/8",
    },
    {
      emoji: "🇩🇪",
      title: "Hòa nhập văn hóa",
      description: "Học văn hóa, phong tục và cách ứng xử Đức song song với ngôn ngữ.",
      size: "small",
      rotate: "rotate-[-1deg]",
      bg: "from-[#FF6B9D]/8 to-[#FF2D78]/8",
    },
  ];

  return (
    <section id="method" className="py-24 bg-[#FFF5F8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B9D]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">Phương pháp của chúng tôi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              Cách chúng tôi giúp bạn{" "}
              <span className="gradient-text">học dễ dàng hơn</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Phương pháp giảng dạy đã được chứng minh kết hợp sư phạm hiện đại
              với ứng dụng thực tế
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
            {[
              { value: "2 cấp độ", label: "Tiến bộ trung bình / năm", emoji: "📈" },
              { value: "60%", label: "Thời lượng lớp dành cho luyện nói", emoji: "🗣️" },
              { value: "4.9 / 5.0", label: "Độ hài lòng từ học viên", emoji: "⭐" },
            ].map((stat, i) => (
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
