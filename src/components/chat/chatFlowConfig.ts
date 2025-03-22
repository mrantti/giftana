
export interface ChatChoice {
  id: string;
  text: string;
  nextStep: string;
}

export interface ChatFlowStep {
  message: string;
  choices: ChatChoice[];
}

export type ChatFlowConfig = {
  [key: string]: ChatFlowStep;
};

export type PersonaType = 'busy_professional' | 'last_minute' | 'sentimental' | 'corporate' | 'budget_conscious' | 'unknown';

// Chat flow configuration
export const chatFlow: ChatFlowConfig = {
  welcome: {
    message: "Hi there! I'm your gift-finding assistant. Let's find the perfect gift together!",
    choices: [
      { id: 'start', text: "Let's get started", nextStep: 'time_urgency' }
    ]
  },
  time_urgency: {
    message: "Great! How soon do you need this gift?",
    choices: [
      { id: 'urgent', text: "As soon as possible (days)", nextStep: 'recipient' },
      { id: 'soon', text: "Within a couple weeks", nextStep: 'recipient' },
      { id: 'planning', text: "I'm planning ahead", nextStep: 'recipient' }
    ]
  },
  recipient: {
    message: "Who are you buying this gift for?",
    choices: [
      { id: 'family', text: "Family member", nextStep: 'family_member' },
      { id: 'friend', text: "Friend", nextStep: 'occasion' },
      { id: 'colleague', text: "Colleague/Co-worker", nextStep: 'occasion' },
      { id: 'partner', text: "Partner/Significant other", nextStep: 'occasion' },
      { id: 'client', text: "Client/Business contact", nextStep: 'occasion' },
      { id: 'other', text: "Someone else", nextStep: 'occasion' }
    ]
  },
  family_member: {
    message: "Which family member?",
    choices: [
      { id: 'parent', text: "Parent", nextStep: 'occasion' },
      { id: 'sibling', text: "Sibling", nextStep: 'occasion' },
      { id: 'child', text: "Child", nextStep: 'occasion' },
      { id: 'grandparent', text: "Grandparent", nextStep: 'occasion' },
      { id: 'other_family', text: "Other family member", nextStep: 'occasion' }
    ]
  },
  occasion: {
    message: "What's the occasion?",
    choices: [
      { id: 'birthday', text: "Birthday", nextStep: 'gift_preference' },
      { id: 'holiday', text: "Holiday", nextStep: 'gift_preference' },
      { id: 'anniversary', text: "Anniversary", nextStep: 'gift_preference' },
      { id: 'graduation', text: "Graduation", nextStep: 'gift_preference' },
      { id: 'just_because', text: "Just because", nextStep: 'gift_preference' },
      { id: 'other_occasion', text: "Other occasion", nextStep: 'gift_preference' }
    ]
  },
  gift_preference: {
    message: "Would you prefer the gift to be more practical or more sentimental?",
    choices: [
      { id: 'practical', text: "Practical/Useful", nextStep: 'interests' },
      { id: 'sentimental', text: "Sentimental/Meaningful", nextStep: 'interests' },
      { id: 'fun', text: "Fun/Entertaining", nextStep: 'interests' },
      { id: 'both', text: "A mix of both", nextStep: 'interests' }
    ]
  },
  interests: {
    message: "What are their interests or hobbies?",
    choices: [
      { id: 'tech', text: "Technology/Gadgets", nextStep: 'detail_question' },
      { id: 'outdoor', text: "Outdoors/Nature", nextStep: 'detail_question' },
      { id: 'cooking', text: "Cooking/Food", nextStep: 'detail_question' },
      { id: 'reading', text: "Books/Reading", nextStep: 'detail_question' },
      { id: 'art', text: "Art/Creativity", nextStep: 'detail_question' },
      { id: 'fitness', text: "Fitness/Sports", nextStep: 'detail_question' },
      { id: 'music', text: "Music", nextStep: 'detail_question' },
      { id: 'gardening', text: "Gardening", nextStep: 'detail_question' },
      { id: 'not_sure', text: "I'm not sure", nextStep: 'detail_question' }
    ]
  },
  detail_question: {
    message: "One more thing that would help me find the perfect gift...",
    choices: [
      { id: 'past_gift', text: "Have you given them similar gifts before?", nextStep: 'budget' },
      { id: 'mentioned', text: "Have they mentioned wanting anything specific?", nextStep: 'budget' },
      { id: 'skip', text: "I'd rather just see suggestions", nextStep: 'budget' }
    ]
  },
  budget: {
    message: "What's your budget range?",
    choices: [
      { id: 'budget_low', text: "Under $25", nextStep: 'suggestions' },
      { id: 'budget_medium', text: "Between $25-$50", nextStep: 'suggestions' },
      { id: 'budget_high', text: "Between $50-$100", nextStep: 'suggestions' },
      { id: 'budget_premium', text: "Over $100", nextStep: 'suggestions' }
    ]
  },
  suggestions: {
    message: "Based on your choices, here are some perfect gift suggestions:",
    choices: []
  },
  final_question: {
    message: "Anything else you want to add to help me find the perfect gift?",
    choices: [
      { id: 'yes', text: "Yes, I'd like to add more details", nextStep: 'custom_input' },
      { id: 'no', text: "No, these suggestions look great", nextStep: 'thank_you' }
    ]
  },
  thank_you: {
    message: "Great! I hope you find the perfect gift from these suggestions. If you need more help, just let me know!",
    choices: []
  }
};

// Welcome messages based on the chat flow
export const getWelcomeMessages = () => [
  {
    id: 'welcome-1',
    content: chatFlow.welcome.message,
    type: 'bot' as const,
    timestamp: new Date(),
    choices: chatFlow.welcome.choices
  }
];

// Helper function to determine persona based on answers
export const determinePersona = (chatHistory: {[key: string]: string}): PersonaType => {
  // Default to unknown
  let persona: PersonaType = 'unknown';
  
  // Check for Busy Professional
  if (chatHistory['time_urgency'] === 'soon' && 
      (chatHistory['gift_preference'] === 'practical' || chatHistory['detail_question'] === 'skip')) {
    persona = 'busy_professional';
  }
  
  // Check for Last-Minute Larry
  else if (chatHistory['time_urgency'] === 'urgent') {
    persona = 'last_minute';
  }
  
  // Check for Sentimental Giver
  else if (chatHistory['gift_preference'] === 'sentimental' && 
          (chatHistory['detail_question'] === 'past_gift' || chatHistory['detail_question'] === 'mentioned')) {
    persona = 'sentimental';
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
      return "I've found these meaningful gifts that create a personal connection and show how much you care.";
    case 'corporate':
      return "These professional options maintain the right balance between thoughtfulness and appropriate business boundaries.";
    case 'budget_conscious':
      return "These creative options offer great value while still making a meaningful impression.";
    default:
      return "Based on your choices, here are some perfect gift suggestions:";
  }
};
