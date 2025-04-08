
import { PersonaType } from '../types/flow-types';

// Helper function to determine persona based on answers
export const determinePersona = (chatHistory: {[key: string]: string}): PersonaType => {
  // Default to unknown
  let persona: PersonaType = 'unknown';
  
  // Check for Sentimental Giver - Enhanced detection
  if ((chatHistory['gift_preference'] === 'sentimental' || 
       chatHistory['relationship_depth'] === 'very_close' ||
       chatHistory['milestone'] === 'significant' ||
       chatHistory['memory_based'] === 'memory_yes' ||
       chatHistory['message_inclusion'] === 'message_yes' ||
       chatHistory['emotional_impact'] === 'very_important') &&
      (chatHistory['detail_question'] === 'past_gift' || 
       chatHistory['detail_question'] === 'mentioned')) {
    persona = 'sentimental';
  }
  
  // Check for Busy Professional
  else if (chatHistory['time_urgency'] === 'soon' || 
      chatHistory['welcome'] === 'time_soon' ||
      (chatHistory['gift_preference'] === 'practical' || chatHistory['detail_question'] === 'skip')) {
    persona = 'busy_professional';
  }
  
  // Check for Last-Minute Larry
  else if (chatHistory['time_urgency'] === 'urgent' || 
          chatHistory['welcome'] === 'time_urgent') {
    persona = 'last_minute';
  }
  
  // Check for Corporate HR
  else if (chatHistory['recipient'] === 'colleague' || 
          chatHistory['recipient'] === 'client') {
    persona = 'corporate';
  }
  
  // Check for Budget-Conscious
  else if (['budget_low', 'budget_medium'].includes(chatHistory['budget'] || '') && 
          (chatHistory['gift_preference'] === 'fun' || chatHistory['interests'] === 'art')) {
    persona = 'budget_conscious';
  }
  
  return persona;
};

// Get persona-specific response based on the determined persona
export const getPersonaResponse = (persona: PersonaType): string => {
  switch(persona) {
    case 'busy_professional':
      return "I've selected these efficient options that make a thoughtful impression without requiring extensive shopping time.";
    case 'last_minute':
      return "Here are gifts with quick delivery options that still feel thoughtful and personal.";
    case 'sentimental':
      return "I've found these meaningful gifts that create a personal connection and show how much you care. These options are perfect for expressing deep appreciation and creating lasting memories.";
    case 'corporate':
      return "These professional options maintain the right balance between thoughtfulness and appropriate business boundaries.";
    case 'budget_conscious':
      return "These creative options offer great value while still making a meaningful impression.";
    default:
      return "Based on your choices, here are some perfect gift suggestions:";
  }
};

// Get persona-specific description
export const getPersonaDescription = (persona: PersonaType): string => {
  switch(persona) {
    case 'sentimental':
      return "You seem to value emotional connection and meaningful gift-giving. I'll focus on gifts that create lasting memories and express deep appreciation.";
    case 'busy_professional':
      return "I notice you're looking for thoughtful yet efficient gift options. I'll focus on quality gifts that don't require extensive research.";
    case 'last_minute':
      return "I understand you need a quick solution. I'll prioritize gifts with fast delivery that still feel personal and thoughtful.";
    case 'corporate':
      return "For professional gift-giving, I'll suggest options that maintain the right balance of thoughtfulness and business appropriateness.";
    case 'budget_conscious':
      return "I'll help you find creative, meaningful gifts that make a great impression without breaking the bank.";
    default:
      return "";
  }
};

// Helper function to extract interests from chat history
export const getInterestsFromHistory = (history: {[key: string]: string}): string[] => {
  const interestKey = 'interests';
  if (history[interestKey]) {
    return [history[interestKey]];
  }
  return ['tech', 'gardening']; // Default interests as fallback
};

// Helper function for personalized responses
export const getPersonalizedResponse = (personaType: PersonaType): string => {
  switch(personaType) {
    case 'sentimental':
      return "Thank you for sharing that meaningful context. I'll ensure the suggestions reflect the emotional connection you're looking to express.";
    case 'busy_professional':
      return "Got it. I'll use this information to find efficient yet thoughtful options for you.";
    case 'last_minute':
      return "Thanks - I'll find you something meaningful that can arrive quickly.";
    case 'corporate':
      return "I understand the professional context. I'll suggest appropriate options for your business relationship.";
    case 'budget_conscious':
      return "Thanks for the details. I'll find options that offer great value while still being meaningful.";
    default:
      return "Thanks for your additional information. I'll take that into account with my suggestions.";
  }
};
