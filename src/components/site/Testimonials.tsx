import { useReveal } from "@/hooks/use-reveal";

const quotes = [
  {
    q: "Trouxe clareza para um terreno que parecia complexo. Nossa operação ficou mais leve e mais segura.",
    a: "Camila R.",
    r: "Founder · SaaS B2B",
  },
  {
    q: "Atendimento estratégico, sem juridiquês. Sentimos que tínhamos uma sócia jurídica, não uma fornecedora.",
    a: "Rafael M.",
    r: "CEO · E-commerce",
  },
  {
    q: "A adequação à LGPD virou parte da nossa cultura. Recomendo sem hesitar.",
    a: "Juliana T.",
    r: "Head Jurídico · Healthtech",
  },
];

const Testimonials = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 md:py-32">
      <div ref={ref} className="container reveal">
        <div className="flex items-center gap-3 mb-12">
          <span className="h-px w-12 bg-olive" />
          <span className="label-caps text-olive">Prova social</span>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {quotes.map((t, i) => (
            <figure key={i} className="space-y-6">
              <span className="serif text-7xl text-olive leading-none block">“</span>
              <blockquote className="serif text-2xl md:text-3xl leading-snug">
                {t.q}
              </blockquote>
              <figcaption className="pt-4 border-t border-foreground/15">
                <div className="label-caps">{t.a}</div>
                <div className="text-foreground/60 text-sm mt-1">{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
