"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export type TabId = "leads" | "content" | "media";

interface Tab {
  id: TabId;
  label: string;
  icon: ReactNode;
}

const tabs: Tab[] = [
  { id: "leads", label: "Leads", icon: <Users className="w-4 h-4" /> },
  { id: "content", label: "Content CMS", icon: <FileText className="w-4 h-4" /> },
  { id: "media", label: "Quản lý ảnh", icon: <ImageIcon className="w-4 h-4" /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onLogout: () => void;
  hasUnsavedChanges?: boolean;
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  onLogout,
  hasUnsavedChanges,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="w-[260px] border-r border-slate-200 bg-white hidden lg:flex flex-col">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#FF2D78]/20">
                LG
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">Lingua German</h1>
                <p className="text-slate-400 text-[11px]">CMS Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Quản lý
            </p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white shadow-lg shadow-[#FF2D78]/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 pb-4 space-y-1 border-t border-slate-100 pt-3">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Xem trang chủ
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              {/* Mobile Tab Buttons */}
              <div className="lg:hidden flex items-center gap-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white shadow-md"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Desktop breadcrumb */}
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Dashboard</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="font-medium text-slate-700">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </span>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Chưa lưu
                  </span>
                )}
                <Link
                  href="/"
                  target="_blank"
                  className="lg:hidden px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={onLogout}
                  className="lg:hidden px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</div>

          {/* Footer */}
          <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <p>Dữ liệu lưu tại `data/`</p>
              <p>Lingua German CMS v2.0</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
