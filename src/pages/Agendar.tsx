import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";

const HOURS = [9, 10, 11, 14, 15, 16, 17];

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(8).max(25),
  area: z.string().trim().min(1).max(80),
  message: z.string().trim().max(1000).optional(),
});

const fmtDate = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });

const isoDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const buildDays = () => {
  const days: Date[] = [];
  const today = isoDay(new Date());
  let i = 1;
  while (days.length < 14) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(d);
    i++;
  }
  return days;
};

const Agendar = () => {
  useEffect(() => {
    document.title = "Agendar consulta — Maria Paula Lino";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "Agende sua consulta jurídica online com Maria Paula Lino. Calendário com horários disponíveis em tempo real."
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  const days = useMemo(buildDays, []);
  const [selectedDay, setSelectedDay] = useState<Date>(days[0]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadTaken = async () => {
    setLoadingSlots(true);
    const from = isoDay(days[0]);
    const to = new Date(isoDay(days[days.length - 1]));
    to.setDate(to.getDate() + 1);

    // Fetch taken slots
    const { data: takenData, error: takenError } = await supabase.rpc("get_taken_slots", {
      from_date: from.toISOString(),
      to_date: to.toISOString(),
    });

    // Fetch blocked dates
    const { data: blockedData } = await supabase
      .from("blocked_dates" as any)
      .select("*")
      .gte("end_date", from.toISOString());

    if (!takenError && takenData) {
      setTaken(new Set(takenData.map((r: { slot_at: string }) => new Date(r.slot_at).toISOString())));
    }
    
    if (blockedData) {
      setBlockedDates(blockedData as any);
    }

    setLoadingSlots(false);
  };

  useEffect(() => {
    loadTaken();
    const channel = supabase
      .channel("appointments-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "appointments" }, () => {
        loadTaken();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slotDate = (day: Date, hour: number) => {
    const d = new Date(day);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const isTaken = (day: Date, hour: number) => {
    const date = slotDate(day, hour);
    const iso = date.toISOString();
    
    // Check if taken in appointments
    if (taken.has(iso)) return true;
    
    // Check if blocked in blocked_dates (férias/bloqueios)
    return blockedDates.some(block => {
      const start = new Date(block.start_date);
      const end = new Date(block.end_date);
      
      // Ensure the end date covers the full day if it was set via date input (T23:59:59)
      // and comparing correctly with the slot date
      return date >= start && date <= end;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedHour === null) {
      toast.error("Selecione um horário disponível.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    
    const slot = slotDate(selectedDay, selectedHour);
    const slotIso = slot.toISOString();

    // Verificação de última hora: o horário foi bloqueado enquanto o cliente estava na página?
    const { data: blockedNow } = await supabase
      .from("blocked_dates" as any)
      .select("id")
      .lte("start_date", slotIso)
      .gte("end_date", slotIso)
      .maybeSingle();

    if (blockedNow) {
      toast.error("Este horário não está mais disponível. Por favor, escolha outro dia.");
      loadTaken();
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      area: parsed.data.area,
      message: parsed.data.message ?? null,
      slot_at: slot.toISOString(),
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("Esse horário acabou de ser reservado. Escolha outro.");
        loadTaken();
        setSelectedHour(null);
      } else {
        toast.error("Não foi possível agendar. Tente novamente.");
      }
      return;
    }
    toast.success(
      `Consulta agendada para ${fmtDate(selectedDay)} às ${selectedHour}:00. Enviaremos a confirmação.`
    );
    (e.target as HTMLFormElement).reset();
    setSelectedHour(null);
    loadTaken();
  };

  const field =
    "w-full bg-transparent border-b border-foreground/25 focus:border-olive outline-none py-3 placeholder:text-foreground/40 transition-colors";

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />

      <section className="pt-36 pb-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-olive" />
            <span className="label-caps text-olive">Agendamento online</span>
          </div>
          <h1 className="display text-5xl md:text-7xl max-w-4xl">
            Reserve sua <span className="italic-serif text-olive">consulta</span>
          </h1>
          <p className="mt-6 max-w-xl text-foreground/70">
            Escolha um dia e horário disponíveis abaixo.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid grid-cols-12 gap-10 md:gap-16">
          {/* Calendar */}
          <div className="col-span-12 md:col-span-7 min-w-0">
            <div className="label-caps text-foreground/50 mb-4">1. Selecione o dia</div>
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:flex-wrap md:overflow-visible">
              {days.map((d) => {
                const active = isoDay(d).getTime() === isoDay(selectedDay).getTime();
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => {
                      setSelectedDay(d);
                      setSelectedHour(null);
                    }}
                    className={`shrink-0 px-5 py-4 border transition-colors text-left min-w-[110px] snap-start ${active
                      ? "bg-charcoal text-offwhite border-charcoal"
                      : "border-foreground/20 hover:border-olive"
                      }`}
                  >
                    <div className="label-caps opacity-70">{d.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                    <div className="serif text-2xl mt-1">{d.getDate().toString().padStart(2, "0")}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {d.toLocaleDateString("pt-BR", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="label-caps text-foreground/50 mt-10 mb-4">
              2. Selecione o horário {loadingSlots && <span className="ml-2 opacity-60">carregando…</span>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {HOURS.map((h) => {
                const taken = isTaken(selectedDay, h);
                const active = selectedHour === h;
                return (
                  <button
                    key={h}
                    disabled={taken}
                    onClick={() => setSelectedHour(h)}
                    className={`py-4 border transition-all label-caps ${taken
                      ? "border-foreground/10 text-foreground/30 line-through cursor-not-allowed"
                      : active
                        ? "bg-olive text-offwhite border-olive"
                        : "border-foreground/20 hover:border-olive hover:text-olive"
                      }`}
                  >
                    {h.toString().padStart(2, "0")}:00
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-foreground/50 mt-4">
              Horários riscados já estão reservados. A disponibilidade é atualizada em tempo real.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="col-span-12 md:col-span-5 space-y-6 min-w-0" noValidate>
            <div className="label-caps text-foreground/50 mb-2">3. Informe seus dados</div>

            <div className="border border-foreground/15 p-5 bg-foreground/[0.02]">
              <div className="label-caps text-foreground/50">Reserva</div>
              <div className="serif text-xl mt-1">
                {fmtDate(selectedDay)}
                {selectedHour !== null && (
                  <span className="text-olive"> · {selectedHour.toString().padStart(2, "0")}:00</span>
                )}
              </div>
            </div>

            <div>
              <label className="label-caps text-foreground/60">Nome</label>
              <input name="name" className={field} placeholder="Seu nome completo" />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label-caps text-foreground/60">Email</label>
              <input name="email" type="email" className={field} placeholder="voce@empresa.com" />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label-caps text-foreground/60">WhatsApp</label>
              <input name="whatsapp" className={field} placeholder="(00) 98765-4321" />
            </div>
            <div>
              <label className="label-caps text-foreground/60">Área</label>
              <select name="area" defaultValue="" className={field}>
                <option value="" disabled>Selecione…</option>
                <option>Contratos</option>
                <option>LGPD & Compliance</option>
                <option>Direito Digital</option>
                <option>Direito do Consumidor</option>
                <option>Obrigações Civis</option>
                <option>Registro de Marca</option>
                <option>Outra</option>
              </select>
              {errors.area && <p className="text-destructive text-sm mt-1">{errors.area}</p>}
            </div>
            <div>
              <label className="label-caps text-foreground/60">Mensagem (opcional)</label>
              <textarea name="message" rows={3} className={field} placeholder="Conte brevemente sobre o caso…" />
            </div>

            <button
              type="submit"
              disabled={submitting || selectedHour === null}
              className="w-full inline-flex items-center justify-center gap-3 bg-charcoal text-offwhite px-8 py-4 label-caps hover:bg-olive transition-colors duration-300 disabled:opacity-50 disabled:hover:bg-charcoal"
            >
              {submitting ? "Reservando…" : "Confirmar agendamento"} <span aria-hidden>→</span>
            </button>
          </form>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Agendar;

