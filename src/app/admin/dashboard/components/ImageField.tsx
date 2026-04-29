"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

import { StatusMessage } from "./StatusMessage";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState("");

  const handleUpload = async (file: File) => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) return;

    setUploading(true);
    setUploadInfo("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      // Handle Nginx errors (413, 502) that return HTML instead of JSON
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(res.status === 413 ? "File quá lớn" : `Lỗi server ${res.status}`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload thất bại");

      // Auto-fill the path
      onChange(data.path);

      if (data.converted) {
        setUploadInfo(`success:WebP: ${data.originalSize} → ${data.webpSize} (giảm ${data.savedPercent})`);
      } else {
        setUploadInfo("success:Upload thành công");
      }
    } catch (error) {
      setUploadInfo(error instanceof Error ? `error:${error.message}` : "error:Lỗi upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/uploads/..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm pr-8 focus:border-[#FF2D78] focus:outline-none focus:ring-2 focus:ring-[#FF2D78]/10"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-red-500 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-[#FF2D78]/30 hover:text-[#FF2D78] disabled:opacity-50 transition-all whitespace-nowrap"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Đang tải..." : "Tải lên"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Preview + info */}
      <div className="flex items-start gap-3 mt-2">
        {value && (
          <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        {uploadInfo && <StatusMessage message={uploadInfo} className="text-xs py-1.5 px-2.5" />}
      </div>
    </div>
  );
}
