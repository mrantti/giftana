import { PersonaType } from '@/components/chat/chatFlowConfig';

interface PersonaTrait {
  keywords: string[];
  patterns: RegExp[];
  weight: number;
}

type PersonaTraits = {
  [key in PersonaType]: PersonaTrait;
};

class PersonaDetectionService {
  private personaTraits: PersonaTraits = {
    'busy_professional': {
      keywords: ['busy', 'work', 'quick', 'efficient', 'professional', 'career', 'job', 'time', 'deadline'],
      patterns: [/no time/i, /too busy/i, /work(ing)? (\w+ ){0,3}(hours|late)/i],
      weight: 0
    },
    'last_minute': {
      keywords: ['soon', 'urgent', 'tomorrow', 'last minute', 'hurry', 'rush', 'fast', 'asap', 'immediately'],
      patterns: [/by (tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, /in \d+ days?/i],
      weight: 0
    },
    'sentimental': {
      keywords: ['meaningful', 'special', 'memories', 'emotional', 'thoughtful', 'personal', 'memorable', 'sentimental', 'significance'],
      patterns: [/means? (a lot|the world) to/i, /special (occasion|moment|memory)/i],
      weight: 0
    },
    'corporate': {
      keywords: ['client', 'colleague', 'boss', 'business', 'partner', 'corporate', 'company', 'office', 'professional', 'team'],
      patterns: [/business (relationship|partner)/i, /corporate (gift|present)/i, /office (environment|setting)/i],
      weight: 0
    },
    'budget_conscious': {
      keywords: ['cheap', 'affordable', 'budget', 'cost', 'price', 'inexpensive', 'saving', 'deal', 'bargain', 'value'],
      patterns: [/under \$\d+/i, /not (too|very|that) expensive/i, /tight budget/i, /can'?t spend (too|that) much/i],
      weight: 0
    },
    'unknown': {
      keywords: [],
      patterns: [],
      weight: 0
    }
  };

  // Minimum confidence score to assign a persona
  private confidenceThreshold = 2;

  // Keep track of detection history for more stable personas
  private detectionHistory: PersonaType[] = [];
  private historyLimit = 3;

  determinePersona(chatHistory: {[key: string]: string}): PersonaType {
    this.resetWeights();
    
    // Analyze all user messages
    for (const [key, message] of Object.entries(chatHistory)) {
      // Skip bot messages
      if (!key.startsWith('user_')) continue;
      
      this.analyzeMessage(message);
    }
    
    // Find the persona with the highest weight
    let highestWeight = 0;
    let detectedPersona: PersonaType = 'unknown';
    
    for (const [persona, traits] of Object.entries(this.personaTraits)) {
      if (persona === 'unknown') continue;
      
      if (traits.weight > highestWeight) {
        highestWeight = traits.weight;
        detectedPersona = persona as PersonaType;
      }
    }
    
    // Only assign persona if it meets confidence threshold
    if (highestWeight < this.confidenceThreshold) {
      detectedPersona = 'unknown';
    }
    
    // Add to detection history
    this.detectionHistory.push(detectedPersona);
    if (this.detectionHistory.length > this.historyLimit) {
      this.detectionHistory.shift();
    }
    
    // Use the most common persona in history for stability
    return this.getMostCommonPersona();
  }
  
  // Get persona description with confidence level
  getPersonaWithConfidence(chatHistory: {[key: string]: string}): { 
    persona: PersonaType; 
    confidence: 'low' | 'medium' | 'high';
    traits: string[];
  } {
    this.resetWeights();
    
    // Analyze all user messages
    for (const [key, message] of Object.entries(chatHistory)) {
      if (!key.startsWith('user_')) continue;
      this.analyzeMessage(message);
    }
    
    // Find the persona with the highest weight
    let highestWeight = 0;
    let detectedPersona: PersonaType = 'unknown';
    
    for (const [persona, traits] of Object.entries(this.personaTraits)) {
      if (persona === 'unknown') continue;
      
      if (traits.weight > highestWeight) {
        highestWeight = traits.weight;
        detectedPersona = persona as PersonaType;
      }
    }
    
    // Determine confidence level
    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (highestWeight >= this.confidenceThreshold && highestWeight < this.confidenceThreshold * 2) {
      confidence = 'medium';
    } else if (highestWeight >= this.confidenceThreshold * 2) {
      confidence = 'high';
    }
    
    // If confidence is low, default to unknown
    if (confidence === 'low') {
      detectedPersona = 'unknown';
    }
    
    // Identify the key traits that led to this persona
    const traits = this.getDetectedTraits(detectedPersona, chatHistory);
    
    return {
      persona: detectedPersona,
      confidence,
      traits
    };
  }
  
  // Get detected traits from messages that match the persona
  private getDetectedTraits(persona: PersonaType, chatHistory: {[key: string]: string}): string[] {
    if (persona === 'unknown') return [];
    
    const traits: string[] = [];
    const personaTrait = this.personaTraits[persona];
    
    for (const [key, message] of Object.entries(chatHistory)) {
      if (!key.startsWith('user_')) continue;
      
      // Check keywords
      for (const keyword of personaTrait.keywords) {
        if (message.toLowerCase().includes(keyword.toLowerCase()) && 
            !traits.includes(keyword) && 
            traits.length < 3) {
          traits.push(keyword);
        }
      }
      
      // Check patterns
      for (const pattern of personaTrait.patterns) {
        const match = message.match(pattern);
        if (match && !traits.includes(match[0]) && traits.length < 3) {
          traits.push(match[0]);
        }
      }
    }
    
    return traits;
  }
  
  // Get the most common persona from the history
  private getMostCommonPersona(): PersonaType {
    if (this.detectionHistory.length === 0) return 'unknown';
    
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let mostCommon: PersonaType = 'unknown';
    
    for (const persona of this.detectionHistory) {
      counts[persona] = (counts[persona] || 0) + 1;
      if (counts[persona] > maxCount) {
        maxCount = counts[persona];
        mostCommon = persona;
      }
    }
    
    return mostCommon;
  }
  
  private resetWeights() {
    for (const persona in this.personaTraits) {
      this.personaTraits[persona as PersonaType].weight = 0;
    }
  }
  
  private analyzeMessage(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Check for keyword matches
    for (const [persona, traits] of Object.entries(this.personaTraits)) {
      if (persona === 'unknown') continue;
      
      // Check keywords
      for (const keyword of traits.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          traits.weight += 1;
        }
      }
      
      // Check patterns (more specific, higher weight)
      for (const pattern of traits.patterns) {
        if (pattern.test(lowerMessage)) {
          traits.weight += 1.5;
        }
      }
    }
  }
}

export const personaDetectionService = new PersonaDetectionService();
