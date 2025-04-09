
import { Message, ChatMetrics } from '@/types/chat';
import { getWelcomeMessages } from '@/components/chat/chatFlowConfig';
import { chatStorageService } from './chatStorageService';

// Reduced latency for faster responses
const SERVICE_LATENCY = {
  respond: () => 100 + Math.random() * 100, // 100-200ms for faster responses
};

class ChatService {
  private metrics: ChatMetrics = {
    responseTime: 0,
    sessionDuration: 0,
    messageCount: 0
  };
  
  constructor() {
    this.initializeChat();
  }
  
  private initializeChat(): void {
    const currentChat = chatStorageService.getCurrentChat();
    
    if (currentChat) {
      this.metrics = currentChat.metrics;
    } else {
      chatStorageService.createChat(getWelcomeMessages());
    }
  }

  getInitialMessages(): Message[] {
    const currentChat = chatStorageService.getCurrentChat();
    
    if (currentChat && currentChat.messages.length > 0) {
      return currentChat.messages;
    }
    
    const welcomeMessages = getWelcomeMessages();
    const newChat = chatStorageService.createChat(welcomeMessages);
    return newChat.messages;
  }

  async processUserChoice(choiceText: string): Promise<Message> {
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: choiceText,
      type: 'user',
      timestamp: new Date()
    };
    
    this.trackResponseTime(startTime);
    
    const currentMessages = chatStorageService.getCurrentChat()?.messages || [];
    chatStorageService.updateCurrentChatMessages([...currentMessages, userMessage]);
    
    return userMessage;
  }

  async processBotResponse(message: string, choices?: any[]): Promise<Message> {
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: message,
      type: 'bot',
      timestamp: new Date(),
      choices: choices
    };
    
    this.trackResponseTime(startTime);
    
    const currentMessages = chatStorageService.getCurrentChat()?.messages || [];
    chatStorageService.updateCurrentChatMessages([...currentMessages, botMessage]);
    
    return botMessage;
  }

  async processUserInput(input: string): Promise<Message> {
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };
    
    this.trackResponseTime(startTime);
    
    const currentMessages = chatStorageService.getCurrentChat()?.messages || [];
    chatStorageService.updateCurrentChatMessages([...currentMessages, userMessage]);
    
    return userMessage;
  }

  resetChat(): Message[] {
    // Force clear everything in localStorage to ensure a clean state
    localStorage.removeItem('perfectgift_chats');
    localStorage.removeItem('perfectgift_current_chat');
    
    // Reset metrics
    this.metrics = {
      responseTime: 0,
      sessionDuration: 0,
      messageCount: 0
    };
    
    // Create fresh welcome messages
    const welcomeMessages = getWelcomeMessages();
    
    // Create a new chat in storage with the welcome messages
    chatStorageService.createChat(welcomeMessages);
    
    return welcomeMessages;
  }

  getMetrics(): ChatMetrics {
    return { ...this.metrics };
  }

  updateSessionDuration() {
    this.metrics.sessionDuration += 1;
    chatStorageService.updateCurrentChatMetrics(this.metrics);
  }

  private trackResponseTime(startTime: number) {
    const responseTime = (Date.now() - startTime) / 1000;
    this.metrics.responseTime = responseTime;
    this.metrics.messageCount += 1;
    
    chatStorageService.updateCurrentChatMetrics(this.metrics);
  }

  private simulateNetworkLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const chatService = new ChatService();
