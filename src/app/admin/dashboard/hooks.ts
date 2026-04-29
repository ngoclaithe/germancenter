"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/types/site-content";

interface Submission {
  id: number;
  name: string;
  phone: string;
  goal: string;
  level: string;
  createdAt: string;
}

export function useAdminAuth() {
  const router = useRouter();

  const getToken = useCallback(() => {
    return localStorage.getItem("gc_admin_token");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gc_admin_token");
    router.push("/admin");
  }, [router]);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = getToken();
      if (!token) {
        router.push("/admin");
        return null;
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return null;
      }

      return res;
    },
    [getToken, router, logout]
  );

  return { getToken, logout, authFetch };
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { authFetch, logout } = useAdminAuth();

  const fetchSubmissions = useCallback(async () => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) {
      logout();
      return;
    }

    try {
      const res = await authFetch("/api/admin/submissions");
      if (!res) return;
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      console.error("Fetch submissions failed");
    } finally {
      setLoading(false);
    }
  }, [authFetch, logout]);

  const deleteSubmission = useCallback(
    async (id: number, name: string) => {
      if (!confirm(`Xóa đăng ký của "${name}"?`)) return;
      const token = localStorage.getItem("gc_admin_token");
      try {
        await fetch("/api/admin/submissions", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        });
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } catch {
        alert("Lỗi khi xóa");
      }
    },
    []
  );

  return { submissions, loading, fetchSubmissions, deleteSubmission };
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const { authFetch } = useAdminAuth();

  const fetchContent = useCallback(async () => {
    try {
      const res = await authFetch("/api/admin/content");
      if (!res) return;
      const data = await res.json();
      setContent(data.content ?? null);
      setHasChanges(false);
    } catch {
      setMessage("Không thể tải dữ liệu CMS.");
    } finally {
      setContentLoading(false);
    }
  }, [authFetch]);

  const updateContent = useCallback(
    (updater: (prev: SiteContent) => SiteContent) => {
      setContent((prev) => {
        if (!prev) return prev;
        setHasChanges(true);
        return updater(prev);
      });
    },
    []
  );

  const saveContent = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
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
      setMessage("✅ Đã cập nhật nội dung website thành công.");
      setHasChanges(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? `❌ ${error.message}` : "❌ Lỗi cập nhật CMS"
      );
    } finally {
      setSaving(false);
    }
  }, [content]);

  return {
    content,
    contentLoading,
    saving,
    message,
    hasChanges,
    setMessage,
    fetchContent,
    updateContent,
    saveContent,
  };
}

export function useMediaManager() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { authFetch } = useAdminAuth();

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/admin/media");
      if (!res) return;
      const data = await res.json();
      setFiles(data.files || []);
    } catch {
      setMessage("Không tải được thư viện ảnh.");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const uploadFile = useCallback(
    async (file: File) => {
      const token = localStorage.getItem("gc_admin_token");
      if (!token) return;
      setMessage("⏳ Đang upload & convert sang WebP...");

      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });

        // Handle Nginx errors (413, 502, etc.) that return HTML instead of JSON
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          if (res.status === 413) {
            throw new Error("File quá lớn. Nginx giới hạn upload — cần cập nhật nginx config trên server.");
          }
          throw new Error(`Server trả về lỗi ${res.status}. Kiểm tra nginx config.`);
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload thất bại");

        if (data.converted) {
          setMessage(
            `✅ ${data.path} — WebP: ${data.originalSize} → ${data.webpSize} (giảm ${data.savedPercent})`
          );
        } else {
          setMessage(`✅ Upload thành công: ${data.path}`);
        }
        fetchMedia();
      } catch (error) {
        setMessage(
          error instanceof Error ? `❌ ${error.message}` : "❌ Lỗi upload ảnh"
        );
      }
    },
    [fetchMedia]
  );

  return { files, loading, message, setMessage, fetchMedia, uploadFile };
}
