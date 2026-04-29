import { useState, useCallback, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, Trash2, X } from "lucide-react";

/* ─── Themed Confirm Dialog ──────────────────────────────────────────────────
   Replaces native window.confirm() with a styled modal matching the app's
   design system. Called via: await confirmDialog({ ... })
────────────────────────────────────────────────────────────────────────────── */

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

function ConfirmDialogUI({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onResult,
}: ConfirmDialogOptions & { onResult: (confirmed: boolean) => void }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(
    (result: boolean) => {
      setExiting(true);
      setTimeout(() => onResult(result), 200);
    },
    [onResult]
  );

  const variantStyles = {
    danger: {
      iconBg: "rgba(239,68,68,0.10)",
      iconBorder: "rgba(239,68,68,0.20)",
      iconColor: "#ef4444",
      confirmBg: "#ef4444",
      confirmHoverBg: "#dc2626",
      confirmText: "#fff",
      Icon: Trash2,
    },
    warning: {
      iconBg: "rgba(245,158,11,0.10)",
      iconBorder: "rgba(245,158,11,0.20)",
      iconColor: "#f59e0b",
      confirmBg: "#f59e0b",
      confirmHoverBg: "#d97706",
      confirmText: "#000",
      Icon: AlertTriangle,
    },
    default: {
      iconBg: "rgba(204,255,0,0.08)",
      iconBorder: "rgba(204,255,0,0.20)",
      iconColor: "var(--theme-accent, #CCFF00)",
      confirmBg: "var(--theme-accent, #CCFF00)",
      confirmHoverBg: "var(--theme-accent, #CCFF00)",
      confirmText: "#000",
      Icon: AlertTriangle,
    },
  };

  const s = variantStyles[variant];
  const VIcon = s.Icon;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: exiting ? "transparent" : visible ? "rgba(0,0,0,0.6)" : "transparent",
        backdropFilter: visible && !exiting ? "blur(8px)" : "none",
        transition: "all 0.2s ease",
      }}
      onClick={() => close(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--theme-card, #121212)",
          border: "1px solid var(--theme-border, #27272a)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          transform: visible && !exiting ? "scale(1)" : "scale(0.95)",
          opacity: visible && !exiting ? 1 : 0,
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: s.iconBg,
            border: `1px solid ${s.iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <VIcon size={26} style={{ color: s.iconColor }} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--theme-foreground, #fff)",
            textAlign: "center",
            margin: "0 0 8px 0",
            lineHeight: 1.3,
          }}
        >
          {title || "Are you sure?"}
        </h3>

        {/* Message */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--theme-muted-foreground, #a1a1aa)",
            textAlign: "center",
            margin: "0 0 28px 0",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => close(false)}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "14px",
              border: "1px solid var(--theme-border, #27272a)",
              background: "var(--theme-muted, #27272a)",
              color: "var(--theme-foreground, #fff)",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--theme-border, #3f3f46)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--theme-muted, #27272a)";
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={() => close(true)}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "14px",
              border: "none",
              background: s.confirmBg,
              color: s.confirmText,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: variant === "danger"
                ? "0 4px 14px rgba(239,68,68,0.25)"
                : "0 4px 14px rgba(204,255,0,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Imperative API ─────────────────────────────────────────────────────────
   Usage:
     const ok = await confirmDialog({
       title: "Delete Club",
       message: "This cannot be undone.",
       confirmLabel: "Delete",
       variant: "danger",
     });
────────────────────────────────────────────────────────────────────────────── */

export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = (result: boolean) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    root.render(<ConfirmDialogUI {...options} onResult={cleanup} />);
  });
}
