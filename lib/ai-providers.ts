import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// AI Provider Types
export type AIProvider = 'claude' | 'gpt4o';

export interface AIProviderConfig {
  name: string;
  displayName: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export interface RecommendationRequest {
  carbonData: any;
  results: any;
  userProfile?: any;
  provider?: AIProvider;
}

export interface RecommendationResponse {
  recommendations: any[];
  provider: AIProvider;
  model: string;
  processingTime: number;
}

// Provider configurations
export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  claude: {
    name: 'claude',
    displayName: 'Claude (Anthropic)',
    description: 'Advanced reasoning and environmental expertise',
    enabled: !!process.env.ANTHROPIC_API_KEY,
    icon: '🧠'
  },
  gpt4o: {
    name: 'gpt4o',
    displayName: 'GPT-4o (OpenAI)',
    description: 'Fast, multimodal AI with broad knowledge',
    enabled: !!process.env.OPENAI_API_KEY,
    icon: '⚡'
  }
};

// Initialize AI clients
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Base prompt for recommendations
const getBasePrompt = (carbonData: any, results: any, userProfile?: any) => {
  return `You are an expert environmental consultant helping users reduce their carbon footprint. Based on the carbon footprint data provided, generate personalized, actionable recommendations.

CARBON FOOTPRINT DATA:
${JSON.stringify(carbonData, null, 2)}

CALCULATED RESULTS:
${JSON.stringify(results, null, 2)}

USER PROFILE:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile data available'}

Please generate 4-6 personalized recommendations following this JSON structure:
{
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Clear, actionable title",
      "description": "Detailed explanation of the recommendation",
      "category": "transportation|energy|food|lifestyle",
      "priority": "high|medium|low",
      "difficulty": "easy|medium|hard",
      "estimatedReduction": "X.X tons CO2/year",
      "costSavings": "$X/year",
      "timeframe": "immediate|1-3 months|3-6 months|6+ months",
      "actions": [
        "Specific step 1",
        "Specific step 2",
        "Specific step 3"
      ],
      "tips": "Practical implementation advice"
    }
  ]
}

Focus on:
1. High-impact, achievable actions
2. Cost-effective solutions when possible
3. User's specific situation and location
4. Both immediate and long-term strategies
5. Clear, measurable benefits

Return only valid JSON without any additional text or formatting.`;
};

// Claude implementation
async function generateClaudeRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  if (!anthropic) {
    throw new Error('Claude API key not configured');
  }

  const startTime = Date.now();
  
  const prompt = getBasePrompt(request.carbonData, request.results, request.userProfile);
  
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response format from Claude');
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(content.text);
  } catch (error) {
    console.error('Failed to parse Claude response:', content.text);
    throw new Error('Invalid JSON response from Claude');
  }

  const processingTime = Date.now() - startTime;

  return {
    recommendations: parsedResponse.recommendations || [],
    provider: 'claude',
    model: 'claude-3-5-sonnet-20241022',
    processingTime
  };
}

// GPT-4o implementation
async function generateGPT4oRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const startTime = Date.now();
  
  const prompt = getBasePrompt(request.carbonData, request.results, request.userProfile);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert environmental consultant. Always respond with valid JSON only, no additional text or formatting.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from GPT-4o');
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse GPT-4o response:', content);
    throw new Error('Invalid JSON response from GPT-4o');
  }

  const processingTime = Date.now() - startTime;

  return {
    recommendations: parsedResponse.recommendations || [],
    provider: 'gpt4o',
    model: 'gpt-4o',
    processingTime
  };
}

// Main function to generate recommendations
export async function generateAIRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  const provider = request.provider || 'claude'; // Default to Claude
  
  console.log(`Using AI provider: ${provider}`);
  
  // Check if provider is enabled
  if (!AI_PROVIDERS[provider].enabled) {
    throw new Error(`${AI_PROVIDERS[provider].displayName} is not configured. Please check your API keys.`);
  }

  try {
    switch (provider) {
      case 'claude':
        return await generateClaudeRecommendations(request);
      case 'gpt4o':
        return await generateGPT4oRecommendations(request);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error with ${provider}:`, error);
    
    // Fallback to the other provider if available
    const fallbackProvider: AIProvider = provider === 'claude' ? 'gpt4o' : 'claude';
    
    if (AI_PROVIDERS[fallbackProvider].enabled) {
      console.log(`Falling back to ${fallbackProvider}`);
      return await generateAIRecommendations({
        ...request,
        provider: fallbackProvider
      });
    }
    
    throw error;
  }
}

// Get available providers
export function getAvailableProviders(): AIProviderConfig[] {
  return Object.values(AI_PROVIDERS).filter(provider => provider.enabled);
}

// Check if any AI provider is available
export function hasAvailableProvider(): boolean {
  return getAvailableProviders().length > 0;
}