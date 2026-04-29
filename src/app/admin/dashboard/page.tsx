"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SiteContent, SiteSection } from "@/types/site-content";

interface Submission {
  id: number;
  name: string;
  phone: string;
  goal: string;
  level: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "content">("leads");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const router = useRouter();

  const fetchSubmissions = useCallback(async () => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) { router.push("/admin"); return; }

    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("gc_admin_token");
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchContent = useCallback(async () => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/content", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("gc_admin_token");
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setContent(data.content ?? null);
    } catch {
      setContentMessage("Không thể tải dữ liệu CMS.");
    } finally {
      setContentLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSubmissions();
    fetchContent();
  }, [fetchSubmissions, fetchContent]);

  const handleLogout = () => {
    localStorage.removeItem("gc_admin_token");
    router.push("/admin");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa đăng ký của "${name}"?`)) return;
    const token = localStorage.getItem("gc_admin_token");
    try {
      await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  const goalLabels: Record<string, string> = {
    study: "Du học Đức",
    work: "Làm việc tại Đức",
    ausbildung: "Ausbildung",
    migration: "Di cư",
    personal: "Phát triển bản thân",
    other: "Khác",
  };

  const goalColors: Record<string, string> = {
    study: "bg-blue-500/10 text-blue-400",
    work: "bg-green-500/10 text-green-400",
    ausbildung: "bg-purple-500/10 text-purple-400",
    migration: "bg-yellow-500/10 text-yellow-400",
    personal: "bg-cyan-500/10 text-cyan-400",
    other: "bg-slate-500/10 text-slate-400",
  };

  const todayCount = submissions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const weekCount = submissions.filter((s) => {
    const d = new Date(s.createdAt);
    return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }).length;

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const moveSection = (id: string, direction: "up" | "down") => {
    if (!content) return;
    const list = [...content.sections].sort((a, b) => a.order - b.order);
    const index = list.findIndex((s) => s.id === id);
    if (index < 0) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= list.length) return;

    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
    const normalized = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setContent({ ...content, sections: normalized });
  };

  const toggleSection = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      sections: content.sections.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ),
    });
  };

  const updateSectionLabel = (id: string, label: string) => {
    if (!content) return;
    setContent({
      ...content,
      sections: content.sections.map((item) => (item.id === id ? { ...item, label } : item)),
    });
  };

  const saveContent = async () => {
    if (!content) return;
    setContentSaving(true);
    setContentMessage("");
    const token = localStorage.getItem("gc_admin_token");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu dữ liệu");
      setContent(data.content);
      setContentMessage("Đã cập nhật nội dung website thành công.");
    } catch (error) {
      setContentMessage(error instanceof Error ? error.message : "Lỗi cập nhật CMS");
    } finally {
      setContentSaving(false);
    }
  };

  const orderedSections = (content?.sections ?? []).slice().sort((a, b) => a.order - b.order);

  const updateJsonBlock = (key: keyof SiteContent, value: string) => {
    if (!content) return;
    try {
      const parsed = JSON.parse(value);
      setContent({ ...content, [key]: parsed });
      setContentMessage("");
    } catch {
      setContentMessage(`JSON không hợp lệ ở block: ${String(key)}`);
    }
  };

  const renderContentEditor = () => {
    if (contentLoading) {
      return <p className="text-slate-500 text-sm">Đang tải cấu hình CMS...</p>;
    }
    if (!content) {
      return <p className="text-red-500 text-sm">Không có dữ liệu CMS.</p>;
    }

    const sectionCards = [
      {
        key: "hero",
        title: "Hero",
        body: (
          <div className="space-y-3">
            <input value={content.hero.badgeText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, badgeText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Badge text" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
              <input value={content.hero.highlightedTitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, highlightedTitle: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Highlighted title" />
            </div>
            <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.primaryButtonText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryButtonText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Primary button text" />
              <input value={content.hero.secondaryButtonText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryButtonText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Secondary button text" />
            </div>
          </div>
        ),
      },
      {
        key: "about",
        title: "About",
        body: (
          <div className="space-y-3">
            <input value={content.about.badgeText} onChange={(e) => setContent({ ...content, about: { ...content.about, badgeText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Badge text" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.about.heading} onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Heading" />
              <input value={content.about.subheading} onChange={(e) => setContent({ ...content, about: { ...content.about, subheading: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Subheading" />
            </div>
            <textarea value={content.about.highlights.join("\n")} onChange={(e) => setContent({ ...content, about: { ...content.about, highlights: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Mỗi dòng là một highlight" />
          </div>
        ),
      },
      {
        key: "target",
        title: "Target Audience",
        body: (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.targetAudience.title} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, title: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
              <input value={content.targetAudience.highlightedTitle} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, highlightedTitle: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Highlighted title" />
            </div>
            {content.targetAudience.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-3 space-y-2">
                <p className="text-xs text-slate-500">Card {index + 1}</p>
                <input value={item.title} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, items: content.targetAudience.items.map((it, i) => i === index ? { ...it, title: e.target.value } : it) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Card title" />
                <input value={item.image} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, items: content.targetAudience.items.map((it, i) => i === index ? { ...it, image: e.target.value } : it) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image path" />
              </div>
            ))}
          </div>
        ),
      },
      {
        key: "conversion",
        title: "Registration + CTA",
        body: (
          <div className="space-y-3">
            <input value={content.registration.badgeText} onChange={(e) => setContent({ ...content, registration: { ...content.registration, badgeText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Registration badge" />
            <input value={content.registration.submitButtonText} onChange={(e) => setContent({ ...content, registration: { ...content.registration, submitButtonText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Registration button text" />
            <input value={content.cta.title} onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="CTA title" />
            <input value={content.cta.urgencyText} onChange={(e) => setContent({ ...content, cta: { ...content.cta, urgencyText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Urgency text" />
          </div>
        ),
      },
    ];

    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <aside className="xl:col-span-4 2xl:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Section order & visibility</h2>
          {orderedSections.map((section: SiteSection, index) => (
              <div key={section.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex flex-col gap-2 mb-2">
              <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">{section.id}</p>
                <input
                  value={section.label}
                  onChange={(e) => updateSectionLabel(section.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                />
              </div>
                <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSection(section.id, "up")}
                  disabled={index === 0}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSection(section.id, "down")}
                  disabled={index === orderedSections.length - 1}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => toggleSection(section.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-sm ${
                      section.enabled ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {section.enabled ? "Hiện" : "Ẩn"}
                </button>
              </div>
            </div>
          ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <button
              onClick={saveContent}
              disabled={contentSaving}
              className="w-full px-4 py-2.5 rounded-lg bg-[#E11D79] text-white font-semibold hover:bg-[#be185d] disabled:opacity-50"
            >
              {contentSaving ? "Đang lưu..." : "Lưu nội dung CMS"}
            </button>
            {contentMessage && <p className="text-xs mt-2 text-slate-600">{contentMessage}</p>}
          </div>
        </aside>

        <section className="xl:col-span-8 2xl:col-span-9 space-y-4">
          {sectionCards.map((card, idx) => (
            <details key={card.key} open={idx === 0} className="rounded-2xl border border-slate-200 bg-white p-4 group">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{card.title}</h3>
                <span className="text-slate-400 text-sm group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <div className="pt-4">{card.body}</div>
            </details>
          ))}

          <details className="rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Advanced JSON blocks</h3>
              <span className="text-slate-400 text-sm">Chỉnh khi cần</span>
            </summary>
            <div className="pt-4 space-y-4">
              <p className="text-xs text-slate-500">Dùng cho section phức tạp: SocialProof, Roadmap, Courses, TeachingMethod, Teachers, Testimonials, Media.</p>
              {(
                [
                  ["socialProof", "SocialProof"],
                  ["learningRoadmap", "LearningRoadmap"],
                  ["courses", "Courses"],
                  ["teachingMethod", "TeachingMethod"],
                  ["teachers", "Teachers"],
                  ["testimonials", "Testimonials"],
                  ["media", "Media"],
                ] as Array<[keyof SiteContent, string]>
              ).map(([key, label]) => (
                <div key={String(key)} className="space-y-2">
                  <label className="block text-sm text-slate-700">{label}</label>
              <textarea
                defaultValue={JSON.stringify(content[key], null, 2)}
                onBlur={(e) => updateJsonBlock(key, e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs bg-slate-50"
              />
            </div>
              ))}
            </div>
          </details>
        </section>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white font-black text-xs">GC</div>
            <div>
              <h1 className="text-base font-semibold">Lingua German</h1>
              <p className="text-slate-500 text-xs">CMS Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition">Trang chủ</Link>
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 hover:bg-red-100 transition">Đăng xuất</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tổng đăng ký", value: submissions.length, sub: "tất cả" },
            { label: "Hôm nay", value: todayCount, sub: new Date().toLocaleDateString("vi-VN") },
            { label: "Tuần này", value: weekCount, sub: "7 ngày qua" },
            { label: "Tỷ lệ Du học", value: submissions.length ? Math.round((submissions.filter((s) => s.goal === "study").length / submissions.length) * 100) + "%" : "0%", sub: "mục tiêu phổ biến" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 mb-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === "leads" ? "bg-[#E11D79] text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-lg text-sm transition ${activeTab === "content" ? "bg-[#E11D79] text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Content CMS
          </button>
        </div>

        {activeTab === "leads" ? (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Danh sách đăng ký</h2>
              <p className="text-slate-500 text-xs mt-1">{filtered.length} kết quả</p>
            </div>
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc SĐT..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-[#E11D79] focus:outline-none focus:ring-1 focus:ring-[#E11D79]/20 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#E11D79] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">
                {search ? "Không tìm thấy kết quả" : "Chưa có đăng ký nào"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">#</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">Họ tên</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">SĐT</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">Mục tiêu</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">Trình độ</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">Ngày đăng ký</th>
                    <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#E11D79] text-xs font-bold">{s.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono">{s.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${goalColors[s.goal] || "bg-slate-100 text-slate-500"}`}>
                          {goalLabels[s.goal] || s.goal || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {s.level ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#FCE7F3] text-[#BE185D] text-xs font-bold">
                            {s.level}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        <div>{new Date(s.createdAt).toLocaleDateString("vi-VN")}</div>
                        <div className="text-slate-400">{new Date(s.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        ) : (
          renderContentEditor()
        )}

        <div className="mt-6 flex items-center justify-between text-slate-400 text-xs">
          <p>Dữ liệu lưu tại `data/submissions.json`</p>
          <p>Lingua German CMS v2.0</p>
        </div>
      </div>
    </main>
  );
}
