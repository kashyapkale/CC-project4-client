export interface Lecture {
  lecture_id: string;
  title: string;
  notes?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface ApiResponse<T> {
  lectures?: T[];
  answer?: string;
} 