
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

// Chat flow configuration
export const chatFlow: ChatFlowConfig = {
  welcome: {
    message: "Hi there! I'm your gift-finding assistant. Let's find the perfect gift together!",
    choices: [
      { id: 'start', text: "Let's get started", nextStep: 'recipient' }
    ]
  },
  recipient: {
    message: "Great! Who are you buying this gift for?",
    choices: [
      { id: 'family', text: "Family member", nextStep: 'family_member' },
      { id: 'friend', text: "Friend", nextStep: 'occasion' },
      { id: 'colleague', text: "Colleague/Co-worker", nextStep: 'occasion' },
      { id: 'partner', text: "Partner/Significant other", nextStep: 'occasion' },
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
      { id: 'birthday', text: "Birthday", nextStep: 'interests' },
      { id: 'holiday', text: "Holiday", nextStep: 'interests' },
      { id: 'anniversary', text: "Anniversary", nextStep: 'interests' },
      { id: 'graduation', text: "Graduation", nextStep: 'interests' },
      { id: 'other_occasion', text: "Other occasion", nextStep: 'interests' }
    ]
  },
  interests: {
    message: "What are their interests or hobbies?",
    choices: [
      { id: 'tech', text: "Technology/Gadgets", nextStep: 'budget' },
      { id: 'outdoor', text: "Outdoors/Nature", nextStep: 'budget' },
      { id: 'cooking', text: "Cooking/Food", nextStep: 'budget' },
      { id: 'reading', text: "Books/Reading", nextStep: 'budget' },
      { id: 'art', text: "Art/Creativity", nextStep: 'budget' },
      { id: 'fitness', text: "Fitness/Sports", nextStep: 'budget' },
      { id: 'music', text: "Music", nextStep: 'budget' },
      { id: 'gardening', text: "Gardening", nextStep: 'budget' },
      { id: 'not_sure', text: "I'm not sure", nextStep: 'budget' }
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
