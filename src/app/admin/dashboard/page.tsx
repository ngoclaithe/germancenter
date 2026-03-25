"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();

  const fetchData = useCallback(async () => {
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

  useEffect(() => { fetchData(); }, [fetchData]);

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

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center">
              <span className="text-white text-sm font-black">GC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">German Center</h1>
              <p className="text-white/30 text-xs">CMS Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Trang chủ
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/20 transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tổng đăng ký", value: submissions.length, color: "from-[#FF2D78] to-[#FF6B9D]", sub: "tất cả" },
            { label: "Hôm nay", value: todayCount, color: "from-blue-500 to-blue-400", sub: new Date().toLocaleDateString("vi-VN") },
            { label: "Tuần này", value: weekCount, color: "from-green-500 to-green-400", sub: "7 ngày qua" },
            { label: "Tỷ lệ Du học", value: submissions.length ? Math.round((submissions.filter((s) => s.goal === "study").length / submissions.length) * 100) + "%" : "0%", color: "from-purple-500 to-purple-400", sub: "mục tiêu phổ biến" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">{stat.label}</p>
              <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-white/20 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Search & Table */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Danh sách đăng ký</h2>
              <p className="text-white/30 text-xs mt-1">{filtered.length} kết quả</p>
            </div>
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc SĐT..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:border-[#FF2D78]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2D78]/20 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-white/10 border-t-[#FF2D78] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/30 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">
                {search ? "Không tìm thấy kết quả" : "Chưa có đăng ký nào"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/30 border-b border-white/5">
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
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-white/20 font-mono text-xs">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D78]/20 to-[#FF6B9D]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#FF6B9D] text-xs font-bold">{s.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 font-mono">{s.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${goalColors[s.goal] || "bg-white/10 text-white/50"}`}>
                          {goalLabels[s.goal] || s.goal || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {s.level ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#FF2D78]/10 text-[#FF6B9D] text-xs font-bold">
                            {s.level}
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/40 text-xs">
                        <div>{new Date(s.createdAt).toLocaleDateString("vi-VN")}</div>
                        <div className="text-white/20">{new Date(s.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/60 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 transition-all"
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

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-white/15 text-xs">
          <p>Dữ liệu lưu tại: data/submissions.json</p>
          <p>German Center CMS v1.0</p>
        </div>
      </div>
    </main>
  );
}
