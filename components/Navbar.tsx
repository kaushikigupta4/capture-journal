
import React from 'react';
import { User, Theme } from '../types';
import { LogOut, Sun, Moon, BookOpen } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, theme, toggleTheme }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4">
      <div className="max-w-6xl mx-auto h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-brand-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-400/30 group-hover:scale-105 transition-transform duration-300">
            <BookOpen size={24} />
          </div>
          <span className="text-2xl font-black bg-gradient-to-br from-slate-900 via-brand-400 to-brand-600 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent tracking-tight">
            Capture
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative group"
          >
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">{user.email}</span>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-bold text-sm"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
