import { useState } from "react";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";
import project4 from "@/assets/project-4.png";
import project5 from "@/assets/project-5.png";
import project6 from "@/assets/project-6.png";
import { useReveal } from "@/hooks/use-reveal";
import { ChevronDown, ChevronUp } from "lucide-react";

const featuredAreas = [
  {
    id: "digital",
    title: "DIREITO DIGITAL",
    img: project3,
    services: [
      "Golpe do PIX",
      "Fraudes bancárias digitais",
      "Contas hackeadas",
      "Banimento indevido de contas",
      "Clonagem de WhatsApp",
      "Remoção de perfis falsos",
      "Vazamento de dados",
      "Contratos digitais",
      "Termos de uso e políticas de privacidade",
      "Consultoria para e-commerce e plataformas digitais"
    ]
  },
  {
    id: "contratos",
    title: "CONTRATOS",
    img: project1,
    services: [
      "Elaboração, Revisão e Negociação contratual",
      "Contratos de prestação de serviços",
      "Contratos digitais",
      "NDA e confidencialidade",
      "Aditivos e distratos"
    ]
  },
  {
    id: "compliance",
    title: "COMPLIANCE E LGPD",
    img: project2,
    services: [
      "Adequação à LGPD",
      "Políticas de privacidade",
      "Mapeamento de dados",
      "Adequação contratual",
      "Gestão de incidentes",
      "Compliance empresarial",
      "Código de conduta",
      "Canal de denúncias",
      "Treinamentos corporativos"
    ]
  },
  {
    id: "consumidor",
    title: "DIREITO DO CONSUMIDOR",
    img: project4,
    services: [
      "Ações consumeristas",
      "Problemas com companhias aéreas e voos",
      "Problemas com planos de saúde e negativas de cobertura",
      "Juros abusivos",
      "Problemas com produtos e serviços",
      "Demandas no PROCON"
    ]
  },
  {
    id: "civeis",
    title: "OBRIGAÇÕES CÍVEIS",
    img: project6,
    services: [
      "Cobranças judiciais e extrajudiciais",
      "Notificações extrajudiciais",
      "Descumprimento contratual",
      "Indenizações por danos morais e materiais",
      "Responsabilidade civil",
      "Obrigações de fazer e não fazer",
      "Acordos e Resolução de Conflito"
    ]
  },
  {
    id: "marca",
    title: "REGISTRO DE MARCA",
    img: project5,
    services: [
      "Registro de marca no INPI",
      "Pesquisa de viabilidade de marca",
      "Defesa de marca",
      "Renovação de marca",
      "Proteção de identidade visual",
      "Propriedade intelectual",
      "Monitoramento de marca"
    ]
  },
];

const Areas = () => {
  const ref = useReveal<HTMLDivElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="servicos" className="py-12 md:pt-20 md:pb-12 bg-offwhite">
      <div ref={ref} className="container reveal grid md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Title & Link */}
        <div className="md:col-span-3 flex flex-col items-center text-center md:items-start md:text-left justify-between h-full py-2">
          <div>
            <div className="flex items-center justify-start gap-3 mb-6 w-full">
              <span className="h-px w-8 bg-charcoal" />
              <span className="label-caps text-charcoal text-xs tracking-widest">Áreas em destaque</span>
            </div>
            <h2 className="serif text-4xl md:text-5xl leading-tight text-charcoal uppercase">
              DIREITO <br />
              <span className="italic">EM FOCO</span>
            </h2>
          </div>
        </div>

        {/* Right Column: Projects Grid */}
        <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
          {featuredAreas.map((area) => (
            <article key={area.id} className="group space-y-4 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={area.img} 
                  alt={area.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <h3 className="serif text-xl tracking-tight text-charcoal leading-tight">{area.title}</h3>
                
                <button 
                  onClick={() => toggleExpand(area.id)}
                  className="flex items-center justify-center md:justify-start gap-2 text-[10px] label-caps tracking-[0.2em] text-charcoal/40 hover:text-charcoal transition-colors group/btn"
                >
                  {expandedId === area.id ? (
                    <>RECOLHER ESPECIALIDADES <ChevronUp size={14} className="text-olive" /></>
                  ) : (
                    <>CONHECER ESPECIALIDADES <ChevronDown size={14} className="text-olive" /></>
                  )}
                </button>

                <div 
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${expandedId === area.id ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}
                  `}
                >
                  <ul className="space-y-2 py-4 border-t border-charcoal/5">
                    {area.services.map((service, index) => (
                      <li key={index} className="text-[11px] text-charcoal/70 leading-relaxed flex items-start justify-center md:justify-start gap-2">
                        <span className="text-olive">—</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Areas;
