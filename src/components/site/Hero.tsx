import portrait from "@/assets/portrait.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="relative pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden">
      {/* decorative side label */}
      <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left">
        <span className="label-caps text-foreground/50">Edição 01 — Direito Digital · 2026</span>
      </div>

      <div className="container grid grid-cols-12 gap-6 md:gap-10 items-end">
        {/* LEFT — typography */}
        <div className="col-span-12 lg:col-span-7 relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-olive" />
            <span className="label-caps text-olive">Advocacia · Estratégia</span>
          </div>

          <h1 className="display text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[7.2rem] leading-[0.92]">
            Direito que <br />
            <span className="italic-serif text-olive">protege.</span>
            <br />
            Estratégia que <br />
            <span className="italic-serif text-olive">impulsiona.</span>
          </h1>

          <p className="mt-10 max-w-md text-foreground/70 text-base md:text-lg">
            Estrutura jurídica estratégica para empresas e profissionais que vivem no digital.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="/agendar"
              className="inline-flex items-center gap-3 bg-charcoal text-offwhite px-8 py-4 label-caps hover:bg-olive transition-colors duration-300"
            >
              Agendar consulta
              <span aria-hidden>→</span>
            </a>
            <a href="#servicos" className="label-caps hover-underline text-foreground/80">
              Áreas de atuação
            </a>
          </div>
        </div>

        {/* RIGHT — editorial visual */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
            {/* Olive block behind */}
            <div className="absolute -top-6 -left-6 w-2/3 h-2/3 bg-olive z-0" />
            {/* Charcoal block bottom right */}
            <div className="absolute -bottom-6 -right-6 w-1/2 h-1/3 bg-charcoal z-0" />
            {/* Lilac thin accent */}
            <div className="absolute top-1/3 -right-3 w-2 h-32 bg-lilac z-10" />
            {/* Image */}
            <img
              src={portrait}
              alt="Retrato editorial da advogada Maria Paula Lino"
              width={896}
              height={1216}
              className="relative z-10 w-full h-full object-cover grayscale-[15%]"
            />
            {/* Rotating circle label */}
            <a href="/agendar" className="absolute -bottom-10 -left-10 w-32 h-32 z-20 hidden md:block hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 200 200" className="rotate-text w-full h-full">
                <defs>
                  <path id="circ" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                </defs>
                <circle cx="100" cy="100" r="96" fill="hsl(var(--charcoal))" />
                <text fill="hsl(var(--offwhite))" fontSize="14" letterSpacing="6" fontFamily="DM Sans">
                  <textPath href="#circ">
                    AGENDAR CONSULTA · MARIA PAULA LINO ·
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gold text-2xl">→</span>
              </div>
            </a>
            {/* Tag */}
            <div className="absolute -top-3 right-0 z-20 bg-offwhite border border-foreground/15 px-3 py-1.5">
              <span className="label-caps text-foreground/70">OAB · Brasil</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
