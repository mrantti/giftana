
import { PersonaType } from '@/components/chat/chatFlowConfig';

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
