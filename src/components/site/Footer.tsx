import { Instagram, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-charcoal text-offwhite py-10 border-t border-offwhite/5">
    <div className="container grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">

      {/* Logo & Bio */}
      <div className="md:col-span-4 space-y-6">
        <div className="serif text-2xl tracking-tight">
          MARIA PAULA <span className="italic text-gold">LINO</span>
        </div>
        <p className="text-offwhite/50 text-xs leading-relaxed max-w-xs">
          Advocacia editorial e estratégica para negócios digitais. Unindo segurança jurídica e visão de negócio.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <a 
            href="https://www.instagram.com/mariapaulalino_adv/" 
            target="_blank" 
            rel="noreferrer" 
            className="text-offwhite/40 hover:text-gold transition-colors"
          >
            <Instagram size={18} />
          </a>
          <a 
            href="https://www.linkedin.com/in/maria-paula-lino-182ab329b/" 
            target="_blank" 
            rel="noreferrer" 
            className="text-offwhite/40 hover:text-gold transition-colors"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="md:col-span-2 space-y-6">
        <div className="label-caps text-[10px] tracking-[0.2em] text-gold">NAVEGAÇÃO</div>
        <ul className="space-y-3 text-[10px] tracking-widest text-offwhite/60">
          <li><a href="/" className="hover:text-offwhite transition-colors">INÍCIO</a></li>
          <li><a href="#sobre" className="hover:text-offwhite transition-colors">SOBRE</a></li>
          <li><a href="#servicos" className="hover:text-offwhite transition-colors">SERVIÇOS</a></li>
          <li><a href="#contato" className="hover:text-offwhite transition-colors">CONTATO</a></li>
        </ul>
      </div>

      {/* Services */}
      <div className="md:col-span-3 space-y-6">
        <div className="label-caps text-[10px] tracking-[0.2em] text-gold">SERVIÇOS</div>
        <ul className="space-y-3 text-[10px] tracking-widest text-offwhite/60 uppercase">
          <li>CONTRATOS ESTRATÉGICOS</li>
          <li>LGPD & COMPLIANCE</li>
          <li>DIREITO DIGITAL</li>
          <li>DIREITO DO CONSUMIDOR</li>
          <li>OBRIGAÇÕES CIVIS</li>
          <li>REGISTRO DE MARCA</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="md:col-span-3 space-y-6">
        <div className="label-caps text-[10px] tracking-[0.2em] text-gold">CONTATO</div>
        <ul className="space-y-3 text-[10px] tracking-widest text-offwhite/60">
          <li>MARIAPAULALINO.ADV@GMAIL.COM</li>
          <li>+55 (64) 99999-8533</li>
          <li>GOIÂNIA · GO | CAMPINAS · SP</li>
        </ul>
      </div>

    </div>

    <div className="container mt-20 pt-8 border-t border-offwhite/10 flex flex-col md:flex-row justify-between gap-4 label-caps text-[9px] tracking-[0.2em] text-offwhite/30">
      <span>© {new Date().getFullYear()} MARIA PAULA LINO — TODOS OS DIREITOS RESERVADOS</span>
      <span>DESENVOLVIDO POR <a href="https://carolgonzaga.site/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">CAROLGONZAGA</a></span>
    </div>
  </footer>
);

export default Footer;
