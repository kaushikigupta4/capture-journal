
import React, { useState } from 'react';
import { Theme } from '../types';
import { supabase } from '../services/supabase';
import { Mail, Lock, User as UserIcon, ArrowRight, Sun, Moon, BookOpen, Loader2 } from 'lucide-react';

interface AuthProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Auth: React.FC<AuthProps> = ({ theme, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        if (!name) throw new Error('Please enter your name.');
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      
      <div className="hidden lg:flex flex-1 relative bg-brand-400 items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,187,222,0.3),transparent)] opacity-50"></div>
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/20">
            <BookOpen size={40} />
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight">Capture your world.</h2>
          <p className="text-brand-50 text-xl font-medium leading-relaxed opacity-90">
            Capture is your private space for daily reflections, powered by AI to help you find meaning in every moment.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 relative">
        <button 
          onClick={toggleTheme}
          className="absolute top-8 right-8 p-3 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all shadow-sm border border-slate-200 dark:border-slate-800"
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </button>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden w-14 h-14 bg-brand-400 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-brand-400/20">
              <BookOpen size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLogin ? 'Welcome back' : 'Start your story'}
            </h1>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all dark:text-white"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <div className="text-sm font-bold text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</div>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-400 hover:bg-brand-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-brand-400/30 flex items-center justify-center gap-3 active:scale-[0.98] mt-2 group disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign in' : 'Sign up')}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsLogin(!isLogin)} className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-brand-400 transition-colors">
                {isLogin ? "New to Capture? Join now" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
