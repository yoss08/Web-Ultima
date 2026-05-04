import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  Plus, 
  Loader2, 
  RefreshCw,
  Trash2,
  Building2,
  Edit3,
  Save,
  X,
  Clock,
  DollarSign,
  MapPin,
  Check
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import { confirmDialog } from "../../components/ui/ConfirmDialog";

type CourtStatus = "available" | "occupied" | "maintenance";

interface Court {
  id: string | number;
  name: string;
  status: CourtStatus;
  type: string;
  current_match?: string;
  capacity?: number;
  surface?: string;
}

interface ClubInfo {
  id: string | number;
  name: string;
  photo_url?: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  open_time?: string;
  close_time?: string;
  price_per_court?: number;
  description?: string;
  court_count: number;
}

export function CourtsManagementPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [isEditingClub, setIsEditingClub] = useState(false);
  const [clubForm, setClubForm] = useState<Partial<ClubInfo>>({});
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [courtFormModal, setCourtFormModal] = useState<Partial<Court>>({});

  // Fetch club info
  const fetchClubInfo = async () => {
    try {
      console.log('[CourtsPage] Fetching club info...');
      const data = await adminService.getClubInfo();
      console.log('[CourtsPage] Club info received:', data);
      setClubInfo(data);
      setClubForm(data);
    } catch (error: any) {
      console.log('[CourtsPage] Error fetching club info:', error);
      toast.error("Error fetching club info: " + error.message);
    }
  };
const [saving, setSaving] = useState(false);
  // Save club info
const handleSaveClub = async () => {
if (!clubInfo?.id) {
toast.error("Club not loaded yet — try refreshing.");
return;
}
setSaving(true);
try {
const updates = {
name: clubForm.name,
photo_url: clubForm.photo_url,
location: clubForm.location,
open_time: clubForm.open_time,
close_time: clubForm.close_time,
price_per_court: clubForm.price_per_court,
description: clubForm.description,
};
await adminService.updateClubInfo(String(clubInfo.id), updates);
toast.success("Club updated successfully!");
setIsEditingClub(false);
fetchClubInfo(); // re-fetch so super_admin changes sync back too
} catch (error: any) {
toast.error("Failed to update: " + error.message);
} finally {
setSaving(false);
}
};

  // 1. Récupération des données réelles
  const fetchCourts = async () => {
    try {
      setLoading(true);
      const courts = await adminService.getAllCourts();
      setCourts(courts || []);
    } catch (error: any) {
      toast.error("Error fetching courts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
    fetchClubInfo();
  }, []);

  // 2. Action Admin : Changer le statut (Maintenance / Available)
  const toggleMaintenance = async (courtId: string | number, currentStatus: CourtStatus) => {
    const newStatus = currentStatus === "maintenance" ? "available" : "maintenance";
    
    try {
      await adminService.updateCourtStatus(courtId, newStatus);
      
      // Mise à jour locale de l'état
      setCourts(courts.map(c => c.id === courtId ? { ...c, status: newStatus } : c));
      toast.success(`Court set to ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const handleDeleteCourt = async (courtId: string | number) => {
    const ok = await confirmDialog({ title: "Delete Court", message: "Are you sure you want to delete this court? This cannot be undone.", confirmLabel: "Delete", variant: "danger" });
    if (!ok) return;
    try {
      await adminService.deleteCourt(courtId);
      setCourts(courts.filter(c => c.id !== courtId));
      toast.success("Court deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete court: " + error.message);
    }
  };

  const handleSaveCourt = async () => {
    if (!editingCourt?.id) return;
    setSaving(true);
    try {
      const updates = {
        name: courtFormModal.name,
        type: courtFormModal.type ? courtFormModal.type.toLowerCase() : undefined,
        surface: courtFormModal.surface,
      };
      await adminService.updateCourt(editingCourt.id, updates);
      toast.success("Court updated successfully!");
      setEditingCourt(null);
      fetchCourts();
    } catch (error: any) {
      toast.error("Failed to update court: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = (status: CourtStatus) => {
    switch (status) {
      case "available":
        return { color: "var(--theme-accent)", iconColor: "var(--theme-accent)", icon: CheckCircle, label: "Available", bg: "bg-accent/10" };
      case "occupied":
        return { color: "var(--theme-accent)", iconColor: "var(--theme-accent)", icon: AlertCircle, label: "Occupied", bg: "bg-accent/10" };
      case "maintenance":
        return { color: "#FF3B30", iconColor: "#FF3B30", icon: Wrench, label: "Maintenance", bg: "bg-red-500/10" };
      default:
        return { color: "var(--theme-muted-foreground)", iconColor: "var(--theme-muted-foreground)", icon: AlertCircle, label: "Unknown", bg: "bg-muted" };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header avec bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">Courts Management</h1>
          <p className="text-muted-foreground text-sm font-['Poppins']">Real-time status and advanced facility control.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={fetchCourts}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all font-['Poppins']"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <Link 
            to="/dashboard/admin/courts-config" 
            className="flex items-center gap-2 px-6 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20"
          >
            <Plus size={20} /> Add Court
          </Link>
        </div>
      </div>

      {/* Club Info Box */}
      {!isEditingClub ? (
        <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
          {/* Club Photo */}
          <div className="h-40 bg-muted relative overflow-hidden">
            {clubInfo?.photo_url ? (
              <img
                src={clubInfo.photo_url}
                alt={clubInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={48} className="text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Club Info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">{clubInfo?.name || 'Your Club'}</h2>
                <p className="text-sm text-muted-foreground font-['Poppins'] mt-1">{clubInfo?.court_count || 0} courts configured</p>
              </div>
              <button
                onClick={() => setIsEditingClub(true)}
                className="p-2 bg-muted rounded-xl hover:bg-muted/80 transition-all"
              >
                <Edit3 size={18} />
              </button>
            </div>

            {/* Club Details */}
            <div className="space-y-2 mt-4 pt-4 border-t border-border">
              {clubInfo?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                  <MapPin size={14} className="text-accent flex-shrink-0" />
                  <span>{clubInfo.location}</span>
                </div>
              )}
              {clubInfo?.open_time && clubInfo?.close_time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                  <Clock size={14} className="text-accent flex-shrink-0" />
                  <span>{clubInfo.open_time} – {clubInfo.close_time}</span>
                </div>
              )}
              {clubInfo?.price_per_court !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                  <DollarSign size={14} className="text-accent flex-shrink-0" />
                  <span>{clubInfo.price_per_court} TND / court / hr</span>
                </div>
              )}
            </div>
            {clubInfo?.description && (
              <p className="text-xs text-muted-foreground mt-4 line-clamp-3 font-['Poppins']">
                {clubInfo.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-xl rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Edit Club</h2>
              <button
                onClick={() => { setIsEditingClub(false); setClubForm(clubInfo || {}); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 font-['Poppins']">
              {/* Photo URL */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Club Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                  value={clubForm.photo_url || ''}
                  onChange={(e) => setClubForm({ ...clubForm, photo_url: e.target.value })}
                />
                {clubForm.photo_url && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-border">
                    <img
                      src={clubForm.photo_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Club Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tennis Club Tunis"
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                  value={clubForm.name || ''}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rue du Sport, Tunis"
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                  value={clubForm.location || ''}
                  onChange={(e) => setClubForm({ ...clubForm, location: e.target.value })}
                />
              </div>

              {/* Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Open Time
                  </label>
                  <input
                    type="time"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={clubForm.open_time || '08:00'}
                    onChange={(e) => setClubForm({ ...clubForm, open_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Close Time
                  </label>
                  <input
                    type="time"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={clubForm.close_time || '22:00'}
                    onChange={(e) => setClubForm({ ...clubForm, close_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Price per Court (TND / hr)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                  value={clubForm.price_per_court || 0}
                  onChange={(e) => setClubForm({ ...clubForm, price_per_court: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="Short description of the club..."
                  rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-all resize-none"
                  value={clubForm.description || ''}
                  onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                />
              </div>

              <button
            onClick={handleSaveClub}
            disabled={saving}
            className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 mt-6"
          >
            {saving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <><Check size={20} /> Save Changes</>
            )}
          </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid des Courts */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground font-['Poppins']">Loading your infrastructure...</p>
        </div>
      ) : courts.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-20 text-center">
          <h2 className="text-xl font-bold text-foreground">No courts configured</h2>
          <p className="text-muted-foreground mt-2 font-['Poppins']">Click "Add Court" to initialize your tennis club facilities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {courts.map((court: any) => {
            const config = getStatusConfig(court.status);
            const Icon = config.icon;

            return (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[28px] p-6 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {court.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-bold uppercase tracking-wider font-['Poppins']">
                        {court.type}
                      </span>
                      <span className="text-[10px] bg-accent/10 px-2 py-0.5 rounded text-accent font-bold uppercase tracking-wider font-['Poppins']">
                        {court.surface}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon size={20} style={{ color: config.iconColor }} />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 bg-muted/30 rounded-2xl border border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase font-['Poppins']">Rate</p>
                      <p className="text-sm text-foreground font-bold">{clubInfo?.price_per_court || 0} DT/hr</p>
                    </div>
                  </div>

                  {court.status === "occupied" ? (
                    <div className="p-3 bg-accent/5 rounded-xl border border-accent/10">
                      <p className="text-[10px] text-accent font-bold uppercase font-['Poppins']">Current Match</p>
                      <p className="text-sm text-foreground font-medium truncate">{court.current_match || "Active Session"}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted rounded-xl border border-border">
                       <p className="text-xs text-muted-foreground italic font-['Poppins']">
                         {court.status === "maintenance" ? "🛠 Maintenance in progress" : "✅ Available for booking"}
                       </p>
                    </div>
                  )}
                </div>

                {/* --- ACTIONS ADMIN --- */}
                <div className="mt-6 pt-6 border-t border-border flex gap-2">
                  <button 
                    onClick={() => toggleMaintenance(court.id, court.status)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      court.status === "maintenance" 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-muted text-foreground hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {court.status === "maintenance" ? "End Maintenance" : "Set Maintenance"}
                  </button>
                  <button 
                    onClick={() => { setEditingCourt(court); setCourtFormModal(court); }}
                    className="p-2.5 bg-muted text-foreground rounded-xl hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourt(court.id)}
                    className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Court Modal */}
      {editingCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-xl rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">Edit Court</h2>
              <button
                onClick={() => setEditingCourt(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 font-['Poppins']">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Court Name</label>
                <input
                  type="text"
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                  value={courtFormModal.name || ''}
                  onChange={(e) => setCourtFormModal({ ...courtFormModal, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Type</label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={courtFormModal.type || 'indoor'}
                    onChange={(e) => setCourtFormModal({ ...courtFormModal, type: e.target.value })}
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Surface</label>
                  <select
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={courtFormModal.surface || 'Clay'}
                    onChange={(e) => setCourtFormModal({ ...courtFormModal, surface: e.target.value })}
                  >
                    <option value="Clay">Clay</option>
                    <option value="Hard">Hard</option>
                    <option value="Grass">Grass</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSaveCourt}
                disabled={saving}
                className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 mt-6"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <><Check size={20} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}