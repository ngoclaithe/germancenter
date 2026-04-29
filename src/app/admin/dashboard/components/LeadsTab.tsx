"use client";

import {
  Users,
  Calendar,
  CalendarDays,
  TrendingUp,
  Search,
  Trash2,
  Inbox,
  Loader2,
} from "lucide-react";

interface Submission {
  id: number;
  name: string;
  phone: string;
  goal: string;
  level: string;
  createdAt: string;
}

interface LeadsTabProps {
  submissions: Submission[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onDelete: (id: number, name: string) => void;
}

const goalLabels: Record<string, string> = {
  study: "Du học Đức",
  work: "Làm việc tại Đức",
  ausbildung: "Ausbildung",
  migration: "Di cư",
  personal: "Phát triển bản thân",
  other: "Khác",
};

const goalColors: Record<string, string> = {
  study: "bg-blue-500/10 text-blue-600 border-blue-200",
  work: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  ausbildung: "bg-purple-500/10 text-purple-600 border-purple-200",
  migration: "bg-amber-500/10 text-amber-600 border-amber-200",
  personal: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  other: "bg-slate-500/10 text-slate-500 border-slate-200",
};

export function LeadsTab({
  submissions,
  loading,
  search,
  onSearchChange,
  onDelete,
}: LeadsTabProps) {
  const todayCount = submissions.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const weekCount = submissions.filter((s) => {
    const d = new Date(s.createdAt);
    return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }).length;

  const studyPercentage = submissions.length
    ? Math.round(
        (submissions.filter((s) => s.goal === "study").length /
          submissions.length) *
          100
      )
    : 0;

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const stats = [
    {
      label: "Tổng đăng ký",
      value: submissions.length,
      sub: "tất cả",
      icon: <Users className="w-5 h-5" />,
      color: "from-[#FF2D78] to-[#FF6B9D]",
    },
    {
      label: "Hôm nay",
      value: todayCount,
      sub: new Date().toLocaleDateString("vi-VN"),
      icon: <Calendar className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Tuần này",
      value: weekCount,
      sub: "7 ngày qua",
      icon: <CalendarDays className="w-5 h-5" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Tỷ lệ Du học",
      value: `${studyPercentage}%`,
      sub: "mục tiêu phổ biến",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}
              >
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
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Danh sách đăng ký</h2>
            <p className="text-slate-500 text-xs mt-1">{filtered.length} kết quả</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên hoặc SĐT..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10 transition-all"
            />
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
              {search ? "Không tìm thấy kết quả" : "Chưa có đăng ký nào"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    SĐT
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    Mục tiêu
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    Trình độ
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3.5 font-medium text-xs uppercase tracking-wider text-right" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D78]/10 to-[#FF6B9D]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FF2D78] text-xs font-bold">
                            {s.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                      {s.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          goalColors[s.goal] || "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {goalLabels[s.goal] || s.goal || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.level ? (
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FF2D78]/10 to-[#FF6B9D]/10 text-[#BE185D] text-xs font-bold border border-[#FF2D78]/20">
                          {s.level}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      <div className="font-medium">
                        {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-slate-400">
                        {new Date(s.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDelete(s.id, s.name)}
                        className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
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
