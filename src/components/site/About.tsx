import portrait from "@/assets/portrait2.jpg";
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

const About = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="sobre" className="py-12 md:py-20 bg-background">
      <div ref={ref} className="container reveal grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-stretch">
        
        {/* Left Column: Vision & Signature */}
        <div className="md:col-span-4 flex flex-col justify-between space-y-12 py-4">
          <div className="space-y-8">
            <h2 className="serif text-5xl md:text-6xl lg:text-7xl leading-none text-charcoal">
              SIMPLES. <br />
              OBJETIVO. <br />
              <span className="italic">IMPACTANTE.</span>
            </h2>
            <p className="text-foreground/70 leading-relaxed text-sm max-w-sm">
              Sou a Dra. Maria Paula Lino, advogada especialista em Direito Digital, LGPD, Contratos e Compliance. Atuo para empresas e profissionais que buscam estrutura jurídica estratégica antes da crise, não depois.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm max-w-sm">
              Co-autora do livro "Compliance, LGPD e ESG", professora convidada na pós-graduação da PUC-GO e Diretora na MILA (Movimiento por la Integridad en Latinoamérica). Sou formada pelo Mackenzie, com pesquisa publicada em Coimbra e pós-graduação pela PUCRS e especialização pela LEC.
            </p>
            <p className="text-foreground/70 leading-relaxed text-sm max-w-sm">
              Acredito em um jurídico mais próximo e sem complicação. Para mim, o Direito deve servir para facilitar a vida, resolver problemas e colocar as coisas no lugar certo.
            </p>
          </div>
          
          <div className="pt-8">
             <span className="serif italic text-3xl text-olive block">Maria Paula Lino</span>
             <div className="label-caps text-[10px] text-foreground/40 mt-2 tracking-widest">ADVOGADA & ESTRATEGISTA DIGITAL</div>
          </div>
        </div>

        {/* Middle Column: Portrait */}
        <div className="md:col-span-5 h-full">
          <div className="relative h-full w-full grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden min-h-[500px]">
            <img
              src={portrait}
              alt="Maria Paula Lino"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Testimonials */}
        <div className="md:col-span-3 space-y-10 py-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-charcoal" />
            <span className="label-caps text-charcoal text-xs tracking-widest">Depoimentos</span>
          </div>
          
          <div className="space-y-12">
            {quotes.map((t, i) => (
              <figure key={i} className="space-y-4">
                <span className="serif text-4xl text-olive leading-none block">“</span>
                <blockquote className="text-foreground/80 text-sm leading-relaxed italic">
                  {t.q}
                </blockquote>
                <figcaption className="pt-4 border-t border-foreground/10">
                  <div className="label-caps text-[10px] tracking-widest">{t.a}</div>
                  <div className="text-foreground/40 text-[9px] mt-1 tracking-widest uppercase">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
