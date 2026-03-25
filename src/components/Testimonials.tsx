"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Testimonials() {
  const testimonials = [
    {
      name: "Đỗ Minh Tuấn",
      role: "Trợ lý nghiên cứu",
      level: "Tốt nghiệp B2",
      image: "/images/hocvien/dominhtuan.webp",
      rating: 5,
      text: "Đầu tư tốt nhất của mình! Kiến thức văn hóa và mẹo thực tế từ giáo viên đã giúp mình thích nghi nhanh với cuộc sống tại Đức.",
    },
    {
      name: "Lê Thị Mai",
      role: "Sinh viên ngành Điều dưỡng",
      level: "Tốt nghiệp B1",
      image: "/images/hocvien/lethimai.webp",
      rating: 5,
      text: "Lớp nhỏ và giáo viên kiên nhẫn đã giúp mình vượt qua nỗi sợ nói. Mình đã đậu thi B1 và giờ đang học điều dưỡng tại Đức!",
    },
    {
      name: "Nguyễn Minh Anh",
      role: "Sinh viên ĐH Kỹ thuật Munich",
      level: "Tốt nghiệp B2",
      image: "/images/hocvien/minhanh.webp",
      rating: 5,
      text: "Nhờ trung tâm, mình đã đậu kỳ thi B2 ngay lần đầu và được nhận vào ĐH Kỹ thuật Munich. Giáo viên rất tuyệt vời!",
    },
    {
      name: "Trần Văn Hùng",
      role: "Kỹ sư phần mềm tại Berlin",
      level: "Tốt nghiệp C1",
      image: "/images/hocvien/tranvanhung.webp",
      rating: 5,
      text: "Mình từ con số 0 lên C1 trong 18 tháng. Giờ mình làm việc tại công ty công nghệ ở Berlin. Thời gian luyện nói rất quý giá!",
    },
    {
      name: "Võ Thanh Hằng",
      role: "Thạc sĩ tại Hamburg",
      level: "Tốt nghiệp C1",
      image: "/images/hocvien/vothanhhang.webp",
      rating: 5,
      text: "Tài liệu luyện thi và bài thi thử rất sát đề thực. Mình hoàn toàn tự tin vào phòng thi TestDaF và đạt điểm cần thiết!",
    },
    {
      name: "Phạm Quốc Bảo",
      role: "Chương trình Ausbildung",
      level: "Tốt nghiệp A2",
      image: "/images/hocvien/phamquocbao.webp",
      rating: 5,
      text: "Chuẩn bị hoàn hảo cho chương trình Ausbildung. Giáo viên tập trung vào tiếng Đức thực tế sử dụng hàng ngày ở Đức.",
    },
  ];

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
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF2D78]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[#FF6B9D]/5 rounded-full blur-3xl -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">Câu chuyện thành công</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              Học viên{" "}
              <span className="gradient-text">nói gì về chúng tôi</span>
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
                      ? "w-[180px] h-[180px] border-[#FF2D78] shadow-2xl shadow-[#FF2D78]/30"
                      : "w-[120px] h-[120px] border-white shadow-lg"
                  }`}>
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="180px"
                      className="object-cover"
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
                <Quote className="absolute -top-4 -left-2 w-10 h-10 text-[#FF2D78]/10" />
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed italic px-8">
                  &ldquo;{activeTestimonial.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex flex-col items-center gap-1">
                <h4 className="text-lg font-bold text-[#0F172A]">{activeTestimonial.name}</h4>
                <p className="text-sm text-slate-500">{activeTestimonial.role}</p>
                <span className="mt-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#FF2D78]/10 to-[#FF6B9D]/10 text-[#FF2D78] rounded-full">
                  {activeTestimonial.level}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border-2 border-[#FF2D78]/30 flex items-center justify-center text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:border-[#FF2D78] transition-all duration-300"
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
                      ? "w-8 h-3 bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D]"
                      : "w-3 h-3 bg-slate-300 hover:bg-[#FF2D78]/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border-2 border-[#FF2D78]/30 flex items-center justify-center text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:border-[#FF2D78] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
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
