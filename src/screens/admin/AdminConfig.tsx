import { useState, useEffect } from "react";
import { Plus, Target, Layers, Loader2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminService } from "../../services/adminService";

export function AdminCourtConfig() {
  const [clubId, setClubId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    type: "indoor",
    surface: "",
    status: "available"
  });

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) {
      toast.error("No club assigned. Please contact Super Admin.");
      return;
    }
    
    if (!formData.name || !formData.surface) {
      toast.error("Please fill out the court name and surface.");
      return;
    }

    setSaving(true);
    try {
      await adminService.addCourt({
        ...formData,
        club_id: clubId,
      });
      
      toast.success("Court added successfully");
      setFormData({
        name: "",
        type: "indoor",
        surface: "",
        status: "available"
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 font-['Poppins']">
      <div className="bg-card border border-border rounded-[32px] p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 font-['Playfair_Display']">
          Add New Court
        </h2>
        
        <form onSubmit={handleAddCourt} className="space-y-6">
          
          {/* COURT NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              Court Name
            </label>
            <div className="relative">
              <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
              <input 
                type="text"
                placeholder="e.g. Court 1"
                className="w-full h-14 pl-12 pr-4 bg-muted border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all placeholder:text-muted-foreground/60 shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* COURT TYPE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              Court Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'indoor'})}
                className={`flex-1 h-12 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border ${
                  formData.type === 'indoor'
                    ? 'border-accent bg-accent/10 text-accent shadow-sm'
                    : 'border-border bg-transparent text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Indoor
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'outdoor'})}
                className={`flex-1 h-12 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border ${
                  formData.type === 'outdoor'
                    ? 'border-accent bg-accent/10 text-accent shadow-sm'
                    : 'border-border bg-transparent text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Outdoor
              </button>
            </div>
          </div>

          {/* SURFACE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              Surface
            </label>
            <div className="relative">
              <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
              <input 
                type="text"
                placeholder="e.g. Hard / Clay / Grass"
                className="w-full h-14 pl-12 pr-4 bg-muted border border-border rounded-2xl text-foreground outline-none focus:border-accent transition-all placeholder:text-muted-foreground/60 shadow-sm"
                value={formData.surface}
                onChange={(e) => setFormData({...formData, surface: e.target.value})}
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2 pb-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
              Status
            </label>
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
              {['available', 'occupied', 'maintenance'].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => setFormData({...formData, status: statusOption})}
                  className={`flex-1 min-w-[100px] h-12 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border ${
                    formData.status === statusOption
                      ? 'border-accent bg-accent/10 text-accent shadow-sm'
                      : 'border-border bg-transparent text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button 
            type="submit"
            disabled={saving}
            className="w-full h-14 bg-accent text-accent-foreground font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-60"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : 'Save Court'}
          </button>
          
        </form>
      </div>
    </div>
  );
}