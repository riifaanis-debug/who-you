import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "تسجيل الدخول" },
      { name: "description", content: "تسجيل الدخول أو إنشاء حساب جديد" },
    ],
  }),
});

function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccessMessage("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Header */}
      <div className="relative w-full bg-gradient-to-bl from-sky-500 via-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute top-[-60px] left-[-60px] w-52 h-52 rounded-full bg-white/5 blur-sm" />
        <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/5 blur-sm" />

        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center mb-4 shadow-xl"
          >
            {isSignUp ? <UserPlus className="w-10 h-10 text-white" /> : <LogIn className="w-10 h-10 text-white" />}
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-1"
          >
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-100 text-sm"
          >
            {isSignUp ? "أنشئ حسابك للمتابعة" : "أدخل بياناتك للدخول"}
          </motion.p>
        </div>

        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,100 L0,100 Z" fill="#09090b" />
        </svg>
      </div>

      {/* Form */}
      <div className="flex-1 bg-zinc-950 flex items-start justify-center px-4 pt-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="text-emerald-400 text-xs bg-emerald-500/10 rounded-xl p-3">
                {successMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-zinc-400 text-xs font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                dir="ltr"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  dir="ltr"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-sky-500 to-blue-600 text-white font-bold rounded-xl py-3 hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : isSignUp ? "إنشاء الحساب" : "تسجيل الدخول"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccessMessage(""); }}
                className="text-blue-400 text-xs hover:underline"
              >
                {isSignUp ? "لديك حساب؟ سجل دخولك" : "ليس لديك حساب؟ أنشئ حساب جديد"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
