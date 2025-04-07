
import { ChatChoice } from '@/components/chat/chatFlowConfig';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  choices?: ChatChoice[];
}

export interface ChatMetrics {
  responseTime: number;
  sessionDuration: number;
  messageCount: number;
}
