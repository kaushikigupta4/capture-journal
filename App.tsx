
import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { supabase } from './services/supabase';
import { User, JournalEntry, Theme } from './types';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import JournalEditor from './components/JournalEditor';
import JournalCard from './components/JournalCard';
import { Plus, LayoutGrid, List, Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>();
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('lumina_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.user_metadata?.name 
        });
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.user_metadata?.name 
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await storage.getEntries(user.id);
      setEntries(data);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lumina_theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    const saved = await storage.saveEntry(entry);
    if (saved) {
      await loadEntries();
      setIsEditorOpen(false);
      setEditingEntry(undefined);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    // Explicit browser confirmation
    const confirmed = window.confirm('Are you sure you want to delete this memory? This action cannot be undone.');
    
    if (confirmed) {
      // Optimistic Update: Remove from UI immediately for better UX
      const originalEntries = [...entries];
      setEntries(prev => prev.filter(e => e.id !== id));
      
      try {
        const success = await storage.deleteEntry(id);
        if (!success) {
          throw new Error("Delete operation failed on server.");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Sorry, we couldn't delete this entry. Please try again.");
        // Rollback on failure
        setEntries(originalEntries);
      }
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-400" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Auth theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <Navbar user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Journal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              You have {entries.length} memories captured.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-400 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <button 
              onClick={() => setIsEditorOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-400 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-400/25 transition-all active:scale-95"
            >
              <Plus size={20} />
              New Entry
            </button>
          </div>
        </header>

        {isLoading && entries.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-400" size={32} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-brand-400 dark:text-brand-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No entries yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
              Start documenting your life. Every moment is worth remembering.
            </p>
            <button 
              onClick={() => setIsEditorOpen(true)}
              className="px-8 py-3 bg-brand-400 text-white rounded-xl font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-400/20"
            >
              Write First Entry
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
            : "flex flex-col gap-6"
          }>
            {entries.map(entry => (
              <JournalCard 
                key={entry.id} 
                entry={entry} 
                viewMode={viewMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isEditorOpen && (
        <JournalEditor 
          user={user}
          entry={editingEntry}
          onSave={handleSaveEntry}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingEntry(undefined);
          }}
        />
      )}
    </div>
  );
};

export default App;
