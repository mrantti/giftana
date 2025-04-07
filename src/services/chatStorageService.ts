
import { Message, ChatMetrics } from '@/types/chat';

// Local storage keys
const CHATS_STORAGE_KEY = 'perfectgift_chats';
const CURRENT_CHAT_KEY = 'perfectgift_current_chat';

export interface StoredChat {
  id: string;
  title: string;
  messages: Message[];
  metrics: ChatMetrics;
  createdAt: string;
  updatedAt: string;
  persona: string;
}

class ChatStorageService {
  // Load all saved chats from localStorage
  getAllChats(): StoredChat[] {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!storedChats) return [];
    
    try {
      return JSON.parse(storedChats);
    } catch (error) {
      console.error('Error parsing stored chats:', error);
      return [];
    }
  }
  
  // Get a specific chat by ID
  getChatById(chatId: string): StoredChat | null {
    const chats = this.getAllChats();
    return chats.find(chat => chat.id === chatId) || null;
  }
  
  // Get current active chat
  getCurrentChat(): StoredChat | null {
    const currentChatId = localStorage.getItem(CURRENT_CHAT_KEY);
    if (!currentChatId) return null;
    
    return this.getChatById(currentChatId);
  }
  
  // Set current active chat
  setCurrentChat(chatId: string): void {
    localStorage.setItem(CURRENT_CHAT_KEY, chatId);
  }
  
  // Save a new chat or update existing one
  saveChat(chat: StoredChat): void {
    const chats = this.getAllChats();
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      // Update existing chat
      chats[existingIndex] = {
        ...chat,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new chat
      chats.push({
        ...chat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  }
  
  // Create a new chat
  createChat(initialMessages: Message[], title = 'New Conversation'): StoredChat {
    const newChat: StoredChat = {
      id: Date.now().toString(),
      title,
      messages: initialMessages,
      metrics: {
        responseTime: 0,
        sessionDuration: 0,
        messageCount: initialMessages.length
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      persona: 'unknown'
    };
    
    // Save the new chat
    const chats = this.getAllChats();
    chats.push(newChat);
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    
    // Set as current chat
    this.setCurrentChat(newChat.id);
    
    return newChat;
  }
  
  // Delete a chat by ID
  deleteChat(chatId: string): boolean {
    const chats = this.getAllChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    if (filteredChats.length === chats.length) {
      // Chat not found
      return false;
    }
    
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(filteredChats));
    
    // If deleted chat was current, clear current chat
    const currentChatId = localStorage.getItem(CURRENT_CHAT_KEY);
    if (currentChatId === chatId) {
      localStorage.removeItem(CURRENT_CHAT_KEY);
    }
    
    return true;
  }
  
  // Update messages for current chat
  updateCurrentChatMessages(messages: Message[]): void {
    const currentChat = this.getCurrentChat();
    if (!currentChat) return;
    
    currentChat.messages = messages;
    currentChat.updatedAt = new Date().toISOString();
    
    this.saveChat(currentChat);
  }
  
  // Update metrics for current chat
  updateCurrentChatMetrics(metrics: ChatMetrics): void {
    const currentChat = this.getCurrentChat();
    if (!currentChat) return;
    
    currentChat.metrics = metrics;
    currentChat.updatedAt = new Date().toISOString();
    
    this.saveChat(currentChat);
  }
  
  // Update persona for current chat
  updateCurrentChatPersona(persona: string): void {
    const currentChat = this.getCurrentChat();
    if (!currentChat) return;
    
    currentChat.persona = persona;
    currentChat.updatedAt = new Date().toISOString();
    
    this.saveChat(currentChat);
  }
}

// Export as singleton
export const chatStorageService = new ChatStorageService();
