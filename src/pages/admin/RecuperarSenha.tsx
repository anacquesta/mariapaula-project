import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;

      toast.success("Link de recuperação enviado para o seu e-mail");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao solicitar recuperação";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="serif text-3xl tracking-tight text-offwhite uppercase">
            RECUPERAÇÃO DE <span className="italic text-gold">ACESSO</span>
          </div>
          <p className="text-offwhite/50 text-xs leading-relaxed max-w-xs mx-auto">
            Informe seu e-mail administrativo para receber as instruções de redefinição de senha.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="label-caps text-[10px] text-offwhite/50 tracking-widest ml-1">E-MAIL CADASTRADO</label>
            <Input
              type="email"
              placeholder="admin@mariapaulalino.adv"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-offwhite/10 text-offwhite h-12 focus:border-gold/50 transition-colors"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gold hover:bg-gold/80 text-charcoal font-bold tracking-widest label-caps transition-all"
          >
            {loading ? "ENVIANDO LINK..." : "SOLICITAR ACESSO"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => navigate("/admin/login")}
            className="text-[10px] text-offwhite/30 hover:text-offwhite transition-colors tracking-[0.2em] uppercase"
          >
            ← Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
