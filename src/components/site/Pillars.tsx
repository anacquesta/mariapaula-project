import { useReveal } from "@/hooks/use-reveal";

const pillars = [
  {
    n: "01",
    title: "Estratégia",
    desc: "Decisões jurídicas que servem ao negócio. Cada cláusula com propósito e cada movimento com intenção.",
  },
  {
    n: "02",
    title: "Segurança Jurídica",
    desc: "Estruturas sólidas que reduzem risco, protegem dados e blindam operações em ambientes digitais.",
  },
  {
    n: "03",
    title: "Performance Digital",
    desc: "Compliance que acompanha a velocidade do digital — sem fricção, sem improviso, sem ruído.",
  },
];

const Pillars = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-charcoal text-offwhite py-10 md:py-12 border-y border-offwhite/10">
      <div ref={ref} className="container reveal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start">
          {/* Label Section */}
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="label-caps text-gold text-xs tracking-widest whitespace-nowrap">O que eu faço</span>
          </div>

          {/* Pillars Grid */}
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {pillars.map((p) => (
              <article key={p.n} className="space-y-4">
                <div className="label-caps text-gold text-[10px] tracking-[0.2em]">
                  {p.n}. {p.title.toUpperCase()}
                </div>
                <p className="text-offwhite/60 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pillars;
