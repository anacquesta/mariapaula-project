import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login realizado com sucesso");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="serif text-3xl tracking-tight text-offwhite uppercase">
            MARIA PAULA <span className="italic text-gold">LINO</span>
          </div>
          <div className="label-caps text-[10px] tracking-[0.3em] text-gold/60">
            PAINEL ADMINISTRATIVO
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="label-caps text-[10px] text-offwhite/50 tracking-widest ml-1">E-MAIL</label>
            <Input
              type="email"
              placeholder="admin@mariapaulalino.adv"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-offwhite/10 text-offwhite h-12 focus:border-gold/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="label-caps text-[10px] text-offwhite/50 tracking-widest">SENHA</label>
              <button 
                type="button"
                onClick={() => navigate("/admin/recuperar-senha")}
                className="text-[9px] text-gold/50 hover:text-gold transition-colors tracking-widest uppercase"
              >
                Esqueceu a senha?
              </button>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-offwhite/10 text-offwhite h-12 focus:border-gold/50 transition-colors"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gold hover:bg-gold/80 text-charcoal font-bold tracking-widest label-caps transition-all"
          >
            {loading ? "AUTENTICANDO..." : "ENTRAR NO PAINEL"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-[10px] text-offwhite/30 hover:text-offwhite transition-colors tracking-[0.2em] uppercase"
          >
            ← Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
