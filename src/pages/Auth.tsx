import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Scissors } from "lucide-react";

const Auth = () => {
  const { tipo } = useParams<{ tipo: "cliente" | "barbeiro" }>();
  const role = tipo === "barbeiro" ? "barbeiro" : "cliente";
  const navigate = useNavigate();
  const { user, role: currentRole } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && currentRole) {
      navigate(currentRole === "barbeiro" ? "/barbeiro" : "/");
    }
  }, [user, currentRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (role === "barbeiro") {
          toast.error("Cadastro de barbeiro indisponível. Contate o administrador.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name, phone, role: "cliente" },
          },
        });
        if (error) throw error;
        toast.success("Cadastro realizado!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Scissors className="w-6 h-6 text-primary" />
        <span className="text-2xl font-heading font-semibold text-primary">BarberKing</span>
      </Link>
      <div className="w-full max-w-md p-8 rounded-xl bg-card border border-border">
        <h1 className="text-2xl font-heading font-semibold text-center mb-2">
          {role === "barbeiro" ? "Acesso Barbeiro" : "Área do Cliente"}
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && role === "cliente" && (
            <>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone / WhatsApp" maxLength={20}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
            </>
          )}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" minLength={6}
            className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" />

          <button type="submit" disabled={loading}
            className="w-full py-3 gold-gradient text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50">
            {loading ? "..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        {role === "cliente" && (
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-primary">
            {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        )}

        <div className="mt-6 pt-6 border-t border-border text-center text-sm">
          {role === "cliente" ? (
            <Link to="/auth/barbeiro" className="text-primary hover:underline">Sou barbeiro</Link>
          ) : (
            <Link to="/auth/cliente" className="text-primary hover:underline">Sou cliente</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
