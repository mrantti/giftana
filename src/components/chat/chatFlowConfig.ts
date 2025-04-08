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
      { id: 'time_urgent', text: "As soon as possible (days)", nextStep: 'recipient' },
      { id: 'time_soon', text: "Within a couple weeks", nextStep: 'recipient' },
      { id: 'time_planning', text: "I'm planning ahead", nextStep: 'recipient' }
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
      { id: 'birthday', text: "Birthday", nextStep: 'milestone' },
      { id: 'holiday', text: "Holiday", nextStep: 'gift_preference' },
      { id: 'anniversary', text: "Anniversary", nextStep: 'milestone' },
      { id: 'graduation', text: "Graduation", nextStep: 'milestone' },
      { id: 'just_because', text: "Just because", nextStep: 'gift_preference' },
      { id: 'other_occasion', text: "Other occasion", nextStep: 'gift_preference' }
    ]
  },
  milestone: {
    message: "Is this a significant milestone or special occasion?",
    choices: [
      { id: 'significant', text: "Yes, it's a significant milestone", nextStep: 'relationship_depth' },
      { id: 'regular', text: "No, it's a regular celebration", nextStep: 'gift_preference' }
    ]
  },
  relationship_depth: {
    message: "How would you describe the relationship?",
    choices: [
      { id: 'very_close', text: "Very close, with a deep connection", nextStep: 'memory_based' },
      { id: 'good_friends', text: "Good and meaningful", nextStep: 'gift_preference' },
      { id: 'acquaintance', text: "More casual/professional", nextStep: 'gift_preference' }
    ]
  },
  memory_based: {
    message: "Would you like the gift to reference a shared memory or experience?",
    choices: [
      { id: 'memory_yes', text: "Yes, I'd like something that recalls a memory", nextStep: 'describe_memory' },
      { id: 'memory_no', text: "No, but I still want something meaningful", nextStep: 'gift_preference' }
    ]
  },
  describe_memory: {
    message: "Tell me a bit about this memory or experience you'd like to reference in the gift:",
    choices: [
      { id: 'memory_described', text: "I've shared the memory details", nextStep: 'custom_input' }
    ]
  },
  gift_preference: {
    message: "Would you prefer the gift to be more practical or more sentimental?",
    choices: [
      { id: 'practical', text: "Practical/Useful", nextStep: 'interests' },
      { id: 'sentimental', text: "Sentimental/Meaningful", nextStep: 'message_inclusion' },
      { id: 'fun', text: "Fun/Entertaining", nextStep: 'interests' },
      { id: 'both', text: "A mix of both", nextStep: 'interests' }
    ]
  },
  message_inclusion: {
    message: "Would you like to include a personalized message or story with the gift?",
    choices: [
      { id: 'message_yes', text: "Yes, that would make it special", nextStep: 'interests' },
      { id: 'message_no', text: "No, the gift should speak for itself", nextStep: 'interests' }
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
      { id: 'past_gift', text: "Have you given them similar gifts before?", nextStep: 'emotional_impact' },
      { id: 'mentioned', text: "Have they mentioned wanting anything specific?", nextStep: 'emotional_impact' },
      { id: 'skip', text: "I'd rather just see suggestions", nextStep: 'budget' }
    ]
  },
  emotional_impact: {
    message: "How important is it that this gift creates an emotional impact?",
    choices: [
      { id: 'very_important', text: "Very important - I want them to feel touched", nextStep: 'budget' },
      { id: 'somewhat', text: "Somewhat - I want them to be happy with it", nextStep: 'budget' },
      { id: 'not_focus', text: "Not my main focus", nextStep: 'budget' }
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

// Welcome messages based on the chat flow - updated to start with time urgency
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
