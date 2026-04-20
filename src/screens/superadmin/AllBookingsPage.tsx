import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Search,
  Filter,
  Trash2,
  Loader2,
  RefreshCw,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { superAdminService } from "../../services/superAdminService";
import { toast } from "react-hot-toast";

interface Booking {
  id: string | number;
  player_id: string;
  court_id: string | number;
  club_id?: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  profiles?: { full_name: string };
  courts?: { name: string };
  clubs?: { name: string };
}

interface Club {
  id: string;
  name: string;
}

const STATUS_OPTIONS = ["all", "pending", "confirmed", "cancelled"];

export function AllBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingList, clubList] = await Promise.all([
        superAdminService.getAllBookings(),
        superAdminService.getAllClubs(),
      ]);
      setBookings(bookingList ?? []);
      setClubs(clubList ?? []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: string | number) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await superAdminService.cancelBooking(id);
      toast.success("Booking cancelled");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.courts?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesClub = clubFilter === "all" || b.club_id === clubFilter;
    return matchesSearch && matchesStatus && matchesClub;
  });

  // Stats
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            All Bookings
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Platform-wide booking overview across all clubs.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all self-start"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Confirmed", value: confirmed, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Cancelled", value: cancelled, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-4 border border-border text-center`}
          >
            <p className={`text-2xl font-bold font-['Playfair_Display'] ${s.color}`}>
              {loading ? "—" : s.value}
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-['Poppins'] mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by player or court..."
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all font-['Poppins']"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 h-12 font-['Poppins']">
            <Filter size={15} className="text-muted-foreground" />
            <select
              className="bg-transparent text-foreground outline-none text-sm font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 h-12 font-['Poppins']">
            <Building2 size={15} className="text-muted-foreground" />
            <select
              className="bg-transparent text-foreground outline-none text-sm font-semibold max-w-[120px]"
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
            >
              <option value="all">All Clubs</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center font-['Poppins']">
            <Loader2 className="animate-spin text-accent w-10 h-10 mb-4" />
            <p className="text-muted-foreground font-medium">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground italic font-['Poppins']">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Player", "Court", "Club", "Schedule", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-['Poppins'] ${
                        i === 5 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                          {booking.profiles?.full_name?.[0] ?? <User size={16} />}
                        </div>
                        <span className="font-bold text-foreground text-sm font-['Poppins'] truncate max-w-[100px]">
                          {booking.profiles?.full_name ?? "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                        <MapPin size={14} className="text-accent" />
                        {booking.courts?.name ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                        <Building2 size={14} className="text-muted-foreground/60" />
                        {booking.clubs?.name ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1 font-['Poppins']">
                        <div className="flex items-center gap-2 text-sm text-foreground font-semibold whitespace-nowrap">
                          <CalendarIcon size={13} className="text-muted-foreground/60" />
                          {new Date(booking.start_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {new Date(booking.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(booking.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                          booking.status === "confirmed"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : booking.status === "cancelled"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Cancel booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
