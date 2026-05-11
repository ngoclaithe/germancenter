"use client";

import { useState } from "react";
import { ArrowRight, User, Phone, Target, Mail } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { RegistrationContent } from "@/types/site-content";

interface RegistrationFormProps {
  content: RegistrationContent;
}

export function RegistrationForm({ content }: RegistrationFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", goal: "", level: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", goal: "", level: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#6EC2F7]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#55B6F6]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#55B6F6]/10 border border-[#55B6F6]/20 mb-5">
              <span className="text-sm font-semibold text-[#55B6F6]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-5">
              {content.title}{" "}
              <span className="gradient-text">{content.highlightedTitle}</span> hôm nay
            </h2>
            <p className="text-lg lg:text-xl text-slate-600">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={200}>
          <div className="bg-gradient-to-br from-[#F0F8FF] to-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12 hover:shadow-3xl transition-shadow duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="group">
                <label htmlFor="name" className="block text-[#0F172A] font-semibold mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-slate-400 group-focus-within:text-[#55B6F6] transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#55B6F6] focus:outline-none focus:ring-4 focus:ring-[#55B6F6]/10 transition-all bg-white"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label htmlFor="phone" className="block text-[#0F172A] font-semibold mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-[#55B6F6] transition-colors" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0901 234 567"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#55B6F6] focus:outline-none focus:ring-4 focus:ring-[#55B6F6]/10 transition-all bg-white"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label htmlFor="email" className="block text-[#0F172A] font-semibold mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#55B6F6] transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#55B6F6] focus:outline-none focus:ring-4 focus:ring-[#55B6F6]/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Goal */}
              <div className="group">
                <label htmlFor="goal" className="block text-[#0F172A] font-semibold mb-2">
                  Mục tiêu học tập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Target className="w-5 h-5 text-slate-400 group-focus-within:text-[#55B6F6] transition-colors" />
                  </div>
                  <select
                    id="goal"
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#55B6F6] focus:outline-none focus:ring-4 focus:ring-[#55B6F6]/10 transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Chọn mục tiêu của bạn...</option>
                    <option value="study">Du học Đức</option>
                    <option value="work">Làm việc tại Đức</option>
                    <option value="ausbildung">Chương trình Ausbildung</option>
                    <option value="migration">Di cư</option>
                    <option value="personal">Phát triển bản thân</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Level Interest */}
              <div>
                <label className="block text-[#0F172A] font-semibold mb-3">
                  Bạn quan tâm trình độ nào?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                    <label
                      key={level}
                      className="relative flex items-center justify-center p-3.5 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-[#55B6F6] hover:bg-[#55B6F6]/5 transition-all duration-300 group"
                    >
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={form.level === level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        className="sr-only peer"
                      />
                      <span className="text-[#0F172A] font-semibold peer-checked:text-[#55B6F6] transition-colors">
                        {level}
                      </span>
                      <div className="absolute inset-0 border-2 border-[#55B6F6] rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity bg-[#55B6F6]/5 peer-checked:bg-[#55B6F6]/5" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full group px-8 py-5 btn-gradient rounded-xl font-bold flex items-center justify-center gap-3 text-lg animate-glow disabled:opacity-50"
              >
                {status === "loading" ? "Đang gửi..." : content.submitButtonText}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {status === "success" && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm text-center">
                  Đăng ký thành công! Chúng tôi sẽ liên hệ bạn trong 24 giờ.
                </div>
              )}
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                  Đã xảy ra lỗi. Vui lòng thử lại.
                </div>
              )}

              <p className="text-center text-sm text-slate-500">
                Bằng việc đăng ký, bạn đồng ý nhận thông tin về khóa học.
                Chúng tôi tôn trọng quyền riêng tư và không gửi spam.
              </p>
            </form>

            {/* Trust badges */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  Tư vấn miễn phí
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  Không cần cam kết
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  Phản hồi trong 24h
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
