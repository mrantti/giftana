
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatHistory {
  [key: string]: string;
}

interface AnalysisResult {
  interests: string[];
  priceRange: string;
  persona: string;
  keywords: string[];
  giftCategory: string;
  occasionContext: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chatHistory } = await req.json();
    
    if (!chatHistory || Object.keys(chatHistory).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Chat history is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analyzing chat history:", JSON.stringify(chatHistory));
    
    // Construct the prompt for OpenAI based on chat history
    const prompt = constructPrompt(chatHistory);
    
    // Call OpenAI to analyze the chat history
    const analysisResult = await analyzeWithOpenAI(prompt);
    
    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in analyze-preferences function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function constructPrompt(chatHistory: ChatHistory): string {
  // Convert the chat history object into a readable format for OpenAI
  const historyEntries = Object.entries(chatHistory)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  
  return `
You are an AI gift recommendation specialist. Based on the following conversation history, extract key information to help find perfect gift recommendations.

Conversation History:
${historyEntries}

Please analyze this information and provide the following in JSON format:
1. Main interests or hobbies of the recipient
2. Appropriate price range 
3. Gift-giver persona (busy_professional, last_minute, sentimental, corporate, budget_conscious)
4. Keywords for gift search
5. Recommended gift category
6. Occasion or context for the gift

Format your response as valid JSON with these keys: interests, priceRange, persona, keywords, giftCategory, occasionContext
`;
}

async function analyzeWithOpenAI(prompt: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a gift recommendation specialist that produces structured JSON output.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", JSON.stringify(data));
    
    const content = data.choices[0].message.content;
    
    // Extract the JSON from the response (sometimes OpenAI includes markdown formatting)
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
    const jsonString = jsonMatch[1] || content;
    
    try {
      // Parse the JSON response
      const parsedResult = JSON.parse(jsonString.trim());
      
      return {
        interests: Array.isArray(parsedResult.interests) ? parsedResult.interests : [parsedResult.interests],
        priceRange: parsedResult.priceRange || 'medium',
        persona: parsedResult.persona || 'unknown',
        keywords: Array.isArray(parsedResult.keywords) ? parsedResult.keywords : [parsedResult.keywords],
        giftCategory: parsedResult.giftCategory || 'general',
        occasionContext: parsedResult.occasionContext || 'general'
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Problematic content:", jsonString);
      
      // Fallback to a basic structure if parsing fails
      return {
        interests: ['general'],
        priceRange: 'medium',
        persona: 'unknown',
        keywords: ['gift'],
        giftCategory: 'general',
        occasionContext: 'general'
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}
