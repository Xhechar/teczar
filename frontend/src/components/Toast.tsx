import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = persist
}

interface ToastContextValue {
  show: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Config per type ──────────────────────────────────────────────
const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: React.ElementType;
    bar: string;
    bg: string;
    title: string;
    iconCls: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bar: "bg-emerald-500",
    bg: "bg-white border-l-4 border-emerald-500",
    title: "text-emerald-800",
    iconCls: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    bar: "bg-red-500",
    bg: "bg-white border-l-4 border-red-500",
    title: "text-red-800",
    iconCls: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-500",
    bg: "bg-white border-l-4 border-amber-500",
    title: "text-amber-800",
    iconCls: "text-amber-500",
  },
  info: {
    icon: Info,
    bar: "bg-primary-500",
    bg: "bg-white border-l-4 border-primary-500",
    title: "text-primary-800",
    iconCls: "text-primary-500",
  },
};

// ─── Single Toast Item ────────────────────────────────────────────
const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = TOAST_CONFIG[toast.type];
  const Icon = cfg.icon;
  const duration = toast.duration ?? 4500;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 320);
  }, [toast.id, onDismiss]);

  // Mount animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [duration, dismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        w-full shadow-lg transition-all duration-300 ease-out
        ${cfg.bg}
        ${
          visible && !leaving
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
      `}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className={`h-0.5 w-full ${cfg.bar} opacity-30`}>
          <div
            className={`h-full ${cfg.bar}`}
            style={{
              animation: `toastProgress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex items-center gap-4 px-5 py-4 max-w-screen-xl mx-auto">
        <div className={`shrink-0 ${cfg.iconCls}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${cfg.title}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// ─── Toast Container ──────────────────────────────────────────────
const ToastContainer: React.FC<{
  toasts: Toast[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999] flex flex-col"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts: Omit<Toast, "id">) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [{ id, ...opts }, ...prev].slice(0, 4)); // max 4 at once
  }, []);

  const success = useCallback(
    (title: string, message?: string) =>
      show({ type: "success", title, message }),
    [show],
  );
  const error = useCallback(
    (title: string, message?: string) =>
      show({ type: "error", title, message, duration: 6000 }),
    [show],
  );
  const warning = useCallback(
    (title: string, message?: string) =>
      show({ type: "warning", title, message }),
    [show],
  );
  const info = useCallback(
    (title: string, message?: string) => show({ type: "info", title, message }),
    [show],
  );

  return (
    <ToastContext.Provider
      value={{ show, success, error, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};

/**
 * Helper: call after any service action.
 * Reads ServiceResult<T> and fires the appropriate toast.
 */
export function toastResult<T>(
  result: any,
  toast: ToastContextValue,
  opts?: { successMsg?: string; errorMsg?: string },
) {
  if (result.Success) {
    toast.success(result.Title, opts?.successMsg ?? result.SuccessMessage);
  } else {
    toast.error(
      result?.response?.data?.Title,
        result?.response?.data?.ErrorMessage ??
      opts?.errorMsg ??
        "Something went wrong.",
    );
  }
}
