"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, User, Star, MessageSquare } from "lucide-react";
import type { TeacherItemContent, TeachersContent, CourseItemContent, CoursesContent, TestimonialItemContent, TestimonialsContent } from "@/types/site-content";
import { ImageField } from "./ImageField";

/* ─── Teachers Editor ─── */
interface TeachersEditorProps {
  data: TeachersContent;
  onUpdate: (data: TeachersContent) => void;
}

const emptyTeacher: TeacherItemContent = {
  name: "", role: "", specialty: "", bio: "", image: "", origin: "", exp: "", students: "",
};

export function TeachersEditor({ data, onUpdate }: TeachersEditorProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const updateItem = (index: number, patch: Partial<TeacherItemContent>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({ ...data, items: [...data.items, { ...emptyTeacher }] });
    setExpandedIdx(data.items.length);
  };

  const removeItem = (index: number) => {
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
    setExpandedIdx(null);
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const items = [...data.items];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    onUpdate({ ...data, items });
    setExpandedIdx(swap);
  };

  return (
    <div className="space-y-3">
      {data.items.map((teacher, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {/* Collapsed header */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
          >
            <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
            {teacher.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={teacher.image} alt={teacher.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{teacher.name || "Giảng viên mới"}</p>
              <p className="text-xs text-slate-500 truncate">{teacher.role || "Chưa có chức vụ"}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "up"); }} disabled={i === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "down"); }} disabled={i === data.items.length - 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronDown className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {/* Expanded form */}
          {expandedIdx === i && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Họ tên" value={teacher.name} onChange={(v) => updateItem(i, { name: v })} />
                <Field label="Chức vụ" value={teacher.role} onChange={(v) => updateItem(i, { role: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Chuyên môn" value={teacher.specialty} onChange={(v) => updateItem(i, { specialty: v })} />
                <Field label="Xuất xứ" value={teacher.origin} onChange={(v) => updateItem(i, { origin: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kinh nghiệm" value={teacher.exp} onChange={(v) => updateItem(i, { exp: v })} />
                <Field label="Học viên" value={teacher.students} onChange={(v) => updateItem(i, { students: v })} />
              </div>
              <Field label="Giới thiệu" value={teacher.bio} onChange={(v) => updateItem(i, { bio: v })} type="textarea" />
              <ImageField label="Ảnh giảng viên" value={teacher.image} onChange={(v) => updateItem(i, { image: v })} />
            </div>
          )}
        </div>
      ))}

      <button onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-500 hover:border-[#55B6F6] hover:text-[#55B6F6] transition">
        <Plus className="w-4 h-4" /> Thêm giảng viên
      </button>
    </div>
  );
}

/* ─── Courses Editor ─── */
interface CoursesEditorProps {
  data: CoursesContent;
  onUpdate: (data: CoursesContent) => void;
}

const emptyCourse: CourseItemContent = {
  level: "", title: "", description: "", duration: "", lessons: "", price: "", popular: false, image: "", features: [],
};

export function CoursesEditor({ data, onUpdate }: CoursesEditorProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const updateItem = (index: number, patch: Partial<CourseItemContent>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({ ...data, items: [...data.items, { ...emptyCourse }] });
    setExpandedIdx(data.items.length);
  };

  const removeItem = (index: number) => {
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
    setExpandedIdx(null);
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const items = [...data.items];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    onUpdate({ ...data, items });
    setExpandedIdx(swap);
  };

  return (
    <div className="space-y-3">
      {data.items.map((course, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
          >
            <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
            <div className={`px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${course.popular ? "bg-[#55B6F6]/10 text-[#55B6F6]" : "bg-slate-100 text-slate-600"}`}>
              {course.level || "---"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{course.title || "Khóa học mới"}</p>
              <p className="text-xs text-slate-500 truncate">{course.price || "Chưa có giá"}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "up"); }} disabled={i === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "down"); }} disabled={i === data.items.length - 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronDown className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {expandedIdx === i && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Level" value={course.level} onChange={(v) => updateItem(i, { level: v })} />
                <Field label="Tiêu đề" value={course.title} onChange={(v) => updateItem(i, { title: v })} />
              </div>
              <Field label="Mô tả" value={course.description} onChange={(v) => updateItem(i, { description: v })} type="textarea" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Thời lượng" value={course.duration} onChange={(v) => updateItem(i, { duration: v })} />
                <Field label="Số buổi" value={course.lessons} onChange={(v) => updateItem(i, { lessons: v })} />
                <Field label="Giá" value={course.price} onChange={(v) => updateItem(i, { price: v })} />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={course.popular} onChange={(e) => updateItem(i, { popular: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#55B6F6] focus:ring-[#55B6F6]" />
                  <span className="text-xs font-medium text-slate-700">Khóa học nổi bật</span>
                </label>
              </div>
              <ImageField label="Ảnh khóa học" value={course.image} onChange={(v) => updateItem(i, { image: v })} />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Đặc điểm (mỗi dòng 1 item)</label>
                <textarea
                  value={course.features.join("\n")}
                  onChange={(e) => updateItem(i, { features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#55B6F6] focus:outline-none focus:ring-2 focus:ring-[#55B6F6]/10"
                  placeholder="Mỗi dòng 1 tính năng..."
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-500 hover:border-[#55B6F6] hover:text-[#55B6F6] transition">
        <Plus className="w-4 h-4" /> Thêm khóa học
      </button>
    </div>
  );
}

/* ─── Testimonials Editor ─── */
interface TestimonialsEditorProps {
  data: TestimonialsContent;
  onUpdate: (data: TestimonialsContent) => void;
}

const emptyTestimonial: TestimonialItemContent = {
  name: "", role: "", level: "", image: "", rating: 5, text: "",
};

export function TestimonialsEditor({ data, onUpdate }: TestimonialsEditorProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const updateItem = (index: number, patch: Partial<TestimonialItemContent>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({ ...data, items: [...data.items, { ...emptyTestimonial }] });
    setExpandedIdx(data.items.length);
  };

  const removeItem = (index: number) => {
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
    setExpandedIdx(null);
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const items = [...data.items];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    onUpdate({ ...data, items });
    setExpandedIdx(swap);
  };

  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
          >
            <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{item.name || "Cảm nhận mới"}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500 truncate">{item.role || "Chưa có vai trò"}</p>
                {item.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, s) => (
                      <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "up"); }} disabled={i === 0}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronUp className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); moveItem(i, "down"); }} disabled={i === data.items.length - 1}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 transition"><ChevronDown className="w-3.5 h-3.5" /></button>
              <button onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {expandedIdx === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>

          {expandedIdx === i && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Họ tên" value={item.name} onChange={(v) => updateItem(i, { name: v })} />
                <Field label="Vai trò" value={item.role} onChange={(v) => updateItem(i, { role: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Trình độ" value={item.level} onChange={(v) => updateItem(i, { level: v })} />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Đánh giá (1-5 sao)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => updateItem(i, { rating: star })}
                        className="p-0.5 transition hover:scale-110">
                        <Star className={`w-5 h-5 ${star <= item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Field label="Nội dung cảm nhận" value={item.text} onChange={(v) => updateItem(i, { text: v })} type="textarea" />
              <ImageField label="Ảnh học viên" value={item.image} onChange={(v) => updateItem(i, { image: v })} />
            </div>
          )}
        </div>
      ))}

      <button onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-500 hover:border-[#55B6F6] hover:text-[#55B6F6] transition">
        <Plus className="w-4 h-4" /> Thêm cảm nhận
      </button>
    </div>
  );
}

/* \u2500\u2500\u2500 Shared Field Component \u2500\u2500\u2500 */
function Field({ label, value, onChange, type = "input" }: {
  label: string; value: string; onChange: (v: string) => void; type?: "input" | "textarea";
}) {
  const cls = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#55B6F6] focus:outline-none focus:ring-2 focus:ring-[#55B6F6]/10";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
