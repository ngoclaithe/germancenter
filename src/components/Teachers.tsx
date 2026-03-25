"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

const teachers = [
  {
    name: "Thomas Müller",
    role: "Giảng viên chính",
    specialty: "Chuyên gia Goethe B2-C1",
    bio: "15 năm kinh nghiệm giảng dạy, từng giảng viên tại Goethe-Institut Hà Nội. Chuyên đào tạo học viên chinh phục các kỳ thi chứng chỉ quốc tế với tỷ lệ đậu 98%.",
    image: "/images/teachers/thomas.png",
    origin: "Đức",
    exp: "15 năm",
    students: "500+",
  },
  {
    name: "Nguyễn Thanh Hương",
    role: "Giảng viên cao cấp",
    specialty: "Phương pháp giao tiếp",
    bio: "Thạc sĩ Ngôn ngữ Đức tại ĐH Heidelberg, 10 năm giảng dạy tiếng Đức. Sáng tạo phương pháp học qua tình huống thực tế giúp học viên tự tin giao tiếp.",
    image: "/images/teachers/huong.png",
    origin: "Việt Nam",
    exp: "10 năm",
    students: "400+",
  },
  {
    name: "Stefan Weber",
    role: "Giảng viên bản ngữ",
    specialty: "Luyện phát âm & nghe",
    bio: "Giáo viên bản ngữ đến từ Berlin, chứng chỉ DaF, chuyên luyện thi TestDaF. Phong cách giảng dạy gần gũi và luôn tạo không khí lớp học sôi nổi.",
    image: "/images/teachers/stefan.png",
    origin: "Đức",
    exp: "8 năm",
    students: "350+",
  },
  {
    name: "Trần Minh Đức",
    role: "Giảng viên",
    specialty: "Ngữ pháp A1-B1",
    bio: "Tốt nghiệp ĐH Kỹ thuật Munich, đam mê truyền đạt ngữ pháp dễ hiểu. Là cầu nối giúp học viên Việt Nam tiếp cận ngữ pháp Đức một cách logic.",
    image: "/images/teachers/duc.png",
    origin: "Việt Nam",
    exp: "5 năm",
    students: "200+",
  },
];

export function Teachers() {
  const [active, setActive] = useState(0);
  const current = teachers[active];

  return (
    <section id="teachers" className="py-24 bg-[#FFF5F8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF2D78]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FF6B9D]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">Đội ngũ giảng viên</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F0F0F] mb-5">
              Chuyên gia{" "}
              <span className="gradient-text">đồng hành cùng bạn</span>
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={200}>
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">

            {/* LEFT — Featured teacher spotlight */}
            <div className="lg:col-span-7 relative" style={{ perspective: "1200px" }}>
              <div
                key={active}
                className="relative rounded-[2rem] overflow-hidden h-full min-h-[500px] group"
                style={{
                  animation: "spotlightIn 0.6s ease-out",
                  transform: "rotate(-2deg) translateY(-8px)",
                  boxShadow: "0 30px 60px -15px rgba(255, 45, 120, 0.25), 0 15px 30px -10px rgba(0,0,0,0.15)",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(0deg) translateY(-14px) rotateY(-3deg) rotateX(2deg) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 40px 80px -20px rgba(255, 45, 120, 0.35), 0 20px 40px -12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(-2deg) translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 30px 60px -15px rgba(255, 45, 120, 0.25), 0 15px 30px -10px rgba(0,0,0,0.15)";
                }}
              >
                {/* Full image */}
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  {/* Origin tag */}
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-4">
                    <span className="text-xs font-semibold text-white tracking-wider uppercase">{current.origin}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-1">{current.name}</h3>
                  <p className="text-[#FF6B9D] font-semibold mb-4">{current.role}</p>

                  <p className="text-white/80 leading-relaxed mb-6 max-w-lg text-sm sm:text-base">
                    {current.bio}
                  </p>

                  {/* Mini stats */}
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: "Kinh nghiệm", value: current.exp },
                      { label: "Chuyên môn", value: current.specialty },
                      { label: "Học viên", value: current.students },
                    ].map((s, i) => (
                      <div key={i} className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase tracking-wider">{s.label}</p>
                        <p className="text-sm font-bold text-white">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FF2D78]/50" />
                </div>
              </div>
            </div>

            {/* RIGHT — Teacher selector stack */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {teachers.map((teacher, index) => {
                const rotations = ["-2deg", "1.5deg", "-1deg", "2deg"];
                const isActive = index === active;
                return (
                <div
                  key={index}
                  onClick={() => setActive(index)}
                  className={`group relative flex items-center gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "bg-white shadow-2xl shadow-[#FF2D78]/15 border-2 border-[#FF2D78]/30"
                      : "bg-white/60 border-2 border-transparent hover:bg-white hover:shadow-xl hover:border-[#FF2D78]/10"
                  }`}
                  style={{
                    transform: isActive
                      ? "rotate(0deg) translateY(-6px) scale(1.03)"
                      : `rotate(${rotations[index]}) translateY(0px)`,
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isActive
                      ? "0 20px 40px -12px rgba(255, 45, 120, 0.2), 0 8px 16px -4px rgba(0,0,0,0.08)"
                      : "0 4px 12px -2px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500 ${
                      index === active ? "w-20 h-20 ring-2 ring-[#FF2D78] ring-offset-2" : "w-16 h-16"
                    }`}
                  >
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold transition-colors duration-300 ${
                      index === active ? "text-[#FF2D78]" : "text-[#0F0F0F]"
                    }`}>
                      {teacher.name}
                    </h4>
                    <p className="text-sm text-slate-500 mb-1">{teacher.role}</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#FF2D78]/8 border border-[#FF2D78]/10">
                      <span className="text-[11px] font-medium text-[#FF2D78]">{teacher.specialty}</span>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {index === active && (
                    <div className="w-2 h-10 rounded-full bg-gradient-to-b from-[#FF2D78] to-[#FF6B9D] flex-shrink-0" />
                  )}
                </div>
                );
              })}

              {/* Bottom stats */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { value: "15+", label: "Giảng viên" },
                  { value: "100%", label: "Chứng chỉ DaF" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center"
                  >
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </AnimateOnScroll>
      </div>

      <style jsx>{`
        @keyframes spotlightIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
