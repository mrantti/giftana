
import { ChatFlowConfig } from '../types/flow-types';

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
  time_urgency: {
    message: "Great! How soon do you need this gift?",
    choices: [
      { id: 'urgent', text: "As soon as possible (days)", nextStep: 'recipient' },
      { id: 'soon', text: "Within a couple weeks", nextStep: 'recipient' },
      { id: 'planning', text: "I'm planning ahead", nextStep: 'recipient' }
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
