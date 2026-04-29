"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, type TabId } from "./components/DashboardLayout";
import { LeadsTab } from "./components/LeadsTab";
import { ContentTab } from "./components/ContentTab";
import { MediaTab } from "./components/MediaTab";
import { DialogProvider, useConfirmDialog } from "./components/ConfirmDialog";
import { useSubmissions, useSiteContent, useMediaManager } from "./hooks";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>("leads");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { confirm } = useConfirmDialog();

  const { submissions, loading, fetchSubmissions, deleteSubmission, updateSubmission } = useSubmissions();
  const { content, contentLoading, saving, message, hasChanges, fetchContent, updateContent, saveContent } = useSiteContent();
  const { files: mediaFiles, loading: mediaLoading, message: mediaMessage, fetchMedia, uploadFile, deleteFile } = useMediaManager();

  useEffect(() => {
    const token = localStorage.getItem("gc_admin_token");
    if (!token) { router.push("/admin"); return; }
    fetchSubmissions();
    fetchContent();
    fetchMedia();
  }, [router, fetchSubmissions, fetchContent, fetchMedia]);

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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleLogout = useCallback(async () => {
    if (hasChanges) {
      const ok = await confirm({
        title: "Đăng xuất",
        message: "Bạn có thay đổi chưa lưu. Vẫn muốn đăng xuất?",
        confirmText: "Đăng xuất",
        variant: "warning",
      });
      if (!ok) return;
    }
    localStorage.removeItem("gc_admin_token");
    router.push("/admin");
  }, [hasChanges, router, confirm]);

  const handleDeleteSubmission = useCallback(async (id: number, name: string) => {
    const ok = await confirm({
      title: "Xóa đăng ký",
      message: `Bạn có chắc muốn xóa đăng ký của "${name}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      variant: "danger",
    });
    if (ok) deleteSubmission(id, name, true);
  }, [confirm, deleteSubmission]);

  const handleDeleteFile = useCallback(async (filePath: string) => {
    const filename = filePath.split("/").pop() || filePath;
    const ok = await confirm({
      title: "Xóa ảnh",
      message: `Bạn có chắc muốn xóa "${filename}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      variant: "danger",
    });
    if (ok) deleteFile(filePath, true);
  }, [confirm, deleteFile]);

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
          onDelete={handleDeleteSubmission}
          onUpdate={(id, updates) => updateSubmission(id, updates)}
          googleSheetUrl="https://docs.google.com/spreadsheets/d/1GkHmlIikN11bj3hYeJBZcd2PEw82tl7SAlYoV8UBTfo/edit?gid=0#gid=0"
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
          onDelete={handleDeleteFile}
        />
      )}
    </DashboardLayout>
  );
}

export default function AdminDashboard() {
  return (
    <DialogProvider>
      <DashboardContent />
    </DialogProvider>
  );
}
