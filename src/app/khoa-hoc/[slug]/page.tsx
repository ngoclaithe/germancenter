import { SafeImage } from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock, Users, ArrowRight, Star, Check, BookOpen,
  GraduationCap, ArrowLeft, CalendarDays, Award,
} from "lucide-react";
import { getSiteContent } from "@/lib/site-content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import type { CourseItemContent } from "@/types/site-content";

export const dynamic = "force-dynamic";

function courseSlug(level: string) {
  return level.toLowerCase().replace(/\s+/g, "-");
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const course = content.courses.items.find((c) => courseSlug(c.level) === slug);
  if (!course) return { title: "Không tìm thấy khóa học" };

  return {
    title: `${course.title} (${course.level}) | Lingua German`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const courses = content.courses.items;
  const course = courses.find((c) => courseSlug(c.level) === slug);

  if (!course) notFound();

  const currentIndex = courses.indexOf(course);
  const prevCourse: CourseItemContent | undefined = courses[currentIndex - 1];
  const nextCourse: CourseItemContent | undefined = courses[currentIndex + 1];

  const levelColors: Record<string, string> = {
    A1: "from-emerald-500 to-teal-500",
    A2: "from-blue-500 to-cyan-500",
    B1: "from-[#FF2D78] to-[#FF6B9D]",
    B2: "from-purple-500 to-violet-500",
    C1: "from-amber-500 to-orange-500",
  };

  const gradient = levelColors[course.level] || "from-[#FF2D78] to-[#FF6B9D]";

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF2D78]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/#courses" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#FF2D78] transition mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách khóa học
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {course.level}
                </div>
                {course.popular && (
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Phổ biến nhất
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Clock className="w-5 h-5 text-[#FF2D78] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">{course.duration}</p>
                  <p className="text-xs text-slate-500">Thời lượng</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <BookOpen className="w-5 h-5 text-[#FF2D78] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">{course.lessons}</p>
                  <p className="text-xs text-slate-500">Buổi học</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Users className="w-5 h-5 text-[#FF2D78] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">Max 10</p>
                  <p className="text-xs text-slate-500">Học viên/lớp</p>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-3xl font-extrabold text-[#0F172A]">{course.price}</span>
                  <span className="text-slate-500 ml-1">VNĐ</span>
                </div>
                <Link href="/#contact"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold text-sm flex items-center gap-2 hover:shadow-xl hover:shadow-[#FF2D78]/25 transition-all duration-300 hover:-translate-y-0.5">
                  Đăng ký ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <SafeImage
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-10`} />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Tỷ lệ đậu 95%</p>
                  <p className="text-xs text-slate-500">Cam kết đầu ra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-6 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  Bạn sẽ học được gì?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm text-slate-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Khóa học bao gồm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "📚", text: "Giáo trình chuẩn CEFR" },
                    { icon: "👨‍🏫", text: "Giáo viên bản ngữ Đức" },
                    { icon: "📝", text: "Đề thi thử theo format Goethe" },
                    { icon: "🎧", text: "Tài liệu nghe bổ trợ" },
                    { icon: "💬", text: "Nhóm hỗ trợ Zalo/Telegram" },
                    { icon: "📜", text: "Chứng chỉ hoàn thành khóa học" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: enrollment card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Học phí</p>
                  <p className="text-3xl font-extrabold text-[#0F172A]">{course.price} <span className="text-base font-normal text-slate-500">VNĐ</span></p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Trình độ</span>
                    <span className="font-semibold text-slate-900">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Thời lượng</span>
                    <span className="font-semibold text-slate-900">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Số buổi</span>
                    <span className="font-semibold text-slate-900">{course.lessons}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Sĩ số</span>
                    <span className="font-semibold text-slate-900">Tối đa 10</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500">Lịch học</span>
                    <span className="font-semibold text-slate-900">Linh hoạt</span>
                  </div>
                </div>

                <Link href="/#contact"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold text-sm hover:shadow-xl hover:shadow-[#FF2D78]/25 transition-all">
                  <CalendarDays className="w-4 h-4" />
                  Đăng ký tư vấn miễn phí
                </Link>

                <p className="text-center text-xs text-slate-400">
                  Tư vấn viên sẽ liên hệ trong 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other courses nav */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {prevCourse ? (
              <Link href={`/khoa-hoc/${courseSlug(prevCourse.level)}`}
                className="flex items-center gap-3 group">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-[#FF2D78] group-hover:-translate-x-1 transition-all" />
                <div>
                  <p className="text-xs text-slate-400">Khóa trước</p>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#FF2D78] transition">{prevCourse.level} - {prevCourse.title}</p>
                </div>
              </Link>
            ) : <div />}

            <Link href="/#courses" className="text-sm text-slate-500 hover:text-[#FF2D78] transition font-medium">
              Tất cả khóa học
            </Link>

            {nextCourse ? (
              <Link href={`/khoa-hoc/${courseSlug(nextCourse.level)}`}
                className="flex items-center gap-3 text-right group">
                <div>
                  <p className="text-xs text-slate-400">Khóa tiếp</p>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#FF2D78] transition">{nextCourse.level} - {nextCourse.title}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF2D78] group-hover:translate-x-1 transition-all" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
