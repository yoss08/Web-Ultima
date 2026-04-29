import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";
import { adminService } from "../../services/adminService";

export function AdminCourtConfig() {
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    async function loadClub() {
      try {
        const clubInfo = await adminService.getClubInfo();
        setClubId(clubInfo.id);
      } catch (err) {
        console.error("Failed to load club info", err);
      }
    }
    loadClub();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    type: "Indoor",
    surface: "Clay",
    capacity: 4
  });

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) {
      toast.error("No club assigned. Please contact Super Admin.");
      return;
    }
    try {
      await adminService.addCourt({
        ...formData,
        club_id: clubId,
        status: 'available'
      });
      
      toast.success("Court added successfully");
      setFormData({
        name: "",
        type: "Indoor",
        surface: "Clay",
        capacity: 4
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2 font-['Playfair_Display']">
          <MapPin className="text-accent" /> Add New Court
        </h2>
        
        <form onSubmit={handleAddCourt} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 font-['Poppins']">
            <label className="text-sm font-medium text-muted-foreground">Basic Information</label>
            <input 
              type="text"
              placeholder="Court Name (ex: Court Central)"
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
              <select 
                className="h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
                value={formData.surface}
                onChange={(e) => setFormData({...formData, surface: e.target.value})}
              >
                <option value="Clay">Clay</option>
                <option value="Hard">Hard</option>
                <option value="Grass">Grass</option>
              </select>
            </div>
            <input 
              type="number"
              placeholder="Capacity (Players)"
              className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-foreground outline-none focus:border-accent transition-all"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              required
            />
          </div>

          <div className="space-y-4 font-['Poppins']">
            <button className="w-full h-12 bg-accent text-accent-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20">
              <Plus size={20} /> Add Court
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}