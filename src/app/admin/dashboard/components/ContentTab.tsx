"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff, Save, Code, Pencil } from "lucide-react";
import type { SiteContent, SiteSection } from "@/types/site-content";
import { ImageField } from "./ImageField";
import { StatusMessage } from "./StatusMessage";
import { TeachersEditor, CoursesEditor, TestimonialsEditor } from "./ArrayEditors";

interface ContentTabProps {
  content: SiteContent;
  contentLoading: boolean;
  saving: boolean;
  message: string;
  onUpdate: (updater: (prev: SiteContent) => SiteContent) => void;
  onSave: () => void;
}

export function ContentTab({ content, contentLoading, saving, message, onUpdate, onSave }: ContentTabProps) {
  const [selectedId, setSelectedId] = useState("hero");
  const [jsonMode, setJsonMode] = useState<Record<string, boolean>>({});

  const orderedSections = [...(content?.sections ?? [])].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!content?.sections?.length) return;
    const sorted = [...content.sections].sort((a, b) => a.order - b.order);
    if (!sorted.some((s) => s.id === selectedId)) setSelectedId(sorted[0].id);
  }, [content, selectedId]);

  if (contentLoading) return <p className="text-slate-500 text-sm p-8">Đang tải CMS...</p>;
  if (!content) return <p className="text-red-500 text-sm p-8">Không có dữ liệu CMS.</p>;

  const moveSection = (id: string, dir: "up" | "down") => {
    onUpdate((prev) => {
      const list = [...prev.sections].sort((a, b) => a.order - b.order);
      const idx = list.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= list.length) return prev;
      [list[idx], list[swap]] = [list[swap], list[idx]];
      return { ...prev, sections: list.map((item, i) => ({ ...item, order: i + 1 })) };
    });
  };

  const toggleSection = (id: string) => {
    onUpdate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  };

  const updateLabel = (id: string, label: string) => {
    onUpdate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, label } : s)),
    }));
  };

  // Map section IDs to content keys
  const contentKeyMap: Record<string, keyof SiteContent> = {
    hero: "hero", about: "about", "target-audience": "targetAudience",
    registration: "registration", cta: "cta", "social-proof": "socialProof",
    "learning-roadmap": "learningRoadmap", courses: "courses",
    "teaching-method": "teachingMethod", teachers: "teachers",
    testimonials: "testimonials", media: "media", ausbildung: "ausbildung",
  };

  const contentKey = contentKeyMap[selectedId];
  const isJson = jsonMode[selectedId];

  const renderJsonEditor = (key: keyof SiteContent) => (
    <textarea
      key={`json-${String(key)}-${selectedId}`}
      defaultValue={JSON.stringify(content[key], null, 2)}
      onBlur={(e) => {
        try {
          const parsed = JSON.parse(e.target.value);
          onUpdate((prev) => ({ ...prev, [key]: parsed }));
        } catch { /* invalid JSON, ignore */ }
      }}
      rows={16}
      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10"
    />
  );

  const field = (label: string, value: string, onChange: (v: string) => void, type: "input" | "textarea" = "input") => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10" />
      )}
    </div>
  );

  const u = (key: string, val: string) => {
    const k = contentKey;
    if (!k) return;
    onUpdate((prev) => {
      const current = prev[k] as unknown as Record<string, unknown>;
      return { ...prev, [k]: { ...current, [key]: val } };
    });
  };

  const renderUIEditor = () => {
    if (!contentKey) return <p className="text-sm text-slate-500 p-4">Section này chưa có editor. Dùng JSON mode.</p>;
    const data = content[contentKey] as unknown as Record<string, unknown>;

    if (selectedId === "hero") {
      const h = content.hero;
      return (
        <div className="space-y-4">
          {field("Badge Text", h.badgeText, (v) => u("badgeText", v))}
          <div className="grid grid-cols-2 gap-3">
            {field("Title", h.title, (v) => u("title", v))}
            {field("Highlighted Title", h.highlightedTitle, (v) => u("highlightedTitle", v))}
          </div>
          {field("Description", h.description, (v) => u("description", v), "textarea")}
          <div className="grid grid-cols-2 gap-3">
            {field("Primary Button", h.primaryButtonText, (v) => u("primaryButtonText", v))}
            {field("Secondary Button", h.secondaryButtonText, (v) => u("secondaryButtonText", v))}
          </div>
          <ImageField label="Hero Image" value={h.imageSrc} onChange={(v) => u("imageSrc", v)} />
          {field("Image Alt", h.imageAlt, (v) => u("imageAlt", v))}
          <div className="grid grid-cols-2 gap-3">
            {field("Float: Students Label", h.floatStudentsLabel, (v) => u("floatStudentsLabel", v))}
            {field("Float: Students Value", h.floatStudentsValue, (v) => u("floatStudentsValue", v))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Float: Enrollment Label", h.floatEnrollmentLabel, (v) => u("floatEnrollmentLabel", v))}
            {field("Float: Enrollment Value", h.floatEnrollmentValue, (v) => u("floatEnrollmentValue", v))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("Float: Pass Rate Label", h.floatPassRateLabel, (v) => u("floatPassRateLabel", v))}
            {field("Float: Pass Rate Value", h.floatPassRateValue, (v) => u("floatPassRateValue", v))}
          </div>
        </div>
      );
    }

    if (selectedId === "about") {
      const a = content.about;
      return (
        <div className="space-y-4">
          {field("Badge", a.badgeText, (v) => u("badgeText", v))}
          <div className="grid grid-cols-2 gap-3">
            {field("Heading", a.heading, (v) => u("heading", v))}
            {field("Subheading", a.subheading, (v) => u("subheading", v))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Highlights (mỗi dòng 1 item)</label>
            <textarea value={a.highlights.join("\n")} onChange={(e) => onUpdate((prev) => ({
              ...prev, about: { ...prev.about, highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }
            }))} rows={5} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#FF2D78] focus:outline-none" />
          </div>
          <ImageField label="About Image" value={a.imageSrc} onChange={(v) => u("imageSrc", v)} />
          {field("Image Alt", a.imageAlt, (v) => u("imageAlt", v))}
        </div>
      );
    }

    if (selectedId === "target-audience") {
      const ta = content.targetAudience;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field("Title", ta.title, (v) => onUpdate((p) => ({ ...p, targetAudience: { ...p.targetAudience, title: v } })))}
            {field("Highlighted", ta.highlightedTitle, (v) => onUpdate((p) => ({ ...p, targetAudience: { ...p.targetAudience, highlightedTitle: v } })))}
          </div>
          {ta.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400">Card {i + 1}</p>
              <input value={item.title} onChange={(e) => onUpdate((p) => ({ ...p, targetAudience: { ...p.targetAudience, items: p.targetAudience.items.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it) } }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
              <ImageField label="Image" value={item.image} onChange={(v) => onUpdate((p) => ({ ...p, targetAudience: { ...p.targetAudience, items: p.targetAudience.items.map((it, idx) => idx === i ? { ...it, image: v } : it) } }))} />
              <textarea value={item.description} onChange={(e) => onUpdate((p) => ({ ...p, targetAudience: { ...p.targetAudience, items: p.targetAudience.items.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it) } }))}
                rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
            </div>
          ))}
        </div>
      );
    }

    if (selectedId === "registration" || selectedId === "cta") {
      return (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase">Registration</p>
          {field("Badge", content.registration.badgeText, (v) => onUpdate((p) => ({ ...p, registration: { ...p.registration, badgeText: v } })))}
          {field("Button Text", content.registration.submitButtonText, (v) => onUpdate((p) => ({ ...p, registration: { ...p.registration, submitButtonText: v } })))}
          <p className="text-xs font-bold text-slate-400 uppercase mt-4">CTA</p>
          {field("Title", content.cta.title, (v) => onUpdate((p) => ({ ...p, cta: { ...p.cta, title: v } })))}
          {field("Urgency Text", content.cta.urgencyText, (v) => onUpdate((p) => ({ ...p, cta: { ...p.cta, urgencyText: v } })))}
        </div>
      );
    }

    // For all other sections — show basic fields + JSON fallback
    const simpleFields: Record<string, string[]> = {
      "social-proof": ["headingText", "brandText"],
      "learning-roadmap": ["badgeText", "title", "highlightedTitle", "description"],
      "teaching-method": ["badgeText", "title", "highlightedTitle", "description"],
      courses: ["badgeText", "title", "highlightedTitle", "description"],
      teachers: ["badgeText", "title", "highlightedTitle"],
      testimonials: ["badgeText", "title", "highlightedTitle"],
      media: ["badgeText", "title", "highlightedTitle", "description"],
      ausbildung: ["badgeText", "title", "highlightedTitle", "description", "ctaTitle", "ctaDescription", "ctaButtonText"],
    };

    const fields = simpleFields[selectedId];
    if (!fields) return renderJsonEditor(contentKey);

    // Teachers: full CRUD editor
    if (selectedId === "teachers") {
      const t = content.teachers;
      return (
        <div className="space-y-4">
          {fields?.map((f) => field(f, String(data[f] ?? ""), (v) => u(f, v)))}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách giảng viên ({t.items.length})</p>
            <TeachersEditor data={t} onUpdate={(newData) => onUpdate((prev) => ({ ...prev, teachers: newData }))} />
          </div>
        </div>
      );
    }

    // Courses: full CRUD editor
    if (selectedId === "courses") {
      const c = content.courses;
      return (
        <div className="space-y-4">
          {fields?.map((f) => field(f, String(data[f] ?? ""), (v) => u(f, v)))}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách khóa học ({c.items.length})</p>
            <CoursesEditor data={c} onUpdate={(newData) => onUpdate((prev) => ({ ...prev, courses: newData }))} />
          </div>
        </div>
      );
    }

    // Testimonials: full CRUD editor
    if (selectedId === "testimonials") {
      const tm = content.testimonials;
      return (
        <div className="space-y-4">
          {fields?.map((f) => field(f, String(data[f] ?? ""), (v) => u(f, v)))}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách cảm nhận ({tm.items.length})</p>
            <TestimonialsEditor data={tm} onUpdate={(newData) => onUpdate((prev) => ({ ...prev, testimonials: newData }))} />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {fields.map((f) => field(f, String(data[f] ?? ""), (v) => u(f, v)))}
        <p className="text-xs text-slate-400 mt-2">Sử dụng JSON mode để chỉnh sửa chi tiết items/arrays.</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Sidebar: Section ordering */}
      <aside className="xl:col-span-4 2xl:col-span-3 space-y-4">
        {/* Save button */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button onClick={onSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold hover:shadow-lg hover:shadow-[#FF2D78]/20 disabled:opacity-50 transition-all">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu nội dung CMS"}
          </button>
          {message && <StatusMessage message={message} className="mt-3" />}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-1">Sections</h2>
          <div className="space-y-1.5">
            {orderedSections.map((section: SiteSection, index) => (
              <div
                key={section.id}
                onClick={() => setSelectedId(section.id)}
                className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                  selectedId === section.id
                    ? "border-[#FF2D78] bg-[#FF2D78]/5 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      value={section.label}
                      onChange={(e) => updateLabel(section.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-[#FF2D78] focus:outline-none text-sm font-medium bg-transparent"
                    />
                    <p className="text-[10px] text-slate-400 px-2 font-mono">{section.id}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, "up"); }}
                      disabled={index === 0}
                      className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-20 transition">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, "down"); }}
                      disabled={index === orderedSections.length - 1}
                      className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-20 transition">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                      className={`p-1 rounded-md transition ${section.enabled ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}>
                      {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main: Content editor */}
      <section className="xl:col-span-8 2xl:col-span-9">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">
              {orderedSections.find((s) => s.id === selectedId)?.label || selectedId}
            </h3>
            {contentKey && (
              <button
                onClick={() => setJsonMode((p) => ({ ...p, [selectedId]: !p[selectedId] }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  isJson ? "bg-[#FF2D78] text-white border-[#FF2D78]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isJson ? <><Pencil className="w-3 h-3" /> UI Mode</> : <><Code className="w-3 h-3" /> JSON Mode</>}
              </button>
            )}
          </div>
          {contentKey && isJson ? renderJsonEditor(contentKey) : renderUIEditor()}
        </div>
      </section>
    </div>
  );
}
