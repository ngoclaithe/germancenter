"use client";

import Image from "next/image";
import { Play, Award, GraduationCap, Globe2, Trophy } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function MediaSection() {
  return (
    <section className="py-24 bg-[#FFF5F8] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF2D78]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#FF6B9D]/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">
                Chứng nhận & Công nhận
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              Được công nhận bởi{" "}
              <span className="gradient-text">tiêu chuẩn quốc tế</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Chứng chỉ của chúng tôi được công nhận bởi các trường đại học,
              đại sứ quán và nhà tuyển dụng Đức trên toàn thế giới.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 3D Card Stack Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left - Video Card with 3D tilt */}
          <div className="lg:col-span-7">
            <AnimateOnScroll direction="left">
              <div className="relative group" style={{ perspective: "1000px" }}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:[transform:rotateY(-3deg)_rotateX(2deg)] group-hover:shadow-[0_30px_60px_rgba(37,99,235,0.2)]">
                  <Image
                    src="/images/school-interior.webp"
                    alt="Không gian học tập hiện đại"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl animate-glow">
                      <Play className="w-8 h-8 text-[#FF2D78] ml-1" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-lg font-semibold">
                      Khám phá cách học viên học tiếng Đức
                    </p>
                    <p className="text-white/80 text-sm">Tham quan ảo 2 phút</p>
                  </div>
                </div>

                {/* Floating badges around video */}
                <div className="absolute -top-4 -right-4 z-10 hidden lg:block">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 rotate-[6deg] hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">Top 3</p>
                        <p className="text-xs text-slate-500">Trung tâm VN</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 z-10 hidden lg:block">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">4.9/5.0</p>
                        <p className="text-xs text-slate-500">Đánh giá</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Achievement Image - 3D tilt */}
            <AnimateOnScroll direction="up" delay={300}>
              <div className="mt-8 group" style={{ perspective: "800px" }}>
                <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 transition-transform duration-700 group-hover:[transform:rotateY(3deg)_rotateX(-1deg)] group-hover:shadow-2xl">
                  <Image
                    src="/images/graduation-ceremony.webp"
                    alt="Lễ trao chứng chỉ và thành tích"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right - Stacked Cert Cards */}
          <div className="lg:col-span-5 space-y-6">
            {[
              {
                icon: <GraduationCap className="w-7 h-7 text-white" />,
                emoji: "🎓",
                title: "Đối tác Goethe-Institut",
                desc: "Trung tâm khảo thí chính thức, đề thi chuẩn quốc tế.",
                rotate: "rotate-[-2deg]",
                gradient: "from-[#FF2D78] to-[#E0255F]",
              },
              {
                icon: <Award className="w-7 h-7 text-white" />,
                emoji: "📜",
                title: "Chứng nhận telc",
                desc: "Trung tâm thi ủy quyền, chứng chỉ telc Deutsch A1-C1.",
                rotate: "rotate-[2deg]",
                gradient: "from-[#FF6B9D] to-[#D4206B]",
              },
              {
                icon: <Globe2 className="w-7 h-7 text-white" />,
                emoji: "🌍",
                title: "Công nhận toàn cầu",
                desc: "Được 200+ trường đại học Đức và đại sứ quán chấp nhận.",
                rotate: "rotate-[-1deg]",
                gradient: "from-[#FF2D78] to-[#FF6B9D]",
              },
              {
                icon: <Trophy className="w-7 h-7 text-white" />,
                emoji: "🏅",
                title: "Tỷ lệ đậu 95%",
                desc: "Cam kết đầu ra với tỷ lệ đậu chứng chỉ cao nhất khu vực.",
                rotate: "rotate-[1.5deg]",
                gradient: "from-[#D4206B] to-[#FF2D78]",
              },
            ].map((cert, index) => (
              <AnimateOnScroll key={index} direction="right" delay={index * 150}>
                <div
                  className={`group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:border-[#FF2D78]/30 hover:shadow-2xl hover:shadow-[#FF2D78]/10 transition-all duration-500 hover:-translate-y-2 hover:rotate-0 ${cert.rotate}`}
                  style={{ perspective: "600px" }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {cert.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1">{cert.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{cert.desc}</p>
                    </div>
                    <span className="text-3xl flex-shrink-0 group-hover:scale-125 transition-transform duration-500">
                      {cert.emoji}
                    </span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
