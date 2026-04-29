import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  ImageIcon,
  Check,
} from "lucide-react";
import { superAdminService } from "../../services/superAdminService";
import { toast } from "react-hot-toast";
import { confirmDialog } from "../../components/ui/ConfirmDialog";

interface Club {
  id: string;
  name: string;
  photo_url?: string;
  location: string;
  open_time: string;
  close_time: string;
  price_per_court: number;
  description?: string;
  created_at?: string;
}

const emptyForm = {
  name: "",
  photo_url: "",
  location: "",
  open_time: "08:00",
  close_time: "22:00",
  price_per_court: 0,
  description: "",
};

export function ClubManagement() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getAllClubs();
      setClubs(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const openAddModal = () => {
    setEditingClub(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (club: Club) => {
    setEditingClub(club);
    setForm({
      name: club.name,
      photo_url: club.photo_url ?? "",
      location: club.location,
      open_time: club.open_time,
      close_time: club.close_time,
      price_per_court: club.price_per_court,
      description: club.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.location) {
      toast.error("Name and location are required.");
      return;
    }
    setSaving(true);
    try {
      if (editingClub) {
        await superAdminService.updateClub(editingClub.id, form);
        toast.success("Club updated successfully");
      } else {
        await superAdminService.createClub(form);
        toast.success("Club created successfully");
      }
      setShowModal(false);
      fetchClubs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirmDialog({ title: "Delete Club", message: `Delete club "${name}"? This cannot be undone.`, confirmLabel: "Delete", variant: "danger" });
    if (!ok) return;
    try {
      await superAdminService.deleteClub(id);
      toast.success("Club deleted");
      fetchClubs();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filtered = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Playfair_Display']">
            Club Management
          </h1>
          <p className="text-muted-foreground text-sm font-['Poppins'] mt-1">
            Create, edit and manage all clubs on the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchClubs}
            className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted/80 transition-all"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20 font-['Poppins']"
          >
            <Plus size={20} /> Add Club
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all font-['Poppins']"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Club Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-72 bg-card border border-border rounded-[32px] animate-pulse"
              />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-[32px] p-20 text-center">
          <Building2 size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground font-['Playfair_Display']">
            No clubs yet
          </h3>
          <p className="text-muted-foreground mt-2 text-sm font-['Poppins']">
            Click "Add Club" to register the first club on the platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((club) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-[32px] overflow-hidden group hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all shadow-sm"
            >
              {/* Club Photo */}
              <div className="h-40 bg-muted relative overflow-hidden">
                {club.photo_url ? (
                  <img
                    src={club.photo_url}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={40} className="text-muted-foreground/30" />
                  </div>
                )}
                {/* Actions Overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(club)}
                    className="p-2 bg-background/90 backdrop-blur-sm rounded-xl text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(club.id, club.name)}
                    className="p-2 bg-background/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Club Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground font-['Playfair_Display']">
                  {club.name}
                </h3>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <MapPin size={14} className="text-accent flex-shrink-0" />
                    <span className="truncate">{club.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <Clock size={14} className="text-accent flex-shrink-0" />
                    {club.open_time} – {club.close_time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-['Poppins']">
                    <DollarSign size={14} className="text-accent flex-shrink-0" />
                    {club.price_per_court} TND / court / hr
                  </div>
                </div>
                {club.description && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 font-['Poppins']">
                    {club.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-xl rounded-[32px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground font-['Playfair_Display']">
                  {editingClub ? "Edit Club" : "Add New Club"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 font-['Poppins']">
                {/* Photo Upload */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Club Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, photo_url: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2 text-foreground outline-none focus:border-accent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 cursor-pointer"
                  />
                  {form.photo_url && (
                    <div className="mt-2 h-32 rounded-xl overflow-hidden border border-border relative group">
                      <img
                        src={form.photo_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, photo_url: "" })}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Club Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tennis Club Tunis"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rue du Sport, Tunis"
                    className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                      value={form.open_time}
                      onChange={(e) => setForm({ ...form, open_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                      Close Time
                    </label>
                    <input
                      type="time"
                      className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                      value={form.close_time}
                      onChange={(e) => setForm({ ...form, close_time: e.target.value })}
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
                    value={form.price_per_court}
                    onChange={(e) =>
                      setForm({ ...form, price_per_court: parseFloat(e.target.value) || 0 })
                    }
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
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-14 bg-accent text-accent-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60 mt-2"
                >
                  {saving ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={20} /> {editingClub ? "Save Changes" : "Create Club"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
