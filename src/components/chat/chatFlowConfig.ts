
// This file serves as an aggregator to maintain backward compatibility
// Export all types, configs, and utilities from the new modular structure

export type { 
  ChatChoice, 
  ChatFlowStep, 
  ChatFlowConfig,
  PersonaType 
} from './types/flow-types';

export { chatFlow } from './config/chat-flow-config';

export { 
  getWelcomeMessages 
} from './utils/welcome-utils';

export {
  determinePersona,
  getPersonaResponse,
  getPersonaDescription,
  getInterestsFromHistory,
  getPersonalizedResponse
} from './utils/persona-utils';
