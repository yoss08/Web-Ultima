import { CheckCircle, AlertCircle, Wrench, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

type CourtStatus = "available" | "occupied" | "maintenance";

interface CourtCardProps {
  court: {
    id: string | number;
    name: string;
    status: CourtStatus;
    type?: string;
    surface?: string;
    current_match?: string;
    next_booking?: string;
    players?: string[];
    pricing_peak?: number;
    capacity?: number;
    club_id?: string | number;
  };
  onToggleMaintenance?: (id: string | number, currentStatus: CourtStatus) => void;
  onDelete?: (id: string | number) => void;
  showActions?: boolean;
  index?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const statusConfig = {
  available: {
    border: "border-accent/30 hover:border-accent/60",
    glow: "shadow-[0_0_24px_var(--theme-accent-glow)]",
    badge: "bg-accent/10 text-accent border border-accent/30",
    iconBg: "bg-accent/10",
    icon: CheckCircle,
    iconColor: "text-accent",
    label: "AVAILABLE",
    dot: "bg-accent",
  },
  "occupied": {
    border: "border-border hover:border-muted-foreground/30",
    glow: "shadow-none",
    badge: "bg-muted text-muted-foreground border border-border",
    iconBg: "bg-muted",
    icon: AlertCircle,
    iconColor: "text-muted-foreground",
    label: "OCCUPIED",
    dot: "bg-muted-foreground",
  },
  maintenance: {
    border: "border-rose-500/30 hover:border-rose-500/60",
    glow: "shadow-[0_0_24px_rgba(244,63,94,0.1)]",
    badge: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    iconBg: "bg-rose-500/10",
    icon: Wrench,
    iconColor: "text-rose-400",
    label: "MAINTENANCE",
    dot: "bg-rose-400",
  },
};

export function CourtCard({ court, onToggleMaintenance, onDelete, showActions = false, index = 0, onClick, isSelected = false }: CourtCardProps) {
  const config = statusConfig[court.status] || statusConfig.available;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className={`
        bg-card border-2 rounded-[32px] p-6
        ${isSelected ? 'border-accent ring-4 ring-accent/20 scale-[0.98]' : config.border}
        ${config.glow} transition-all duration-300
        ${!isSelected ? 'hover:scale-[1.02]' : ''} hover:brightness-105 group relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Subtle glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-[32px]" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative font-['Poppins']">
        <div>
          <h3 className="text-foreground font-black text-xl leading-tight font-['Playfair_Display']">{court.name}</h3>
          {(court.type || court.surface) && (
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mt-1">
              {[court.type, court.surface].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSelected && (
            <div className="bg-accent text-accent-foreground p-1.5 rounded-full ring-4 ring-accent/20 animate-in zoom-in duration-300 shadow-lg shadow-accent/20">
              <CheckCircle size={14} />
            </div>
          )}
          <div className={`p-2 rounded-xl ${config.iconBg} shadow-inner`}>
            <Icon size={20} className={config.iconColor} />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black tracking-[1px] ${config.badge} font-['Poppins']`}>
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${config.dot}`}
          />
          {config.label}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-3 text-sm relative font-['Poppins']">
        {court.status === "occupied" && court.current_match && (
          <div className="flex items-start gap-2 text-muted-foreground bg-muted/50 p-2 rounded-lg border border-border">
            <User size={14} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium leading-tight">{court.current_match}</span>
          </div>
        )}
        {court.status === "occupied" && court.next_booking && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={13} className="flex-shrink-0 text-accent/60" />
            <span className="text-[10px] font-bold">Next: {court.next_booking}</span>
          </div>
        )}
        {court.status === "available" && (
          <p className="text-muted-foreground text-xs italic opacity-60">Ready for booking</p>
        )}
        {court.status === "maintenance" && (
          <p className="text-rose-400/80 text-xs font-semibold">Scheduled maintenance in progress</p>
        )}
      </div>

      {/* Actions (Admin only) */}
      {showActions && (
        <div className="mt-6 pt-5 border-t border-border flex gap-3 relative z-10 font-['Poppins']">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaintenance?.(court.id, court.status);
            }}
            className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all shadow-md ${
              court.status === "maintenance"
                ? "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
                : "bg-muted text-muted-foreground border border-border hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
            }`}
          >
            {court.status === "maintenance" ? "End Maintenance" : "Set Maintenance"}
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(court.id);
              }}
              className="px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-xs font-black shadow-md"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
