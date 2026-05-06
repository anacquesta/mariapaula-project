import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";
import project4 from "@/assets/project-4.png";
import project5 from "@/assets/project-5.png";
import project6 from "@/assets/project-6.png";
import { useReveal } from "@/hooks/use-reveal";

const featuredAreas = [
  {
    n: "01",
    title: "CONTRATOS",
    subtitle: "Estruturação Jurídica",
    img: project1,
  },
  {
    n: "02",
    title: "LGPD & COMPLIANCE",
    subtitle: "Governança de Dados",
    img: project2,
  },
  {
    n: "03",
    title: "DIREITO DIGITAL",
    subtitle: "Plataformas & E-commerce",
    img: project3,
  },
  {
    n: "04",
    title: "CONSUMIDOR",
    subtitle: "Defesa & Relações de Consumo",
    img: project4,
  },
  {
    n: "05",
    title: "OBRIGAÇÕES CIVIS",
    subtitle: "Execução de Contratos, Cobrança & Responsabilidade Civil",
    img: project6,
  },
  {
    n: "06",
    title: "REGISTRO DE MARCA",
    subtitle: "Proteção de Ativos",
    img: project5,
  },
];

const Areas = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="servicos" className="py-12 md:py-20 bg-offwhite">
      <div ref={ref} className="container reveal grid md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Title & Link */}
        <div className="md:col-span-3 flex flex-col justify-between h-full py-2">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-charcoal" />
              <span className="label-caps text-charcoal text-xs tracking-widest">Áreas em destaque</span>
            </div>
            <h2 className="serif text-4xl md:text-5xl leading-tight text-charcoal">
              DIREITO <br />
              <span className="italic">EM FOCO</span>
            </h2>
          </div>
          
          <div className="mt-20">
            <a 
              href="#contato" 
              className="group flex items-center gap-2 label-caps text-[10px] tracking-widest text-charcoal hover:text-olive transition-colors border-b border-charcoal/20 pb-1 w-fit"
            >
              VER TODOS
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Right Column: Projects Grid */}
        <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAreas.map((area) => (
            <article key={area.title} className="group space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={area.img} 
                  alt={area.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1">
                <h3 className="serif text-xl tracking-tight text-charcoal">{area.title}</h3>
                <p className="label-caps text-[9px] text-charcoal/50 tracking-[0.2em]">{area.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Areas;
