const WHATSAPP = "5564999998533";

const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá Maria Paula, gostaria de uma consulta.")}`}
    target="_blank"
    rel="noreferrer"
    aria-label="Falar no WhatsApp"
    className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-olive text-offwhite pl-4 pr-5 py-3 shadow-[0_8px_30px_-10px_hsl(var(--olive)/0.6)] hover:bg-charcoal transition-colors duration-300"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.11 17.21c-.27-.13-1.62-.8-1.87-.89-.25-.09-.43-.13-.62.13-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.2-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.41.12-.55.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.62-1.49-.85-2.05-.22-.54-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.67 1.13 2.85.13.18 1.95 2.97 4.72 4.16.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.13-.25-.2-.52-.33zM12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.74 1.5 5.27L2 22l4.84-1.46A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
    <span className="label-caps hidden sm:inline">WhatsApp</span>
  </a>
);

export default FloatingWhatsApp;
