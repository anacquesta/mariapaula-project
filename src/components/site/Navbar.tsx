import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contato", label: "Contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-foreground/10" : "bg-transparent"
        }`}
    >
      <nav className="container flex items-center justify-between py-5">
        <a href="/" className="serif text-xl md:text-2xl tracking-tight">
          Maria Paula <span className="italic-serif text-olive">Lino</span>
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="label-caps hover-underline text-foreground/80 hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/agendar"
          className="hidden md:inline-flex items-center gap-2 bg-charcoal text-offwhite px-5 py-2.5 label-caps hover:bg-olive transition-colors duration-300"
        >
          Agendar consulta →
        </a>

        <button
          aria-label="Menu"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-background border-t border-foreground/10">
          <ul className="container py-6 flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="label-caps">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contato" onClick={() => setOpen(false)} className="inline-block bg-charcoal text-offwhite px-5 py-3 label-caps">
                Fale comigo →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
