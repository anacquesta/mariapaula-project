import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Pillars from "@/components/site/Pillars";
import Areas from "@/components/site/Areas";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Maria Paula Lino — Direito Digital, LGPD & Contratos";
    const meta = document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute("content", "Advocacia editorial em Direito Digital, LGPD, contratos e compliance. Estratégia jurídica para empresas que vivem no digital.");
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Pillars />
      <Areas />
      <About />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
