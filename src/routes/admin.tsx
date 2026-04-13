import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Users, FileText, LogOut, Eye, ChevronDown, ChevronUp, Image, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "لوحة الإدارة" },
      { name: "description", content: "لوحة التحكم للمسؤول" },
    ],
  }),
});

interface Submission {
  id: string;
  user_id: string;
  name: string;
  age: string;
  city: string;
  district: string;
  snapchat: string;
  orientation: string;
  image_url: string | null;
  peek_feedback: Record<string, { rating: number; comment: string }>;
  created_at: string;
}

function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalSubmissions: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate({ to: "/login" });
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [subsRes, profilesRes] = await Promise.all([
      supabase.from('submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact' }),
    ]);

    if (subsRes.data) setSubmissions(subsRes.data as Submission[]);
    setStats({
      totalUsers: profilesRes.count || 0,
      totalSubmissions: subsRes.data?.length || 0,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">جاري التحميل...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-violet-600 to-indigo-700 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">لوحة الإدارة</h1>
              <p className="text-violet-200 text-xs">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-zinc-400 text-xs">المستخدمين</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-400 text-xs">النماذج المقدمة</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
          </motion.div>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            جميع النماذج المقدمة
          </h2>

          {submissions.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
              لا توجد نماذج مقدمة حتى الآن
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, idx) => (
                <motion.div
                  key={sub.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                    className="w-full p-4 flex items-center justify-between text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 font-bold text-sm">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{sub.name}</p>
                        <p className="text-zinc-500 text-xs">{sub.city} • {new Date(sub.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                    {expandedId === sub.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </button>

                  {expandedId === sub.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <InfoItem label="الاسم" value={sub.name} />
                        <InfoItem label="العمر" value={sub.age} />
                        <InfoItem label="المدينة" value={sub.city} />
                        <InfoItem label="الحي" value={sub.district} />
                        <InfoItem label="سناب شات" value={sub.snapchat} />
                        <InfoItem label="الميول" value={sub.orientation} />
                      </div>

                      {sub.image_url && (
                        <div className="mt-3">
                          <p className="text-zinc-400 text-xs mb-2 flex items-center gap-1">
                            <Image className="w-3 h-3" /> الصورة المرفقة
                          </p>
                          <img src={sub.image_url} alt="مرفق" className="w-32 h-32 object-cover rounded-xl border border-zinc-700" />
                        </div>
                      )}

                      {sub.peek_feedback && Object.keys(sub.peek_feedback).length > 0 && (
                        <div className="mt-3">
                          <p className="text-zinc-400 text-xs mb-2 flex items-center gap-1">
                            <Star className="w-3 h-3" /> تقييمات النظرة الخاطفة
                          </p>
                          <div className="space-y-2">
                            {Object.entries(sub.peek_feedback).map(([key, val]) => (
                              <div key={key} className="bg-zinc-800 rounded-xl p-3 text-xs">
                                <span className="text-amber-400">المقطع {parseInt(key) + 1}</span>
                                <span className="text-zinc-500 mx-2">•</span>
                                <span>تقييم: {val.rating}/10</span>
                                {val.comment && <p className="text-zinc-400 mt-1">{val.comment}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-800 rounded-xl p-3">
      <p className="text-zinc-500 text-[10px] font-bold mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
