"use client";

import { Upload, RefreshCw, Copy, ExternalLink, ImageIcon } from "lucide-react";

interface MediaTabProps {
  files: string[];
  loading: boolean;
  message: string;
  onUpload: (file: File) => void;
  onRefresh: () => void;
  setMessage?: (msg: string) => void;
}

export function MediaTab({
  files,
  loading,
  message,
  onUpload,
  onRefresh,
}: MediaTabProps) {
  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload ảnh</h2>
            <p className="text-xs text-slate-500">
              Ảnh sẽ lưu ở <code className="px-1 py-0.5 rounded bg-slate-100 text-xs">public/images/uploads</code>
            </p>
          </div>
        </div>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#FF2D78]/40 hover:bg-[#FF2D78]/3 transition-all group">
          <div className="flex flex-col items-center justify-center pt-2 pb-3">
            <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-[#FF2D78]/50 transition-colors mb-2" />
            <p className="text-sm text-slate-500 group-hover:text-slate-700">
              <span className="font-semibold text-[#FF2D78]">Chọn file</span> hoặc kéo thả vào đây
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP (tối đa 5MB)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
            className="hidden"
          />
        </label>

        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : message.startsWith("❌")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Thư viện ảnh</h2>
            <p className="text-xs text-slate-500 mt-0.5">{files.length} file</p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#FF2D78] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Đang tải ảnh...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Chưa có ảnh upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((filePath) => {
              const filename = filePath.split("/").pop() || filePath;
              return (
                <div
                  key={filePath}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePath}
                    alt={filename}
                    className="w-full h-36 object-cover bg-slate-100"
                    loading="lazy"
                  />

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(filePath)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      Copy path
                    </button>
                    <a
                      href={filePath}
                      target="_blank"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/20 text-white hover:bg-white/30 transition font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Xem gốc
                    </a>
                  </div>

                  {/* Filename */}
                  <div className="px-2.5 py-2 bg-white">
                    <p className="text-[11px] text-slate-500 truncate font-mono" title={filePath}>
                      {filename}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
