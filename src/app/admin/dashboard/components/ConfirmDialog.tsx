"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AlertTriangle, Trash2, LogOut, X } from "lucide-react";

interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: ReactNode;
}

interface DialogContextType {
  confirm: (config: DialogConfig) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function useConfirmDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useConfirmDialog must be inside DialogProvider");
  return ctx;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm = useCallback((config: DialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog(config);
      setResolver(() => resolve);
    });
  }, []);

  const close = (result: boolean) => {
    resolver?.(result);
    setDialog(null);
    setResolver(null);
  };

  const variantStyles = {
    danger: {
      icon: <Trash2 className="w-5 h-5" />,
      iconBg: "bg-red-100 text-red-600",
      btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: <LogOut className="w-5 h-5" />,
      iconBg: "bg-amber-100 text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: "bg-blue-100 text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const v = dialog?.variant || "danger";
  const style = variantStyles[v];

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in"
          onClick={() => close(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                {dialog.icon || style.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900">{dialog.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{dialog.message}</p>
              </div>
              <button
                onClick={() => close(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="px-6 pb-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => close(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {dialog.cancelText || "Huỷ"}
              </button>
              <button
                onClick={() => close(true)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.btn}`}
              >
                {dialog.confirmText || "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
