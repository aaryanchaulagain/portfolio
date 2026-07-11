"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Mail, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type ToastState = {
  title: string;
  description?: string;
  variant?: "success" | "error";
} | null;

type ToastContextValue = {
  showToast: (toast: NonNullable<ToastState>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return context;
}

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const prefersReducedMotion = useReducedMotion();

  const showToast = useCallback((next: NonNullable<ToastState>) => {
    setToast(next);
    window.setTimeout(() => setToast(null), 6500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            className="fixed bottom-5 right-5 z-[80] w-[min(100vw-2rem,24rem)]"
          >
            <div
              className={`rounded-2xl border p-4 shadow-elevated backdrop-blur-xl ${
                toast.variant === "error"
                  ? "border-danger/30 bg-surface/95"
                  : "border-accent/30 bg-surface/95"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-xl p-2 ${
                    toast.variant === "error"
                      ? "bg-danger/15 text-danger"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  {toast.variant === "error" ? (
                    <X className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {toast.title}
                  </p>
                  {toast.description ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {toast.description}
                    </p>
                  ) : null}
                  {toast.variant !== "error" ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      Email notification triggered
                    </p>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Dismiss notification"
                  onClick={() => setToast(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
