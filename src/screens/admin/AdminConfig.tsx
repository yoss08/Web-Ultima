import { useState } from "react";
import { Plus, MapPin, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

export function AdminCourtConfig() {
  const [formData, setFormData] = useState({
    name: "",
    type: "Indoor",
    surface: "Clay",
    capacity: 2,
    pricing_peak: 0,
    pricing_offpeak: 0,
    almus_hardware_id: ""
  });

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/courts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'available' })
      });
      
      if (!response.ok) throw new Error("Failed to add court");
      
      toast.success("Court added successfully");
      setFormData({
        name: "",
        type: "Indoor",
        surface: "Clay",
        capacity: 2,
        pricing_peak: 0,
        pricing_offpeak: 0,
        almus_hardware_id: ""
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8">
        <h2 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-2">
          <MapPin className="text-[#39FF14]" /> Add New Court
        </h2>
        
        <form onSubmit={handleAddCourt} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm font-medium dark:text-gray-400">Basic Information</label>
            <input 
              type="text"
              placeholder="Court Name (ex: Court Central)"
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                className="h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
              <select 
                className="h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
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
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium dark:text-gray-400">Pricing & Integration</label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number"
                placeholder="Peak Rate ($/hr)"
                className="h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                value={formData.pricing_peak}
                onChange={(e) => setFormData({...formData, pricing_peak: parseFloat(e.target.value)})}
                required
              />
              <input 
                type="number"
                placeholder="Off-Peak Rate ($/hr)"
                className="h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
                value={formData.pricing_offpeak}
                onChange={(e) => setFormData({...formData, pricing_offpeak: parseFloat(e.target.value)})}
                required
              />
            </div>
            <input 
              type="text"
              placeholder="ALMUS Hardware ID"
              className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
              value={formData.almus_hardware_id}
              onChange={(e) => setFormData({...formData, almus_hardware_id: e.target.value})}
            />
            <button className="w-full h-12 bg-[#39FF14] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all mt-2">
              <Plus size={20} /> Add Court
            </button>
          </div>
        </form>
      </div>

      {/* Liste des courts configurés (Simulation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px] flex justify-between items-center">
          <div>
            <h4 className="font-bold dark:text-white">Court Central</h4>
            <p className="text-xs text-gray-500">Clay • Available</p>
          </div>
          <button className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}