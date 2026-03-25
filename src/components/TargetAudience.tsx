"use client";

import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

const audiences = [
  {
    image: "/images/doituong/designer.webp",
    title: "Người đi làm",
    description:
      "Nâng cao cơ hội nghề nghiệp, làm việc tại các công ty Đức hoặc đối tác châu Âu.",
    color: "from-[#2563EB]/10 to-[#2563EB]/5",
    borderColor: "border-[#2563EB]/20",
  },
  {
    image: "/images/doituong/student.webp",
    title: "Học sinh, Sinh viên",
    description:
      "Chuẩn bị du học Đức, thi chứng chỉ Goethe, TestDaF — mở cánh cửa tương lai.",
    color: "from-[#7C3AED]/10 to-[#7C3AED]/5",
    borderColor: "border-[#7C3AED]/20",
  },
  {
    image: "/images/doituong/marketer.webp",
    title: "Chuyên viên",
    description:
      "Giao tiếp chuyên nghiệp với đối tác Đức, tạo lợi thế cạnh tranh trong công việc.",
    color: "from-[#2563EB]/10 to-[#7C3AED]/5",
    borderColor: "border-[#2563EB]/20",
  },
  {
    image: "/images/doituong/owner2.webp",
    title: "Chủ doanh nghiệp",
    description:
      "Mở rộng thị trường, hợp tác kinh doanh với Đức — nền kinh tế lớn nhất EU.",
    color: "from-[#7C3AED]/10 to-[#2563EB]/5",
    borderColor: "border-[#7C3AED]/20",
  },
];

export function TargetAudience() {
  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <AnimateOnScroll direction="up" delay={0}>
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight">
              Dù bạn đang là{" "}
              <span className="gradient-text">ai...</span>
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl">
              German Center đồng hành cùng mọi đối tượng trên con đường chinh phục tiếng Đức.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <AnimateOnScroll key={index} direction="up" delay={index * 150}>
              <div
                className={`group relative bg-gradient-to-br ${item.color} rounded-2xl border ${item.borderColor} p-6 pt-0 transition-all duration-500 hover:shadow-2xl hover:shadow-[#2563EB]/10 hover:-translate-y-2 overflow-visible`}
              >
                {/* Character image - pops above card */}
                <div className="flex justify-center -mt-4 mb-4">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="h-[180px] lg:h-[200px] object-contain drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500"
                      style={{ width: "auto" }}
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center pb-4">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
