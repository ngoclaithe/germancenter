"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, type TabId } from "./components/DashboardLayout";
import { LeadsTab } from "./components/LeadsTab";
import { ContentTab } from "./components/ContentTab";
import { MediaTab } from "./components/MediaTab";
import { useSubmissions, useSiteContent, useMediaManager } from "./hooks";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("leads");
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Custom hooks
  const { submissions, loading, fetchSubmissions, deleteSubmission } = useSubmissions();
  const { content, contentLoading, saving, message, hasChanges, fetchContent, updateContent, saveContent } = useSiteContent();
  const { files: mediaFiles, loading: mediaLoading, message: mediaMessage, fetchMedia, uploadFile } = useMediaManager();

  // Auth check + initial fetch
  useEffect(() => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    fetchSubmissions();
    fetchContent();
    fetchMedia();
  }, [router, fetchSubmissions, fetchContent, fetchMedia]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeTab === "content" && hasChanges) saveContent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, hasChanges, saveContent]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleLogout = useCallback(() => {
    if (hasChanges && !confirm("Bạn có thay đổi chưa lưu. Vẫn muốn đăng xuất?")) return;
    localStorage.removeItem("gc_admin_token");
    router.push("/admin");
  }, [hasChanges, router]);

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      hasUnsavedChanges={hasChanges}
    >
      {activeTab === "leads" && (
        <LeadsTab
          submissions={submissions}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onDelete={deleteSubmission}
        />
      )}

      {activeTab === "content" && content && (
        <ContentTab
          content={content}
          contentLoading={contentLoading}
          saving={saving}
          message={message}
          onUpdate={updateContent}
          onSave={saveContent}
        />
      )}

      {activeTab === "media" && (
        <MediaTab
          files={mediaFiles}
          loading={mediaLoading}
          message={mediaMessage}
          onUpload={uploadFile}
          onRefresh={fetchMedia}
        />
      )}
    </DashboardLayout>
  );
}
