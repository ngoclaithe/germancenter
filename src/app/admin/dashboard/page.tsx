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
  const [activeTab, setActiveTab] = useState<"leads" | "content" | "media">("leads");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const [advancedMode, setAdvancedMode] = useState<Record<string, "ui" | "json">>({
    socialProof: "ui",
    learningRoadmap: "ui",
    courses: "ui",
    teachingMethod: "ui",
    teachers: "ui",
    testimonials: "ui",
    media: "ui",
  });
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaMessage, setMediaMessage] = useState("");
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

  const fetchMedia = useCallback(async () => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) return;
    setMediaLoading(true);

    try {
      const res = await fetch("/api/admin/media", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("gc_admin_token");
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setMediaFiles(data.files || []);
    } catch {
      setMediaMessage("Không tải được thư viện ảnh.");
    } finally {
      setMediaLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSubmissions();
    fetchContent();
    fetchMedia();
  }, [fetchSubmissions, fetchContent, fetchMedia]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.floatStudentsLabel} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatStudentsLabel: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Students label" />
              <input value={content.hero.floatStudentsValue} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatStudentsValue: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Students value" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.floatEnrollmentLabel} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatEnrollmentLabel: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Enrollment label" />
              <input value={content.hero.floatEnrollmentValue} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatEnrollmentValue: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Enrollment value" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.floatPassRateLabel} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatPassRateLabel: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Pass rate label" />
              <input value={content.hero.floatPassRateValue} onChange={(e) => setContent({ ...content, hero: { ...content.hero, floatPassRateValue: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Float: Pass rate value" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.hero.imageSrc} onChange={(e) => setContent({ ...content, hero: { ...content.hero, imageSrc: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Hero image path" />
              <input value={content.hero.imageAlt} onChange={(e) => setContent({ ...content, hero: { ...content.hero, imageAlt: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Hero image alt" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={content.about.imageSrc} onChange={(e) => setContent({ ...content, about: { ...content.about, imageSrc: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="About image path" />
              <input value={content.about.imageAlt} onChange={(e) => setContent({ ...content, about: { ...content.about, imageAlt: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="About image alt" />
            </div>
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
                <input value={item.image} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, items: content.targetAudience.items.map((it, i) => i === index ? { ...it, image: e.target.value } : it) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image path (dùng từ Quản lý ảnh)" />
                <textarea value={item.description} onChange={(e) => setContent({ ...content, targetAudience: { ...content.targetAudience, items: content.targetAudience.items.map((it, i) => i === index ? { ...it, description: e.target.value } : it) } })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Card description" />
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
            <details key={String(key)} className="rounded-2xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{label}</h3>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAdvancedMode((prev) => ({ ...prev, [String(key)]: "ui" }));
                    }}
                    className={`px-2 py-1 rounded ${advancedMode[String(key)] !== "json" ? "bg-[#E11D79] text-white" : "text-slate-600"}`}
                  >
                    UI
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAdvancedMode((prev) => ({ ...prev, [String(key)]: "json" }));
                    }}
                    className={`px-2 py-1 rounded ${advancedMode[String(key)] === "json" ? "bg-[#E11D79] text-white" : "text-slate-600"}`}
                  >
                    JSON
                  </button>
                </div>
              </summary>

              <div className="pt-4 space-y-3">
                {advancedMode[String(key)] === "json" ? (
                  <textarea
                    defaultValue={JSON.stringify(content[key], null, 2)}
                    onBlur={(e) => updateJsonBlock(key, e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs bg-slate-50"
                  />
                ) : key === "teachers" ? (
                  <div className="space-y-3">
                    <input
                      value={content.teachers.badgeText}
                      onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, badgeText: e.target.value } })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Badge text"
                    />
                    {content.teachers.items.map((teacher, index) => (
                      <div key={`${teacher.name}-${index}`} className="rounded-xl border border-slate-200 p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-500">Teacher #{index + 1}</p>
                          <button
                            onClick={() =>
                              setContent({
                                ...content,
                                teachers: {
                                  ...content.teachers,
                                  items: content.teachers.items.filter((_, i) => i !== index),
                                },
                              })
                            }
                            className="text-xs px-2 py-1 rounded border border-red-200 text-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input value={teacher.name} onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, items: content.teachers.items.map((t, i) => i === index ? { ...t, name: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Name" />
                          <input value={teacher.role} onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, items: content.teachers.items.map((t, i) => i === index ? { ...t, role: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Role" />
                          <input value={teacher.specialty} onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, items: content.teachers.items.map((t, i) => i === index ? { ...t, specialty: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Specialty" />
                          <input value={teacher.image} onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, items: content.teachers.items.map((t, i) => i === index ? { ...t, image: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image path" />
                        </div>
                        <textarea value={teacher.bio} onChange={(e) => setContent({ ...content, teachers: { ...content.teachers, items: content.teachers.items.map((t, i) => i === index ? { ...t, bio: e.target.value } : t) } })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Bio" />
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setContent({
                          ...content,
                          teachers: {
                            ...content.teachers,
                            items: [
                              ...content.teachers.items,
                              {
                                name: "Giảng viên mới",
                                role: "",
                                specialty: "",
                                bio: "",
                                image: "/images/uploads/",
                                origin: "",
                                exp: "",
                                students: "",
                              },
                            ],
                          },
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
                    >
                      + Thêm giảng viên
                    </button>
                  </div>
                ) : key === "courses" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input value={content.courses.badgeText} onChange={(e) => setContent({ ...content, courses: { ...content.courses, badgeText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Badge text" />
                      <input value={content.courses.description} onChange={(e) => setContent({ ...content, courses: { ...content.courses, description: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                    </div>
                    {content.courses.items.map((course, index) => (
                      <div key={`${course.level}-${index}`} className="rounded-xl border border-slate-200 p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-500">Course #{index + 1}</p>
                          <button onClick={() => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.filter((_, i) => i !== index) } })} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600">Xóa</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input value={course.level} onChange={(e) => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.map((c, i) => i === index ? { ...c, level: e.target.value } : c) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Level" />
                          <input value={course.title} onChange={(e) => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.map((c, i) => i === index ? { ...c, title: e.target.value } : c) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
                          <input value={course.image} onChange={(e) => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.map((c, i) => i === index ? { ...c, image: e.target.value } : c) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image path" />
                          <input value={course.price} onChange={(e) => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.map((c, i) => i === index ? { ...c, price: e.target.value } : c) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Price" />
                        </div>
                        <textarea value={course.description} onChange={(e) => setContent({ ...content, courses: { ...content.courses, items: content.courses.items.map((c, i) => i === index ? { ...c, description: e.target.value } : c) } })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                      </div>
                    ))}
                    <button onClick={() => setContent({ ...content, courses: { ...content.courses, items: [...content.courses.items, { level: "A1", title: "Khóa mới", description: "", duration: "", lessons: "", price: "", popular: false, image: "/images/uploads/", features: [] }] } })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">+ Thêm khóa học</button>
                  </div>
                ) : key === "testimonials" ? (
                  <div className="space-y-3">
                    {content.testimonials.items.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="rounded-xl border border-slate-200 p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-500">Testimonial #{index + 1}</p>
                          <button onClick={() => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.filter((_, i) => i !== index) } })} className="text-xs px-2 py-1 rounded border border-red-200 text-red-600">Xóa</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input value={item.name} onChange={(e) => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.map((t, i) => i === index ? { ...t, name: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Name" />
                          <input value={item.role} onChange={(e) => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.map((t, i) => i === index ? { ...t, role: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Role" />
                          <input value={item.level} onChange={(e) => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.map((t, i) => i === index ? { ...t, level: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Level" />
                          <input value={item.image} onChange={(e) => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.map((t, i) => i === index ? { ...t, image: e.target.value } : t) } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Image path" />
                        </div>
                        <textarea value={item.text} onChange={(e) => setContent({ ...content, testimonials: { ...content.testimonials, items: content.testimonials.items.map((t, i) => i === index ? { ...t, text: e.target.value } : t) } })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Feedback text" />
                      </div>
                    ))}
                    <button onClick={() => setContent({ ...content, testimonials: { ...content.testimonials, items: [...content.testimonials.items, { name: "Học viên mới", role: "", level: "", image: "/images/uploads/", rating: 5, text: "" }] } })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">+ Thêm cảm nhận</button>
                  </div>
                ) : key === "media" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input value={content.media.mainImage} onChange={(e) => setContent({ ...content, media: { ...content.media, mainImage: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Main image path" />
                      <input value={content.media.secondaryImage} onChange={(e) => setContent({ ...content, media: { ...content.media, secondaryImage: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Secondary image path" />
                    </div>
                    <textarea value={content.media.description} onChange={(e) => setContent({ ...content, media: { ...content.media, description: e.target.value } })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                  </div>
                ) : key === "socialProof" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={content.socialProof.headingText} onChange={(e) => setContent({ ...content, socialProof: { ...content.socialProof, headingText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Heading text" />
                    <input value={content.socialProof.brandText} onChange={(e) => setContent({ ...content, socialProof: { ...content.socialProof, brandText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Brand text" />
                  </div>
                ) : key === "learningRoadmap" ? (
                  <div className="space-y-3">
                    <input value={content.learningRoadmap.description} onChange={(e) => setContent({ ...content, learningRoadmap: { ...content.learningRoadmap, description: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                    <p className="text-xs text-slate-500">Sửa chi tiết levels qua JSON mode nếu cần nâng cao.</p>
                  </div>
                ) : key === "teachingMethod" ? (
                  <div className="space-y-3">
                    <input value={content.teachingMethod.description} onChange={(e) => setContent({ ...content, teachingMethod: { ...content.teachingMethod, description: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                    <p className="text-xs text-slate-500">Sửa chi tiết methods/stats qua JSON mode nếu cần nâng cao.</p>
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </section>
      </div>
    );
  };

  const renderMediaManager = () => {
    const uploadFile = async (file: File) => {
      const token = localStorage.getItem("gc_admin_token");
      if (!token) return;
      setMediaMessage("Đang upload...");
      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");
        setMediaMessage(`Upload thành công: ${data.path}`);
        fetchMedia();
      } catch (error) {
        setMediaMessage(error instanceof Error ? error.message : "Lỗi upload ảnh");
      }
    };

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold mb-3">Upload ảnh vào public</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
            className="block w-full text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">Ảnh sẽ lưu ở `public/images/uploads` và trả về path dạng `/images/uploads/ten-file`</p>
          {mediaMessage && <p className="text-sm text-slate-700 mt-3">{mediaMessage}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Thư viện ảnh</h2>
            <button onClick={fetchMedia} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-100">Refresh</button>
          </div>
          {mediaLoading ? (
            <p className="text-sm text-slate-500">Đang tải ảnh...</p>
          ) : mediaFiles.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có ảnh upload.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mediaFiles.map((filePath) => (
                <div key={filePath} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                  <p className="text-xs text-slate-600 break-all mb-2">{filePath}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(filePath)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 text-white"
                    >
                      Copy path
                    </button>
                    <a href={filePath} target="_blank" className="px-3 py-1.5 text-xs rounded-lg border border-slate-300">
                      Xem ảnh
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-white p-4 hidden lg:block">
          <div className="flex items-center gap-3 px-2 py-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white font-black text-xs">GC</div>
            <div>
              <h1 className="text-base font-semibold">Lingua German</h1>
              <p className="text-slate-500 text-xs">CMS Dashboard</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                activeTab === "leads"
                  ? "bg-[#E11D79] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                activeTab === "content"
                  ? "bg-[#E11D79] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Content CMS
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                activeTab === "media"
                  ? "bg-[#E11D79] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Quản lý ảnh
            </button>
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="lg:hidden flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === "leads" ? "bg-[#E11D79] text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Leads
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === "content" ? "bg-[#E11D79] text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Content CMS
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === "media" ? "bg-[#E11D79] text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Ảnh
                </button>
              </div>
              <div className="hidden lg:block text-sm text-slate-500">Admin workspace</div>
              <div className="flex items-center gap-2">
                <Link href="/" className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition">Trang chủ</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 hover:bg-red-100 transition">Đăng xuất</button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
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
        ) : activeTab === "content" ? (
          renderContentEditor()
        ) : (
          renderMediaManager()
        )}

        <div className="mt-6 flex items-center justify-between text-slate-400 text-xs">
          <p>Dữ liệu lưu tại `data/submissions.json`</p>
          <p>Lingua German CMS v2.0</p>
        </div>
      </div>
        </section>
      </div>
    </main>
  );
}
