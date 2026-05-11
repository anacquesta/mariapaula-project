import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useReveal } from "@/hooks/use-reveal";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  whatsapp: z.string().trim().min(8, "WhatsApp inválido").max(25),
  area: z.string().trim().min(1, "Selecione uma área").max(80),
  mensagem: z.string().trim().min(5, "Mensagem muito curta").max(1000),
});

const WHATSAPP = "5564999998533";

const Contact = () => {
  const ref = useReveal<HTMLDivElement>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    setLoading(true);
    const msg = `Olá, sou ${parsed.data.nome}. Área: ${parsed.data.area}. ${parsed.data.mensagem} (Email: ${parsed.data.email})`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => {
      window.open(url, "_blank");
      toast.success("Mensagem pronta — abrindo o WhatsApp.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 400);
  };

  const field = "w-full bg-transparent border-b border-offwhite/25 focus:border-offwhite outline-none py-3 placeholder:text-offwhite/40 text-offwhite transition-colors";

  return (
    <section id="contato" className="py-12 md:py-20 bg-olive text-offwhite">
      <div ref={ref} className="container reveal grid grid-cols-12 gap-10 md:gap-16">
        <div className="col-span-12 md:col-span-5 flex flex-col items-center text-center md:items-start md:text-left">
          <div className="flex items-center justify-start gap-3 mb-6 w-full">
            <span className="h-px w-12 bg-offwhite" />
            <span className="label-caps text-offwhite">Contato</span>
          </div>
          <h2 className="display text-5xl md:text-7xl text-offwhite">
            Conte sobre <br />
            <span className="italic-serif text-charcoal">o seu caso.</span>
          </h2>
          <p className="mt-8 text-offwhite/70 max-w-sm mx-auto md:mx-0">
            Resposta em até 24h úteis. Sigilo absoluto.
          </p>

          <div className="mt-12 space-y-4 flex flex-col items-center text-center md:items-start md:text-left">
            <div>
              <div className="label-caps text-offwhite/50 mb-1">Email</div>
              <a href="mailto:mariapaulalino.adv@gmail.com" className="hover-underline text-offwhite uppercase">
                MARIAPAULALINO.ADV@GMAIL.COM
              </a>
            </div>
            <div>
              <div className="label-caps text-offwhite/50 mb-1">WhatsApp</div>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="hover-underline text-offwhite">
                +55 (64) 99999-8533
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="col-span-12 md:col-span-7 space-y-7" noValidate>
          <div className="grid md:grid-cols-2 gap-7">
            <div>
              <label className="label-caps text-offwhite/60">Nome</label>
              <input name="nome" maxLength={100} className={field} placeholder="Seu nome completo" />
              {errors.nome && <p className="text-destructive-foreground text-sm mt-1 bg-destructive/20 px-2 py-0.5">{errors.nome}</p>}
            </div>
            <div>
              <label className="label-caps text-offwhite/60">Email</label>
              <input name="email" type="email" maxLength={255} className={field} placeholder="voce@empresa.com" />
              {errors.email && <p className="text-destructive-foreground text-sm mt-1 bg-destructive/20 px-2 py-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="label-caps text-offwhite/60">WhatsApp</label>
              <input name="whatsapp" maxLength={25} className={field} placeholder="(11) 99999-9999" />
              {errors.whatsapp && <p className="text-destructive-foreground text-sm mt-1 bg-destructive/20 px-2 py-0.5">{errors.whatsapp}</p>}
            </div>
            <div>
              <label className="label-caps text-offwhite/60">Área</label>
              <select name="area" defaultValue="" className={field}>
                <option value="" disabled className="text-charcoal">Selecione…</option>
                <option className="text-charcoal">Contratos</option>
                <option className="text-charcoal">LGPD & Compliance</option>
                <option className="text-charcoal">Direito Digital</option>
                <option className="text-charcoal">Direito do Consumidor</option>
                <option className="text-charcoal">Obrigações Civis</option>
                <option className="text-charcoal">Registro de Marca</option>
                <option className="text-charcoal">Outra</option>
              </select>
              {errors.area && <p className="text-destructive-foreground text-sm mt-1 bg-destructive/20 px-2 py-0.5">{errors.area}</p>}
            </div>
          </div>
          <div>
            <label className="label-caps text-offwhite/60">Mensagem</label>
            <textarea name="mensagem" rows={4} maxLength={1000} className={field} placeholder="Conte brevemente sobre sua demanda…" />
            {errors.mensagem && <p className="text-destructive-foreground text-sm mt-1 bg-destructive/20 px-2 py-0.5">{errors.mensagem}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-3 bg-charcoal text-offwhite px-8 py-4 label-caps hover:bg-offwhite hover:text-charcoal transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar mensagem"} <span aria-hidden>→</span>
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="label-caps hover-underline text-offwhite"
            >
              ou falar direto no WhatsApp
            </a>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
