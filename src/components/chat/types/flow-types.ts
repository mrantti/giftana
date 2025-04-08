
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
