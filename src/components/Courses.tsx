"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Users, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Courses() {
  const [activeIndex, setActiveIndex] = useState(2); // B1 is default active (popular)

  const courses = [
    {
      level: "A1",
      title: "Tiếng Đức Sơ Cấp",
      description: "Hoàn hảo cho người mới bắt đầu. Nói tiếng Đức từ ngày đầu tiên.",
      duration: "3 tháng",
      lessons: "48 buổi học",
      price: "4.500.000",
      popular: false,
      image: "/images/courses/a1.webp",
      features: ["Bài tập tương tác", "Luyện nói", "Giáo viên bản ngữ", "Chứng chỉ hoàn thành"],
    },
    {
      level: "A2",
      title: "Tiếng Đức Cơ Bản",
      description: "Tự tin giao tiếp hàng ngày và nắm vững ngữ pháp cơ bản.",
      duration: "3 tháng",
      lessons: "48 buổi học",
      price: "4.500.000",
      popular: false,
      image: "/images/courses/a1.webp",
      features: ["Tình huống thực tế", "Mở rộng từ vựng", "Văn hóa Đức", "Theo dõi tiến độ"],
    },
    {
      level: "B1",
      title: "Tiếng Đức Trung Cấp",
      description: "Tự tin diễn đạt về các chủ đề quen thuộc và tình huống thường gặp.",
      duration: "4 tháng",
      lessons: "64 buổi học",
      price: "6.000.000",
      popular: true,
      image: "/images/courses/b1.webp",
      features: ["Luyện thi chuyên sâu", "Ngữ pháp nâng cao", "Kỹ năng viết", "Chuẩn bị du học"],
    },
    {
      level: "B2",
      title: "Tiếng Đức Trung Cấp Cao",
      description: "Chinh phục chủ đề phức tạp và chuẩn bị nhập học đại học.",
      duration: "4 tháng",
      lessons: "64 buổi học",
      price: "6.500.000",
      popular: false,
      image: "/images/courses/c1.webp",
      features: ["Chuẩn bị đại học", "Tiếng Đức chuyên ngành", "Sẵn sàng TestDaF", "Viết học thuật"],
    },
    {
      level: "C1",
      title: "Tiếng Đức Cao Cấp",
      description: "Thành thạo tiếng Đức chuyên nghiệp, sẵn sàng cho công việc và học thuật.",
      duration: "5 tháng",
      lessons: "80 buổi học",
      price: "8.000.000",
      popular: false,
      image: "/images/courses/c1.webp",
      features: ["Tiếng Đức chuyên nghiệp", "Gần bản ngữ", "Phỏng vấn việc làm", "Hướng dẫn chuyên gia"],
    },
  ];

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : courses.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < courses.length - 1 ? prev + 1 : 0));

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#FF2D78]/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">Chương trình học</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              Chọn <span className="gradient-text">khóa học phù hợp</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Chương trình linh hoạt, phù hợp với lịch trình và mục tiêu học tập của bạn
            </p>
          </div>
        </AnimateOnScroll>

        {/* Stacked cards carousel */}
        <AnimateOnScroll direction="up" delay={200}>
          <div className="relative flex items-center justify-center" style={{ height: "580px", perspective: "1200px" }}>
            {/* Prev button - left side */}
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:left-4 lg:left-8 z-20 w-12 h-12 rounded-full border-2 border-[#FF2D78]/30 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:border-[#FF2D78] transition-all duration-300 shadow-lg"
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
                        ? "border-[#FF2D78] shadow-2xl shadow-[#FF2D78]/20"
                        : "border-slate-200 shadow-lg"
                    }`}
                  >
                    <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#FF2D78]/10 to-[#FF6B9D]/10">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {course.level}
                        </div>
                      </div>
                      {course.popular && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white text-xs font-semibold shadow-lg">
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
                          <Clock className="w-4 h-4 text-[#FF2D78]" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#FF2D78]" />
                          <span>Max 10</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {course.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-[#FF2D78]/10 flex items-center justify-center flex-shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78]" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-[#0F172A]">{course.price}</span>
                          <span className="text-slate-500 ml-1 text-sm">VNĐ</span>
                        </div>
                        <button className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold flex items-center gap-1.5">
                          Đăng ký
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next button - right side */}
            <button
              onClick={handleNext}
              className="absolute right-0 sm:right-4 lg:right-8 z-20 w-12 h-12 rounded-full border-2 border-[#FF2D78]/30 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:border-[#FF2D78] transition-all duration-300 shadow-lg"
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
                      ? "w-8 h-3 bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D]"
                      : "w-3 h-3 bg-slate-300 hover:bg-[#FF2D78]/50"
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
