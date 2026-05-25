import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { 
  Calendar, 
  List, 
  LogOut, 
  CalendarClock, 
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate("/admin/login");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return null;
  if (!session) return null;

  const menuItems = [
    { label: "Agendamentos", path: "/admin", icon: List },
    { label: "Disponibilidade", path: "/admin/disponibilidade", icon: CalendarClock },
  ];

  return (
    <div className="min-h-screen bg-offwhite flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-charcoal text-offwhite p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="serif text-lg">MP <span className="text-gold italic">Lino</span></div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-0 z-40 bg-charcoal text-offwhite w-full md:w-64 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        transition-transform duration-300 ease-in-out flex flex-col
      `}>
        <div className="p-8 hidden md:block">
          <div className="serif text-xl tracking-tight uppercase">
            MARIA PAULA <span className="italic text-gold">LINO</span>
          </div>
          <div className="label-caps text-[9px] tracking-[0.2em] text-gold/60 mt-2">
            ADMINISTRAÇÃO
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 md:py-0 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-sm transition-all
                  ${isActive ? "bg-gold text-charcoal font-bold" : "text-offwhite/50 hover:bg-offwhite/5 hover:text-offwhite"}
                `}
              >
                <Icon size={18} />
                <span className="label-caps text-[11px] tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-offwhite/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] text-offwhite/40 truncate">{session.user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-sm transition-all"
          >
            <LogOut size={18} />
            <span className="label-caps text-[11px] tracking-widest">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
