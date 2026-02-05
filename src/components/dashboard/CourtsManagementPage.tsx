import { motion } from "motion/react";
import { CheckCircle, AlertCircle, Wrench, Plus } from "lucide-react";
import { useState } from "react";

type CourtStatus = "available" | "in-use" | "maintenance";

interface Court {
  id: number;
  name: string;
  status: CourtStatus;
  currentMatch?: string;
  nextAvailable?: string;
}

const courtsData: Court[] = [
  {
    id: 1,
    name: "Court 1",
    status: "in-use",
    currentMatch: "Rodriguez / Silva vs. Martinez / Lopez",
    nextAvailable: "3:30 PM",
  },
  {
    id: 2,
    name: "Court 2",
    status: "in-use",
    currentMatch: "Johnson / Smith vs. Williams / Jones",
    nextAvailable: "4:00 PM",
  },
  {
    id: 3,
    name: "Court 3",
    status: "in-use",
    currentMatch: "Anderson / White vs. Taylor / Brown",
    nextAvailable: "3:45 PM",
  },
  { id: 4, name: "Court 4", status: "available" },
  {
    id: 5,
    name: "Court 5",
    status: "in-use",
    currentMatch: "Garcia / Perez vs. Wilson / Davis",
    nextAvailable: "4:15 PM",
  },
  { id: 6, name: "Court 6", status: "available" },
  {
    id: 7,
    name: "Court 7",
    status: "in-use",
    currentMatch: "Miller / Moore vs. Jackson / Martin",
    nextAvailable: "3:20 PM",
  },
  {
    id: 8,
    name: "Court 8",
    status: "in-use",
    currentMatch: "Thompson / Harris vs. Clark / Lewis",
    nextAvailable: "4:30 PM",
  },
  { id: 9, name: "Court 9", status: "available" },
  { id: 10, name: "Court 10", status: "maintenance" },
  { id: 11, name: "Court 11", status: "available" },
  { id: 12, name: "Court 12", status: "maintenance" },
];

export function CourtsManagementPage() {
  const [courts] = useState(courtsData);

  const statusCounts = {
    available: courts.filter((c) => c.status === "available").length,
    inUse: courts.filter((c) => c.status === "in-use").length,
    maintenance: courts.filter((c) => c.status === "maintenance").length,
  };

  const getStatusConfig = (status: CourtStatus) => {
    switch (status) {
      case "available":
        return {
          icon: CheckCircle,
          color: "#39FF14",
          bg: "bg-[#39FF14]/10",
          border: "border-[#39FF14]",
          text: "text-[#39FF14]",
          label: "Available",
        };
      case "in-use":
        return {
          icon: AlertCircle,
          color: "#00E5FF",
          bg: "bg-[#00E5FF]/10",
          border: "border-[#00E5FF]",
          text: "text-[#00E5FF]",
          label: "In Use",
        };
      case "maintenance":
        return {
          icon: Wrench,
          color: "#FF6B00",
          bg: "bg-[#FF6B00]/10",
          border: "border-[#FF6B00]",
          text: "text-[#FF6B00]",
          label: "Maintenance",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-['Playfair_Display',serif] font-bold text-[36px] lg:text-[42px] text-white dark:text-[#0A0E1A] mb-2"
            style={{ fontVariationSettings: "'opsz' 12, 'wdth' 100" }}
          >
            Courts Management
          </h1>
          <p className="font-['Poppins',sans-serif] text-[16px] text-white/60 dark:text-[#0A0E1A]/60">
            Monitor and manage all courts in your facility
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 h-12 bg-[#39FF14] hover:bg-[#32E012] rounded-[12px] shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all font-['Poppins',sans-serif] text-[14px] font-semibold text-black">
          <Plus className="w-5 h-5" />
          Schedule Match
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[10px] bg-[#39FF14]/10 border border-[#39FF14] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#39FF14]" />
            </div>
            <h3 className="font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-[#0A0E1A]">
              Available
            </h3>
          </div>
          <p className="font-['Poppins',sans-serif] font-bold text-[32px] text-white dark:text-[#0A0E1A]">
            {statusCounts.available}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[10px] bg-[#00E5FF]/10 border border-[#00E5FF] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <h3 className="font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-[#0A0E1A]">
              In Use
            </h3>
          </div>
          <p className="font-['Poppins',sans-serif] font-bold text-[32px] text-white dark:text-[#0A0E1A]">
            {statusCounts.inUse}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/80 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-[#0A0E1A]/10 rounded-[20px] p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[10px] bg-[#FF6B00]/10 border border-[#FF6B00] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <h3 className="font-['Poppins',sans-serif] font-semibold text-[16px] text-white dark:text-[#0A0E1A]">
              Maintenance
            </h3>
          </div>
          <p className="font-['Poppins',sans-serif] font-bold text-[32px] text-white dark:text-[#0A0E1A]">
            {statusCounts.maintenance}
          </p>
        </motion.div>
      </div>

      {/* Courts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courts.map((court, index) => {
          const statusConfig = getStatusConfig(court.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={court.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-black/80 dark:bg-white/90 backdrop-blur-xl border ${statusConfig.border} rounded-[20px] p-6 hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              {/* Court Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-white dark:text-[#0A0E1A]">
                  {court.name}
                </h3>
                <div
                  className={`w-10 h-10 rounded-[10px] ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center`}
                >
                  <StatusIcon
                    className="w-5 h-5"
                    style={{ color: statusConfig.color }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 ${statusConfig.bg} border ${statusConfig.border} rounded-full mb-4`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    court.status === "in-use" ? "animate-pulse" : ""
                  }`}
                  style={{ backgroundColor: statusConfig.color }}
                ></span>
                <span
                  className={`font-['Poppins',sans-serif] text-[12px] font-semibold ${statusConfig.text} uppercase`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Court Details */}
              {court.status === "in-use" && (
                <div className="space-y-2">
                  <p className="font-['Poppins',sans-serif] text-[13px] text-white/60 dark:text-[#0A0E1A]/60">
                    {court.currentMatch}
                  </p>
                  <p className="font-['Poppins',sans-serif] text-[12px] text-white/40 dark:text-[#0A0E1A]/40">
                    Next: {court.nextAvailable}
                  </p>
                </div>
              )}

              {court.status === "available" && (
                <p className="font-['Poppins',sans-serif] text-[13px] text-white/60 dark:text-[#0A0E1A]/60">
                  Ready for booking
                </p>
              )}

              {court.status === "maintenance" && (
                <p className="font-['Poppins',sans-serif] text-[13px] text-white/60 dark:text-[#0A0E1A]/60">
                  Scheduled maintenance in progress
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
