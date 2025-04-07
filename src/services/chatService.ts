
import { Message, ChatMetrics } from '@/types/chat';
import { getWelcomeMessages } from '@/components/chat/chatFlowConfig';

// Simulated service latency
const SERVICE_LATENCY = {
  respond: () => 800 + Math.random() * 1200, // 800-2000ms
};

class ChatService {
  // Track metrics for the chat service
  private metrics: ChatMetrics = {
    responseTime: 0,
    sessionDuration: 0,
    messageCount: 0
  };

  // Get initial welcome messages
  getInitialMessages(): Message[] {
    return getWelcomeMessages();
  }

  // Process user response to a choice
  async processUserChoice(choiceText: string): Promise<Message> {
    // Simulate backend processing time
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: choiceText,
      type: 'user',
      timestamp: new Date()
    };
    
    // Update metrics
    this.trackResponseTime(startTime);
    
    return userMessage;
  }

  // Process bot response based on a selected option
  async processBotResponse(message: string, choices?: any[]): Promise<Message> {
    // Simulate backend processing time
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: message,
      type: 'bot',
      timestamp: new Date(),
      choices: choices
    };
    
    // Update metrics
    this.trackResponseTime(startTime);
    
    return botMessage;
  }

  // Process user text input
  async processUserInput(input: string): Promise<Message> {
    // Simulate backend processing time
    const startTime = Date.now();
    await this.simulateNetworkLatency(SERVICE_LATENCY.respond());
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };
    
    // Update metrics
    this.trackResponseTime(startTime);
    
    return userMessage;
  }

  // Reset the chat session
  resetChat(): Message[] {
    this.metrics = {
      responseTime: 0,
      sessionDuration: 0,
      messageCount: 0
    };
    
    return this.getInitialMessages();
  }

  // Get current chat metrics
  getMetrics(): ChatMetrics {
    return { ...this.metrics };
  }

  // Update session duration
  updateSessionDuration() {
    this.metrics.sessionDuration += 1;
  }

  // Private method to track response time
  private trackResponseTime(startTime: number) {
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    this.metrics.responseTime = responseTime;
    this.metrics.messageCount += 1;
  }

  // Simulate network latency
  private simulateNetworkLatency(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export as singleton
export const chatService = new ChatService();
