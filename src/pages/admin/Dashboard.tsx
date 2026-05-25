import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Search,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  area: string;
  message: string;
  slot_at: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // upcoming, all, cancelled

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    let query = supabase
      .from("appointments")
      .select("*")
      .order("slot_at", { ascending: true });

    if (filter === "upcoming") {
      query = query.gte("slot_at", new Date().toISOString()).neq("status", "cancelled");
    } else if (filter === "cancelled") {
      query = query.eq("status", "cancelled");
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Erro ao carregar agendamentos");
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success(`Status atualizado para ${newStatus}`);
      fetchAppointments();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded">Confirmado</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-wider rounded">Cancelado</span>;
      case "completed":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wider rounded">Realizado</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold uppercase tracking-wider rounded">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="serif text-4xl text-charcoal">Agendamentos</h1>
            <p className="text-foreground/50 text-sm mt-2 uppercase tracking-widest label-caps">Gestão de consultas e clientes</p>
          </div>

          <div className="flex items-center justify-between gap-1 bg-white p-1 border border-foreground/10 rounded-sm w-full md:w-auto">
            {["upcoming", "all", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-2 sm:px-4 py-2 text-[9px] sm:text-[10px] label-caps tracking-widest transition-all flex-1 md:flex-initial text-center
                  ${filter === f ? "bg-charcoal text-offwhite" : "text-foreground/40 hover:text-foreground"}
                `}
              >
                {f === "upcoming" ? "Próximos" : f === "all" ? "Todos" : "Cancelados"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white border border-dashed border-foreground/20 rounded-lg py-20 px-6 sm:px-20 text-center">
            <CalendarIcon className="mx-auto text-foreground/20 mb-4" size={48} />
            <p className="text-foreground/40 label-caps tracking-widest">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white border border-foreground/5 p-4 sm:p-6 hover:border-gold/30 transition-all shadow-sm flex flex-col md:flex-row md:items-center gap-6"
              >
                {/* Date & Time */}
                <div className="md:w-48 flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2 text-gold">
                    <CalendarIcon size={14} />
                    <span className="label-caps text-xs font-bold tracking-widest">
                      {format(new Date(apt.slot_at), "dd 'DE' MMM", { locale: ptBR }).toUpperCase()}
                    </span>
                  </div>
                  <div className="serif text-2xl text-charcoal">
                    {format(new Date(apt.slot_at), "HH:mm")}
                  </div>
                </div>

                {/* Client Info */}
                <div className="flex-1 space-y-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="serif text-xl text-charcoal">{apt.name}</h3>
                    {getStatusBadge(apt.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/50">
                    <span className="uppercase tracking-widest font-bold text-gold shrink-0">{apt.area}</span>
                    <span className="break-all">{apt.email}</span>
                    <span className="shrink-0">{apt.whatsapp}</span>
                  </div>
                </div>

                {/* Message Toggle (Simplified for dashboard) */}
                {apt.message && (
                  <div className="md:max-w-xs overflow-hidden">
                    <p className="text-xs text-foreground/60 italic line-clamp-2 leading-relaxed">
                      "{apt.message}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-0 border-foreground/5">
                  <a 
                    href={`https://wa.me/${apt.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare size={20} />
                  </a>
                  
                  {apt.status === "confirmed" && (
                    <>
                      <button 
                        onClick={() => updateStatus(apt.id, "completed")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Marcar como concluído"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button 
                        onClick={() => updateStatus(apt.id, "cancelled")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancelar agendamento"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}

                  {apt.status === "cancelled" && (
                    <button 
                      onClick={() => updateStatus(apt.id, "confirmed")}
                      className="text-[9px] label-caps tracking-widest text-gold hover:underline"
                    >
                      Reativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
