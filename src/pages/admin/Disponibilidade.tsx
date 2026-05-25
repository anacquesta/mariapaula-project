import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Plus, 
  ShieldAlert,
  Clock,
  ArrowRight
} from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockedDate {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_at: string;
}

const Disponibilidade = () => {
  const [blocks, setBlocks] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("blocked_dates" as any)
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar bloqueios");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBlocks((data as any) || []);
    }
    setLoading(false);
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setIsSubmitting(true);
    const { error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("blocked_dates" as any)
      .insert([
        { 
          start_date: new Date(startDate + "T00:00:00").toISOString(), 
          end_date: new Date(endDate + "T23:59:59").toISOString(), 
          reason 
        }
      ]);

    if (error) {
      toast.error("Erro ao criar bloqueio");
    } else {
      toast.success("Período bloqueado com sucesso");
      setStartDate("");
      setEndDate("");
      setReason("");
      fetchBlocks();
    }
    setIsSubmitting(false);
  };

  const deleteBlock = async (id: string) => {
    const { error } = await supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("blocked_dates" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao remover bloqueio");
    } else {
      toast.success("Bloqueio removido");
      fetchBlocks();
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <h1 className="serif text-4xl text-charcoal">Disponibilidade</h1>
          <p className="text-foreground/50 text-sm mt-2 uppercase tracking-widest label-caps">Gestão de férias e bloqueios de agenda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form: Add Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-foreground/10 p-8 rounded-sm space-y-6">
              <div className="flex items-center gap-3 text-gold">
                <Plus size={18} />
                <h2 className="label-caps text-xs font-bold tracking-widest">BLOQUEAR PERÍODO</h2>
              </div>

              <form onSubmit={handleAddBlock} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-caps text-[10px] text-foreground/40 tracking-widest">DATA INÍCIO</label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="border-foreground/10 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps text-[10px] text-foreground/40 tracking-widest">DATA FIM</label>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="border-foreground/10 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps text-[10px] text-foreground/40 tracking-widest">MOTIVO (OPCIONAL)</label>
                  <Input 
                    placeholder="Ex: Férias, Congresso..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border-foreground/10 h-11"
                  />
                </div>
                <Button 
                  disabled={isSubmitting}
                  className="w-full bg-charcoal text-offwhite label-caps text-[10px] tracking-widest h-12 hover:bg-olive transition-all"
                >
                  {isSubmitting ? "BLOQUEANDO..." : "CONFIRMAR BLOQUEIO"}
                </Button>
              </form>

              <div className="flex gap-3 p-4 bg-gold/5 border border-gold/10 rounded">
                <ShieldAlert className="text-gold shrink-0" size={16} />
                <p className="text-[10px] text-foreground/60 leading-relaxed italic">
                  Os dias dentro deste intervalo não estarão disponíveis para novos agendamentos no site. Agendamentos já realizados não serão afetados automaticamente.
                </p>
              </div>
            </div>
          </div>

          {/* List: Active Blocks */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="label-caps text-[11px] text-foreground/40 tracking-[0.2em]">BLOQUEIOS ATIVOS</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
              </div>
            ) : blocks.length === 0 ? (
              <div className="py-12 border border-dashed border-foreground/10 rounded flex flex-col items-center justify-center gap-3">
                <Clock className="text-foreground/10" size={32} />
                <p className="text-[10px] label-caps text-foreground/30 tracking-widest">Nenhum bloqueio programado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block) => (
                  <div 
                    key={block.id}
                    className="bg-white border border-foreground/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/20 transition-all group shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="label-caps text-[10px] text-foreground/40">DE</span>
                          <span className="serif text-base sm:text-lg text-charcoal">
                            {format(new Date(block.start_date), "dd 'de' MMM", { locale: ptBR })}
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-gold/50 shrink-0" />
                        <div className="flex flex-col">
                          <span className="label-caps text-[10px] text-foreground/40">ATÉ</span>
                          <span className="serif text-base sm:text-lg text-charcoal">
                            {format(new Date(block.end_date), "dd 'de' MMM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      {block.reason && (
                        <div className="sm:ml-4 sm:pl-4 sm:border-l border-foreground/10 min-w-0">
                          <span className="text-[10px] label-caps text-foreground/40 block mb-0.5 sm:mb-1">MOTIVO</span>
                          <span className="text-xs text-foreground/60 italic block truncate sm:normal-case">"{block.reason}"</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => deleteBlock(block.id)}
                      className="self-end sm:self-auto p-2 text-foreground/20 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Remover bloqueio"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Disponibilidade;
