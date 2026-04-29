"use client";

import { CheckCircle2, XCircle, Loader2, Info } from "lucide-react";

type MessageType = "success" | "error" | "loading" | "info";

interface StatusMessageProps {
  message: string;
  className?: string;
}

function parseMessage(raw: string): { type: MessageType; text: string } {
  if (raw.startsWith("success:")) return { type: "success", text: raw.slice(8) };
  if (raw.startsWith("error:")) return { type: "error", text: raw.slice(6) };
  if (raw.startsWith("loading:")) return { type: "loading", text: raw.slice(8) };
  return { type: "info", text: raw };
}

const styles: Record<MessageType, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  error: "bg-red-50 text-red-600 border-red-200",
  loading: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-slate-50 text-slate-600 border-slate-200",
};

const icons: Record<MessageType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
  error: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  loading: <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />,
};

export function StatusMessage({ message, className = "" }: StatusMessageProps) {
  if (!message) return null;
  const { type, text } = parseMessage(message);

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${styles[type]} ${className}`}>
      {icons[type]}
      <span>{text}</span>
    </div>
  );
}
