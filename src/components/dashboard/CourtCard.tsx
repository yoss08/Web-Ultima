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
    border: "border-green-500/30 dark:border-[#39FF14]/60 hover:border-green-500/50 dark:hover:border-[#39FF14]/80",
    glow: "shadow-[0_0_24px_rgba(34,197,94,0.05)] dark:shadow-[0_0_24px_rgba(57,255,20,0.15)]",
    badge: "bg-green-500/10 dark:bg-[#39FF14]/20 text-green-600 dark:text-[#39FF14] border border-green-500/30 dark:border-[#39FF14]/40",
    iconBg: "bg-green-500/10 dark:bg-[#39FF14]/15",
    icon: CheckCircle,
    iconColor: "text-green-500 dark:text-[#39FF14]",
    label: "AVAILABLE",
    dot: "bg-green-500 dark:bg-[#39FF14]",
  },
  "occupied": {
    border: "border-blue-500/30 dark:border-[#00E5FF]/60 hover:border-blue-500/50 dark:hover:border-[#00E5FF]/80",
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.05)] dark:shadow-[0_0_24px_rgba(0,229,255,0.15)]",
    badge: "bg-blue-500/10 dark:bg-[#00E5FF]/20 text-blue-600 dark:text-[#00E5FF] border border-blue-500/30 dark:border-[#00E5FF]/40",
    iconBg: "bg-blue-500/10 dark:bg-[#00E5FF]/15",
    icon: AlertCircle,
    iconColor: "text-blue-500 dark:text-[#00E5FF]",
    label: "IN USE",
    dot: "bg-blue-500 dark:bg-[#00E5FF]",
  },
  maintenance: {
    border: "border-orange-500/30 dark:border-orange-500/60 hover:border-orange-500/50 dark:hover:border-orange-500/80",
    glow: "shadow-[0_0_24px_rgba(249,115,22,0.05)] dark:shadow-[0_0_24px_rgba(249,115,22,0.15)]",
    badge: "bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 dark:border-orange-500/40",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/15",
    icon: Wrench,
    iconColor: "text-orange-500 dark:text-orange-400",
    label: "MAINTENANCE",
    dot: "bg-orange-500 dark:bg-orange-400",
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
        bg-white dark:bg-[#0d1117] border-2 rounded-2xl p-5
        ${isSelected ? 'border-blue-500 dark:border-[#00E5FF] ring-4 ring-blue-500/20 dark:ring-[#00E5FF]/20 scale-[0.98]' : config.border}
        ${config.glow} transition-all duration-300
        ${!isSelected ? 'hover:scale-[1.02]' : ''} hover:brightness-105 group relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">{court.name}</h3>
          {(court.type || court.surface) && (
            <p className="text-gray-500 text-xs mt-0.5">{[court.type, court.surface].filter(Boolean).join(' · ')}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSelected && (
            <div className="bg-blue-500 dark:bg-[#00E5FF] text-white dark:text-black p-1.5 rounded-full ring-4 ring-blue-500/20 dark:ring-[#00E5FF]/20 animate-in zoom-in duration-300 shadow-md">
              <CheckCircle size={14} />
            </div>
          )}
          <div className={`p-2 rounded-xl ${config.iconBg}`}>
            <Icon size={20} className={config.iconColor} />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${config.badge}`}>
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`}
          />
          {config.label}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm relative">
        {court.status === "occupied" && court.current_match && (
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <User size={13} className="mt-0.5 flex-shrink-0 text-blue-500 dark:text-[#00E5FF]" />
            <span className="text-xs leading-tight">{court.current_match}</span>
          </div>
        )}
        {court.status === "occupied" && court.next_booking && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500">
            <Clock size={13} className="flex-shrink-0" />
            <span className="text-xs">Next: {court.next_booking}</span>
          </div>
        )}
        {court.status === "available" && (
          <p className="text-gray-600 dark:text-gray-500 text-xs">Ready for booking</p>
        )}
        {court.status === "maintenance" && (
          <p className="text-gray-600 dark:text-gray-500 text-xs">Scheduled maintenance in progress</p>
        )}
      </div>

      {/* Actions (Admin only) */}
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex gap-2 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaintenance?.(court.id, court.status);
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
              court.status === "maintenance"
                ? "bg-green-500/10 dark:bg-[#39FF14]/20 text-green-600 dark:text-[#39FF14] hover:bg-green-500/20 dark:hover:bg-[#39FF14]/30"
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400"
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
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
