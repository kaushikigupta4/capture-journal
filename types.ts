
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  image_url?: string;
  sentiment?: AIAnalysis;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export type Theme = 'light' | 'dark';

export interface AIAnalysis {
  mood: string;
  tags: string[];
  summary: string;
}
