
import React, { useState, useRef } from 'react';
import { User, JournalEntry, AIAnalysis } from '../types';
import { X, Sparkles, Save, Trash2, Calendar, Upload, Smile, Meh, Frown, Zap, AlertCircle, Flame } from 'lucide-react';
import { analyzeEntry } from '../services/gemini';

interface JournalEditorProps {
  user: User;
  entry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { label: 'Happy', emoji: '😊', icon: Smile, color: 'text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20' },
  { label: 'Neutral', emoji: '😐', icon: Meh, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/20' },
  { label: 'Sad', emoji: '😔', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Inspired', emoji: '🤩', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Anxious', emoji: '😰', icon: AlertCircle, color: 'text-brand-300', bg: 'bg-brand-50/50 dark:bg-brand-900/20' },
  { label: 'Angry', emoji: '😡', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

const JournalEditor: React.FC<JournalEditorProps> = ({ user, entry, onSave, onClose }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [date, setDate] = useState(entry?.created_at ? new Date(entry.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string | undefined>(entry?.image_url);
  const [selectedMood, setSelectedMood] = useState<string | undefined>(entry?.mood);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | undefined>(entry?.sentiment);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const runAIAnalysis = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeEntry(content);
      setAiAnalysis(result);
      const foundMood = MOOD_OPTIONS.find(m => m.label.toLowerCase() === result.mood.toLowerCase());
      if (foundMood) {
        setSelectedMood(foundMood.label);
      } else {
        setSelectedMood(result.mood);
      }
      if (!title) setTitle(result.summary.substring(0, 50));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const newEntry: JournalEntry = {
      id: entry?.id || crypto.randomUUID(),
      user_id: user.id,
      title,
      content,
      mood: selectedMood,
      image_url: image,
      sentiment: aiAnalysis,
      created_at: entry?.created_at || new Date(date).toISOString()
    };
    onSave(newEntry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md transition-all">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl h-full sm:h-auto sm:max-h-[95vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-400 dark:text-brand-300 rounded-lg">
              <Calendar size={20} />
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-0 p-0"
            />
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mood Tracker</label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = mood.icon;
                const isActive = selectedMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(isActive ? undefined : mood.label)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      isActive 
                        ? `${mood.bg} ${mood.color} border-current shadow-sm scale-105` 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-brand-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-bold">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Title of your story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl md:text-4xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white p-0"
            />
            <div className="flex flex-wrap gap-2 min-h-[24px]">
              {aiAnalysis?.tags?.map(tag => (
                <span key={tag} className="px-3 py-0.5 bg-brand-50 dark:bg-brand-900/20 text-brand-400 dark:text-brand-300 text-[10px] font-bold rounded-full border border-brand-100 dark:border-brand-800 uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Tell your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[300px] bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed p-0"
          />

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl transition-all border-2 border-dashed ${
              image ? 'border-transparent' : 
              isDragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 
              'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30'
            }`}
          >
            {image ? (
              <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                <img src={image} alt="Preview" className="w-full h-auto max-h-[500px] object-contain bg-slate-100 dark:bg-slate-900" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform"
                    title="Change Image"
                  >
                    <Upload size={20} />
                  </button>
                  <button 
                    onClick={() => setImage(undefined)}
                    className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
                    title="Remove Image"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 dark:text-slate-200 font-bold text-sm">Add a photo to your memory</p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs">Click to upload or drag & drop</p>
                </div>
              </button>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={runAIAnalysis}
            disabled={isAnalyzing || !content.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${
              isAnalyzing 
                ? 'bg-brand-50 text-brand-300 animate-pulse' 
                : 'bg-white dark:bg-slate-800 text-brand-400 dark:text-brand-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400'
            }`}
          >
            <Sparkles size={18} />
            {isAnalyzing ? 'Analyzing Story...' : 'Get AI Insights'}
          </button>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
            <button 
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-brand-400 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-400/25 active:scale-95"
            >
              <Save size={20} />
              Save Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;
