"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function CTABanner() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#FF2D78] via-[#E0255F] to-[#FF6B9D] overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-float-delayed" />
      <div className="absolute bottom-1/3 left-2/3 w-4 h-4 bg-white/10 rounded-full animate-float" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateOnScroll direction="up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white">Ưu đãi có hạn</span>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={100}>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Sẵn sàng bắt đầu hành trình tiếng Đức?
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={200}>
          <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Tham gia cùng 3000+ học viên thành công. Giảm 20% khi đăng ký trong tháng này.
            Miễn phí kiểm tra trình độ và buổi học thử!
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="group px-10 py-5 bg-white text-[#FF2D78] rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg font-bold shadow-xl"
            >
              Nhận ưu đãi ngay
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-lg font-semibold"
            >
              Đặt lịch tư vấn miễn phí
            </a>
          </div>
        </AnimateOnScroll>

        {/* Urgency indicator */}
        <AnimateOnScroll direction="up" delay={400}>
          <div className="mt-10 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-white text-sm font-medium">
              Chỉ còn 5 suất cho đợt tuyển sinh tháng này
            </span>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
