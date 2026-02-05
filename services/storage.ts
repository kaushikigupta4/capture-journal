
import { JournalEntry } from '../types';
import { supabase } from './supabase';

export const storage = {
  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return [];
    }
    return data || [];
  },

  saveEntry: async (entry: JournalEntry): Promise<JournalEntry | null> => {
    const payload = {
      ...entry,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving entry:', error);
      return null;
    }
    return data;
  },

  deleteEntry: async (entryId: string): Promise<boolean> => {
    if (!entryId) return false;
    
    const { error, count } = await supabase
      .from('journal_entries')
      .delete({ count: 'exact' })
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
    
    return true;
  }
};
