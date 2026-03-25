"use client";

import { MapPin, Phone, Mail, Globe, Camera, PlayCircle, Send } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF2D78]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <AnimateOnScroll direction="up" delay={0}>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/images/logo_linguagerman.png"
                  alt="Trung Tâm Tiếng Đức Logo"
                  width={44}
                  height={44}
                  className="rounded-xl shadow-lg"
                />
                <span className="text-xl font-bold">Lingua German</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Trung tâm tiếng Đức hàng đầu tại Việt Nam. Con đường dẫn đến thành công của bạn tại Đức.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Globe, label: "Facebook" },
                  { icon: Camera, label: "Instagram" },
                  { icon: PlayCircle, label: "YouTube" },
                  { icon: Send, label: "Telegram" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#FF2D78] hover:to-[#FF6B9D] flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Quick Links */}
          <AnimateOnScroll direction="up" delay={100}>
            <div>
              <h3 className="text-lg font-bold mb-5">Liên kết nhanh</h3>
              <ul className="space-y-3">
                {[
                  { href: "#about", label: "Về chúng tôi" },
                  { href: "#courses", label: "Khóa học" },
                  { href: "#method", label: "Giáo viên" },
                  { href: "#testimonials", label: "Câu chuyện thành công" },
                  { href: "#", label: "Blog" },
                  { href: "#", label: "Câu hỏi thường gặp" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Courses */}
          <AnimateOnScroll direction="up" delay={200}>
            <div>
              <h3 className="text-lg font-bold mb-5">Khóa học</h3>
              <ul className="space-y-3">
                {[
                  "A1 - Sơ cấp",
                  "A2 - Cơ bản",
                  "B1 - Trung cấp",
                  "B2 - Trung cấp cao",
                  "C1 - Cao cấp",
                  "Luyện thi chứng chỉ",
                ].map((course) => (
                  <li key={course}>
                    <a
                      href="#courses"
                      className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {course}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Contact */}
          <AnimateOnScroll direction="up" delay={300}>
            <div>
              <h3 className="text-lg font-bold mb-5">Liên hệ</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FF2D78] flex-shrink-0 mt-1" />
                  <span className="text-slate-400">
                    123 Nguyễn Huệ,
                    <br />
                    Quận 1, TP. Hồ Chí Minh
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FF2D78] flex-shrink-0" />
                  <a
                    href="tel:+842812345678"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    +84 28 1234 5678
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FF2D78] flex-shrink-0" />
                  <a
                    href="mailto:info@germancenter.vn"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    info@germancenter.vn
                  </a>
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#FF2D78]/10 to-[#FF6B9D]/10 border border-[#FF2D78]/20">
                <p className="text-sm text-slate-300 font-semibold mb-2">Giờ làm việc</p>
                <p className="text-sm text-slate-400">T2 - T7: 8:00 - 20:00</p>
                <p className="text-sm text-slate-400">Chủ nhật: 9:00 - 17:00</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 Trung Tâm Tiếng Đức. Mọi quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Điều khoản dịch vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
