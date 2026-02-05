
import React from 'react';
import { JournalEntry } from '../types';
import { Edit2, Trash2, Calendar, Hash } from 'lucide-react';

interface JournalCardProps {
  entry: JournalEntry;
  viewMode: 'grid' | 'list';
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry, viewMode, onEdit, onDelete }) => {
  const isList = viewMode === 'list';

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(entry);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (entry.id) {
      onDelete(entry.id);
    }
  };

  return (
    <div className={`group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex ${isList ? 'flex-row items-center h-32 md:h-40' : 'flex-col h-[400px]'}`}>
      {entry.image_url && (
        <div className={`${isList ? 'w-32 md:w-48 h-full shrink-0' : 'w-full h-44'} overflow-hidden`}>
          <img src={entry.image_url} alt={entry.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
      )}
      
      <div className={`flex-1 p-5 flex flex-col justify-between overflow-hidden`}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Calendar size={14} />
                {entry.created_at && new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              {(entry.mood || entry.sentiment?.mood) && (
                <div className="flex">
                  <span className="px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-400 dark:text-brand-300 rounded-full text-[10px] font-black uppercase tracking-tighter border border-brand-100 dark:border-brand-800">
                    {entry.mood || entry.sentiment?.mood}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleEditClick}
                className="p-2.5 text-brand-500 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 rounded-xl transition-all hover:bg-brand-100 dark:hover:bg-brand-900/50 hover:scale-110 active:scale-90 shadow-sm cursor-pointer z-10"
                title="Edit Entry"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={handleDeleteClick}
                className="p-2.5 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 rounded-xl transition-all hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:scale-110 active:scale-90 shadow-sm cursor-pointer z-10"
                title="Delete Entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight group-hover:text-brand-400 transition-colors">
            {entry.title}
          </h3>
          
          <p className={`text-slate-600 dark:text-slate-400 text-sm ${isList ? 'line-clamp-2' : 'line-clamp-4'} leading-relaxed`}>
            {entry.content}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {entry.sentiment?.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 dark:bg-slate-700/50 text-brand-400 dark:text-brand-300 text-[10px] font-semibold rounded-md uppercase tracking-tight">
              <Hash size={10} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalCard;
