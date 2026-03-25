"use client";

import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

const teachers = [
  {
    name: "Thomas Müller",
    role: "Giảng viên chính",
    specialty: "Chuyên gia Goethe B2-C1",
    bio: "15 năm kinh nghiệm giảng dạy, từng giảng viên tại Goethe-Institut Hà Nội.",
    emoji: "🇩🇪",
    rotate: "rotate-[-2deg]",
  },
  {
    name: "Nguyễn Thanh Hương",
    role: "Giảng viên cao cấp",
    specialty: "Phương pháp giao tiếp",
    bio: "Thạc sĩ Ngôn ngữ Đức tại ĐH Heidelberg, 10 năm giảng dạy tiếng Đức.",
    emoji: "🎓",
    rotate: "rotate-[2deg]",
  },
  {
    name: "Stefan Weber",
    role: "Giảng viên bản ngữ",
    specialty: "Luyện phát âm & nghe",
    bio: "Giáo viên bản ngữ Berlin, chứng chỉ DaF, chuyên luyện thi TestDaF.",
    emoji: "🎧",
    rotate: "rotate-[-1deg]",
  },
  {
    name: "Trần Minh Đức",
    role: "Giảng viên",
    specialty: "Ngữ pháp A1-B1",
    bio: "Tốt nghiệp ĐH Kỹ thuật Munich, đam mê truyền đạt ngữ pháp dễ hiểu.",
    emoji: "📚",
    rotate: "rotate-[1.5deg]",
  },
];

export function Teachers() {
  return (
    <section id="teachers" className="py-24 bg-[#FFF5F8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF2D78]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FF6B9D]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">Đội ngũ giảng viên</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F0F0F] mb-5">
              Chuyên gia{" "}
              <span className="gradient-text">đồng hành cùng bạn</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Đội ngũ giảng viên Việt - Đức giàu kinh nghiệm, tận tâm và luôn sáng tạo trong phương pháp giảng dạy
            </p>
          </div>
        </AnimateOnScroll>

        {/* Teacher cards - 3D stacked grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, index) => (
            <AnimateOnScroll key={index} direction="up" delay={index * 150}>
              <div
                className={`group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-[#FF2D78]/10 transition-all duration-500 hover:-translate-y-3 hover:rotate-0 ${teacher.rotate}`}
                style={{ perspective: "600px" }}
              >
                {/* Avatar placeholder with emoji */}
                <div className="relative mx-auto w-24 h-24 mb-5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-4xl shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500">
                    {teacher.emoji}
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-4 border-white shadow-sm" />
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#0F0F0F] mb-1">{teacher.name}</h3>
                  <p className="text-sm font-semibold text-[#FF2D78] mb-1">{teacher.role}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF2D78]/10 mb-3">
                    <span className="text-xs font-medium text-[#FF2D78]">{teacher.specialty}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{teacher.bio}</p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D78]/10 to-[#FF6B9D]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-sm">✨</span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Stats bar */}
        <AnimateOnScroll direction="up" delay={600}>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "15+", label: "Giảng viên", emoji: "👨‍🏫" },
              { value: "5+", label: "Giáo viên bản ngữ", emoji: "🇩🇪" },
              { value: "10+", label: "Năm kinh nghiệm", emoji: "⏱️" },
              { value: "100%", label: "Có chứng chỉ DaF", emoji: "📜" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span className="text-2xl">{stat.emoji}</span>
                <div>
                  <p className="text-xl font-bold text-[#0F0F0F]">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
