"use client";

import { useState, useMemo } from "react";
import {
  Users, Calendar, CalendarDays, TrendingUp, Search, Trash2, Inbox, Loader2,
  Download, CheckCircle2, Circle, Filter, Mail,
} from "lucide-react";

interface Submission {
  id: number;
  name: string;
  phone: string;
  email: string;
  goal: string;
  level: string;
  contacted: boolean;
  note: string;
  createdAt: string;
}

interface LeadsTabProps {
  submissions: Submission[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: number, name: string) => void;
  onUpdate: (id: number, updates: Partial<Submission>) => void;
}

const goalLabels: Record<string, string> = {
  study: "Du học Đức", work: "Làm việc tại Đức", ausbildung: "Ausbildung",
  migration: "Di cư", personal: "Phát triển bản thân", other: "Khác",
};

const goalColors: Record<string, string> = {
  study: "bg-blue-500/10 text-blue-600 border-blue-200",
  work: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  ausbildung: "bg-purple-500/10 text-purple-600 border-purple-200",
  migration: "bg-amber-500/10 text-amber-600 border-amber-200",
  personal: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  other: "bg-slate-500/10 text-slate-500 border-slate-200",
};

type DateFilter = "all" | "today" | "week" | "month";
type ContactFilter = "all" | "contacted" | "not-contacted";

export function LeadsTab({ submissions, loading, search, onSearchChange, onDelete, onUpdate }: LeadsTabProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("all");
  const [editingNote, setEditingNote] = useState<number | null>(null);

  const todayCount = submissions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const weekCount = submissions.filter((s) =>
    new Date(s.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const contactedCount = submissions.filter((s) => s.contacted).length;

  const filtered = useMemo(() => {
    let list = submissions;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) || s.phone.includes(q) || (s.email || "").toLowerCase().includes(q)
      );
    }
    const now = new Date();
    if (dateFilter === "today") list = list.filter((s) => new Date(s.createdAt).toDateString() === now.toDateString());
    else if (dateFilter === "week") list = list.filter((s) => new Date(s.createdAt) >= new Date(Date.now() - 7 * 86400000));
    else if (dateFilter === "month") list = list.filter((s) => new Date(s.createdAt) >= new Date(Date.now() - 30 * 86400000));
    if (contactFilter === "contacted") list = list.filter((s) => s.contacted);
    else if (contactFilter === "not-contacted") list = list.filter((s) => !s.contacted);
    return list;
  }, [submissions, search, dateFilter, contactFilter]);

  const exportCSV = () => {
    const headers = ["#", "Họ tên", "SĐT", "Email", "Mục tiêu", "Trình độ", "Trạng thái", "Ghi chú", "Ngày đăng ký"];
    const rows = submissions.map((s, i) => [
      i + 1, s.name, s.phone, s.email || "", goalLabels[s.goal] || s.goal || "",
      s.level || "", s.contacted ? "Đã liên hệ" : "Chưa liên hệ", s.note || "",
      new Date(s.createdAt).toLocaleString("vi-VN"),
    ]);
    const BOM = "\uFEFF";
    const csv = BOM + [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Tổng đăng ký", value: submissions.length, sub: "tất cả", icon: <Users className="w-5 h-5" />, color: "from-[#FF2D78] to-[#FF6B9D]" },
    { label: "Hôm nay", value: todayCount, sub: new Date().toLocaleDateString("vi-VN"), icon: <Calendar className="w-5 h-5" />, color: "from-blue-500 to-blue-600" },
    { label: "Tuần này", value: weekCount, sub: "7 ngày qua", icon: <CalendarDays className="w-5 h-5" />, color: "from-emerald-500 to-emerald-600" },
    { label: "Đã liên hệ", value: `${contactedCount}/${submissions.length}`, sub: submissions.length ? `${Math.round(contactedCount / submissions.length * 100)}%` : "0%", icon: <TrendingUp className="w-5 h-5" />, color: "from-purple-500 to-purple-600" },
  ];

  const dateFilters: { label: string; value: DateFilter }[] = [
    { label: "Tất cả", value: "all" }, { label: "Hôm nay", value: "today" },
    { label: "Tuần này", value: "week" }, { label: "Tháng này", value: "month" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-slate-400 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 space-y-4">
          {/* Top bar: title + search + export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Danh sách đăng ký</h2>
              <p className="text-slate-500 text-xs mt-1">{filtered.length} kết quả</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm theo tên, SĐT, email..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm placeholder-slate-400 focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10 transition" />
              </div>
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <Download className="w-3.5 h-3.5" /> Excel/CSV
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Thời gian:</span>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {dateFilters.map((f) => (
                  <button key={f.value} onClick={() => setDateFilter(f.value)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition ${dateFilter === f.value ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Trạng thái:</span>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {([["all", "Tất cả"], ["contacted", "Đã liên hệ"], ["not-contacted", "Chưa liên hệ"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setContactFilter(v)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition ${contactFilter === v ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#FF2D78] animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {search || dateFilter !== "all" || contactFilter !== "all" ? "Không tìm thấy kết quả" : "Chưa có đăng ký nào"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Họ tên</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Liên hệ</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Mục tiêu</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Trình độ</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider">Ngày</th>
                  <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-right w-16" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D78]/10 to-[#FF6B9D]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FF2D78] text-xs font-bold">{s.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-700 font-mono">{s.phone}</p>
                      {s.email && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />{s.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${goalColors[s.goal] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {goalLabels[s.goal] || s.goal || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {s.level ? (
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF2D78]/10 to-[#FF6B9D]/10 text-[#BE185D] text-xs font-bold border border-[#FF2D78]/20">
                          {s.level}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <button onClick={() => onUpdate(s.id, { contacted: !s.contacted })}
                          className={`flex items-center gap-1.5 text-xs font-medium rounded-md px-2 py-1 transition ${
                            s.contacted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-emerald-200"
                          }`}>
                          {s.contacted ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                          {s.contacted ? "Đã liên hệ" : "Chưa liên hệ"}
                        </button>
                        {editingNote === s.id ? (
                          <input autoFocus type="text" defaultValue={s.note || ""}
                            onBlur={(e) => { onUpdate(s.id, { note: e.target.value }); setEditingNote(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:border-[#FF2D78] focus:outline-none"
                            placeholder="Ghi chú..." />
                        ) : (
                          <button onClick={() => setEditingNote(s.id)}
                            className="text-xs text-slate-400 hover:text-slate-600 truncate max-w-[120px] block transition">
                            {s.note || "Thêm ghi chú..."}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      <div className="font-medium">{new Date(s.createdAt).toLocaleDateString("vi-VN")}</div>
                      <div className="text-slate-400">{new Date(s.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => onDelete(s.id, s.name)}
                        className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition" title="Xóa">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
