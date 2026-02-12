import { useState } from "react";
import { Plus, MapPin, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../config/supabase";
import { toast } from "react-hot-toast";

export function AdminCourtConfig() {
  const [courtName, setCourtName] = useState("");
  const [courtType, setCourtType] = useState("Clay"); // Par défaut

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('courts')
        .insert([{ name: courtName, type: courtType, status: 'available' }]);
      
      if (error) throw error;
      toast.success("Court added successfully");
      setCourtName("");
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
        
        <form onSubmit={handleAddCourt} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text"
            placeholder="Court Name (ex: Court Central)"
            className="md:col-span-1 h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            required
          />
          <select 
            className="h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 dark:text-white outline-none focus:border-[#39FF14]"
            value={courtType}
            onChange={(e) => setCourtType(e.target.value)}
          >
            <option value="Clay">Clay Court</option>
            <option value="Hard">Hard Court</option>
            <option value="Grass">Grass Court</option>
          </select>
          <button className="h-12 bg-[#39FF14] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <Plus size={20} /> Add Court
          </button>
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