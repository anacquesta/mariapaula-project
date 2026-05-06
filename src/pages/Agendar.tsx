import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";

const HOURS = [9, 10, 11, 14, 15, 16, 17];

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  filling_as: z.string().min(1, "Selecione uma opção"),
  company_name: z.string().trim().optional(),
  city_state: z.string().trim().min(2, "Informe sua cidade e estado"),
  email: z.string().trim().email("Email inválido").max(255),
  whatsapp: z.string().trim().min(8, "WhatsApp inválido").max(25),
  area: z.string().trim().min(1, "Selecione uma área").max(80),
  message: z.string().trim().min(10, "Descreva brevemente o ocorrido").max(2000),
  urgency: z.string().min(1, "Selecione uma opção"),
  investment_ready: z.string().min(1, "Selecione uma opção"),
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
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadTaken = async () => {
    setLoadingSlots(true);
    const from = isoDay(days[0]);
    const to = new Date(isoDay(days[days.length - 1]));
    to.setDate(to.getDate() + 1);
    const { data, error } = await supabase.rpc("get_taken_slots", {
      from_date: from.toISOString(),
      to_date: to.toISOString(),
    });
    if (!error && data) {
      setTaken(new Set(data.map((r: { slot_at: string }) => new Date(r.slot_at).toISOString())));
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

  const isTaken = (day: Date, hour: number) => taken.has(slotDate(day, hour).toISOString());

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
    const { error } = await supabase.from("appointments").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      area: parsed.data.area,
      message: parsed.data.message,
      filling_as: parsed.data.filling_as,
      company_name: parsed.data.company_name,
      city_state: parsed.data.city_state,
      urgency: parsed.data.urgency,
      investment_ready: parsed.data.investment_ready,
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
          <div className="col-span-12 md:col-span-7">
            <div className="label-caps text-foreground/50 mb-4">1. Selecione o dia</div>
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
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
          <form onSubmit={handleSubmit} className="col-span-12 md:col-span-5 space-y-8" noValidate>
            <div className="space-y-4">
              <div className="label-caps text-olive mb-2">3. Solicitação de Análise Jurídica Estratégica</div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Este formulário é destinado a pessoas físicas e empresas que desejam análise jurídica estratégica. 
                As informações serão avaliadas previamente. Entraremos em contato apenas em casos com viabilidade técnica e alinhamento estratégico.
              </p>
            </div>

            <div className="border border-foreground/15 p-5 bg-foreground/[0.02]">
              <div className="label-caps text-foreground/50">Reserva selecionada</div>
              <div className="serif text-xl mt-1">
                {fmtDate(selectedDay)}
                {selectedHour !== null && (
                  <span className="text-olive"> · {selectedHour.toString().padStart(2, "0")}:00</span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label-caps text-foreground/60">Nome completo*</label>
                <input name="name" className={field} placeholder="Seu nome completo" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label-caps text-foreground/60">Você está preenchendo o formulário como:*</label>
                <select name="filling_as" defaultValue="" className={field}>
                  <option value="" disabled>Selecione…</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                  <option value="Representante da Empresa">Representante da Empresa</option>
                </select>
                {errors.filling_as && <p className="text-destructive text-xs mt-1">{errors.filling_as}</p>}
              </div>

              <div>
                <label className="label-caps text-foreground/60">Nome da empresa (se aplicável)</label>
                <input name="company_name" className={field} placeholder="Nome da empresa" />
              </div>

              <div>
                <label className="label-caps text-foreground/60">Cidade e Estado*</label>
                <input name="city_state" className={field} placeholder="Ex: Goiânia - GO" />
                {errors.city_state && <p className="text-destructive text-xs mt-1">{errors.city_state}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label-caps text-foreground/60">Telefone com WhatsApp*</label>
                  <input name="whatsapp" className={field} placeholder="(00) 98765-4321" />
                  {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>}
                </div>
                <div>
                  <label className="label-caps text-foreground/60">Email*</label>
                  <input name="email" type="email" className={field} placeholder="contato@exemplo.com" />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="label-caps text-foreground/60">Área de interesse*</label>
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
                {errors.area && <p className="text-destructive text-xs mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="label-caps text-foreground/60">Descreva de forma objetiva o ocorrido*</label>
                <textarea 
                  name="message" 
                  rows={4} 
                  className={field} 
                  placeholder="Datas, valores aproximados e documentos existentes…" 
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>

              <div>
                <label className="label-caps text-foreground/60">Deseja agendar uma reunião de urgência?*</label>
                <select name="urgency" defaultValue="" className={field}>
                  <option value="" disabled>Selecione…</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                {errors.urgency && <p className="text-destructive text-xs mt-1">{errors.urgency}</p>}
              </div>

              <div>
                <label className="label-caps text-foreground/60">Caso haja viabilidade jurídica, você está disposto(a) a investir em solução estratégica?*</label>
                <select name="investment_ready" defaultValue="" className={field}>
                  <option value="" disabled>Selecione…</option>
                  <option value="Sim">Sim</option>
                  <option value="Estou avaliando as possibilidades">Estou avaliando as possibilidades</option>
                </select>
                {errors.investment_ready && <p className="text-destructive text-xs mt-1">{errors.investment_ready}</p>}
              </div>
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
