import { useEffect, useState } from "react";
import { useToaster, toast as hotToast } from "react-hot-toast";
import { CheckCircle2, XCircle, Info, X, Loader2 } from "lucide-react";

/* ─── Variant Config ─────────────────────────────────────────────────────── */

type Variant = "success" | "error" | "loading" | "info";

const variantConfig = {
  success: {
    icon: CheckCircle2,
    accentColor: "var(--theme-accent, #CCFF00)",
    bgGlow: "rgba(204,255,0,0.06)",
    borderColor: "rgba(204,255,0,0.20)",
  },
  error: {
    icon: XCircle,
    accentColor: "#ef4444",
    bgGlow: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.20)",
  },
  loading: {
    icon: Loader2,
    accentColor: "var(--theme-accent, #CCFF00)",
    bgGlow: "rgba(204,255,0,0.04)",
    borderColor: "rgba(204,255,0,0.12)",
  },
  info: {
    icon: Info,
    accentColor: "#60a5fa",
    bgGlow: "rgba(96,165,250,0.06)",
    borderColor: "rgba(96,165,250,0.20)",
  },
};

/* ─── Single toast card ──────────────────────────────────────────────────── */

function ToastCard({
  id,
  variant,
  message,
  visible,
  duration,
}: {
  id: string;
  variant: Variant;
  message: string;
  visible: boolean;
  duration: number;
}) {
  const [progress, setProgress] = useState(100);
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (variant === "loading" || !duration || duration === Infinity) return;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, duration]);

  return (
    <div
      style={{
        maxWidth: "400px",
        width: "100%",
        pointerEvents: "auto",
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: "var(--theme-card, #121212)",
          border: `1px solid ${config.borderColor}`,
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          boxShadow: `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${config.borderColor}, inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: `linear-gradient(180deg, ${config.bgGlow} 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Content row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 18px",
            position: "relative",
          }}
        >
          {/* Icon pill */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: config.bgGlow,
              border: `1px solid ${config.borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              size={20}
              style={{ color: config.accentColor }}
              className={variant === "loading" ? "animate-spin" : ""}
            />
          </div>

          {/* Text */}
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--theme-foreground, #fff)",
              margin: 0,
              lineHeight: 1.4,
              flex: 1,
              minWidth: 0,
            }}
          >
            {message}
          </p>

          {/* Close */}
          {variant !== "loading" && (
            <button
              onClick={() => hotToast.dismiss(id)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                border: "none",
                background: "var(--theme-muted, #27272a)",
                color: "var(--theme-muted-foreground, #a1a1aa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--theme-border, #3f3f46)";
                e.currentTarget.style.color = "var(--theme-foreground, #fff)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--theme-muted, #27272a)";
                e.currentTarget.style.color = "var(--theme-muted-foreground, #a1a1aa)";
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {variant !== "loading" && (
          <div
            style={{
              height: "2px",
              background: "var(--theme-muted, #27272a)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: config.accentColor,
                transition: "width 0.05s linear",
                borderRadius: "2px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ToastProvider ───────────────────────────────────────────────────────────
   Drop into App.tsx instead of <Toaster/>.
   Intercepts ALL toast.success / toast.error / toast.loading calls and
   renders them with the custom design. No call-site changes needed.
────────────────────────────────────────────────────────────────────────────── */

export function ToastProvider() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  const getVariant = (t: any): Variant => {
    if (t.type === "success") return "success";
    if (t.type === "error") return "error";
    if (t.type === "loading") return "loading";
    return "info";
  };

  const getMessage = (t: any): string => {
    if (typeof t.message === "string") return t.message;
    if (typeof t.message === "function") return "Notification";
    return String(t.message ?? "Notification");
  };

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className="fixed z-[99998] flex flex-col-reverse items-end sm:items-end w-full sm:w-auto px-4 sm:px-0"
      style={{
        bottom: "24px",
        right: "0",
        left: "0",
        margin: "0 auto",
        pointerEvents: "none",
        maxWidth: "100%",
      }}
    >
      <div className="flex flex-col-reverse items-center sm:items-end w-full sm:w-auto sm:pr-6 sm:pb-0">
        {toasts
          .filter((t) => t.visible || t.id)
          .slice(0, 5)
          .map((t) => (
            <ToastCard
              key={t.id}
              id={t.id}
              variant={getVariant(t)}
              message={getMessage(t)}
              visible={t.visible}
              duration={t.duration ?? 3500}
            />
          ))}
      </div>
    </div>
  );
}
