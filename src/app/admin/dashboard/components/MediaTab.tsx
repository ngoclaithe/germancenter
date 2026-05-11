"use client";

import { useState, useRef } from "react";
import { StatusMessage } from "./StatusMessage";
import {
  Plus,
  RefreshCw,
  Copy,
  ExternalLink,
  ImageIcon,
  Trash2,
  X,
  Upload,
  Loader2,
  Check,
  Grid3X3,
  LayoutList,
} from "lucide-react";

interface MediaTabProps {
  files: string[];
  loading: boolean;
  message: string;
  onUpload: (file: File) => void;
  onRefresh: () => void;
  onDelete: (filePath: string) => void;
}

export function MediaTab({
  files,
  loading,
  message,
  onUpload,
  onRefresh,
  onDelete,
}: MediaTabProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  };

  const handleDelete = (filePath: string) => {
    onDelete(filePath);
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Thư viện ảnh</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {files.length} file · Ảnh tự động convert sang WebP khi upload
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-[#55B6F6] to-[#6EC2F7] text-white font-semibold hover:shadow-lg hover:shadow-[#55B6F6]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Status message */}
      {message && <StatusMessage message={message} />}

      {/* Gallery */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-[#55B6F6] animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Đang tải ảnh...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Chưa có ảnh nào</p>
            <p className="text-xs text-slate-400 mt-1">Bấm Upload để thêm ảnh</p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-slate-200">
            {files.map((filePath) => {
              const filename = filePath.split("/").pop() || filePath;
              return (
                <div key={filePath} className="group relative bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePath}
                    alt={filename}
                    className="w-full aspect-square object-cover bg-slate-100"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={() => copyPath(filePath)}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition font-medium"
                    >
                      {copiedPath === filePath ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedPath === filePath ? "Đã copy!" : "Copy path"}
                    </button>
                    <div className="flex gap-1.5 w-full">
                      <a
                        href={filePath}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] rounded-lg bg-white/20 text-white hover:bg-white/30 transition font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Xem
                      </a>
                      <button
                        onClick={() => handleDelete(filePath)}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Filename strip */}
                  <div className="px-2 py-1.5">
                    <p className="text-[10px] text-slate-500 truncate font-mono" title={filePath}>
                      {filename}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
                <th className="px-4 py-3 font-medium text-xs w-16">Ảnh</th>
                <th className="px-4 py-3 font-medium text-xs">Tên file</th>
                <th className="px-4 py-3 font-medium text-xs text-right w-40">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {files.map((filePath) => {
                const filename = filePath.split("/").pop() || filePath;
                return (
                  <tr key={filePath} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={filePath} alt={filename} className="w-10 h-10 rounded-lg object-cover bg-slate-100" loading="lazy" />
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-xs text-slate-700 font-mono truncate max-w-md" title={filePath}>{filePath}</p>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => copyPath(filePath)} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition" title="Copy path">
                          {copiedPath === filePath ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        </button>
                        <a href={filePath} target="_blank" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition" title="Xem gốc">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </a>
                        <button onClick={() => handleDelete(filePath)} className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition" title="Xóa">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center text-white">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Upload ảnh</h3>
                  <p className="text-xs text-slate-500">Tự động convert sang WebP</p>
                </div>
              </div>
              <button onClick={() => setShowUpload(false)} className="p-2 rounded-lg hover:bg-slate-100 transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#55B6F6]/40 hover:bg-[#55B6F6]/5 transition-all group">
              <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-[#55B6F6]/50 transition-colors mb-3" />
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-[#55B6F6]">Chọn file</span> hoặc kéo thả
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP (tối đa 10MB)</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(file);
                    setShowUpload(false);
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
