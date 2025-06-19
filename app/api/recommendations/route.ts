import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { carbonData, results, userProfile } = await request.json();

    if (!carbonData || !results) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    // Generate AI recommendations
    const recommendations = await generateAIRecommendations(carbonData, results, userProfile);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Return fallback recommendations if AI fails
    const fallbackRecommendations = generateFallbackRecommendations(carbonData, results);
    return NextResponse.json({ 
      recommendations: fallbackRecommendations,
      fallback: true 
    });
  }
}

async function generateAIRecommendations(carbonData: any, results: any, userProfile: any) {
  const prompt = `You are an expert climate advisor helping someone reduce their carbon footprint. Analyze their data and provide personalized recommendations.

User Profile:
- Location: ${userProfile?.location || 'Not specified'}
- Household size: ${userProfile?.householdSize || 1}
- Carbon goal: ${userProfile?.carbonGoal ? (userProfile.carbonGoal / 1000).toFixed(1) + ' tons/year' : 'Not set'}

Current Carbon Footprint: ${results.total.toFixed(1)} tons CO2/year
Breakdown:
- Transportation: ${results.breakdown.transportation.toFixed(1)} tons (${((results.breakdown.transportation / results.total) * 100).toFixed(0)}%)
- Energy: ${results.breakdown.energy.toFixed(1)} tons (${((results.breakdown.energy / results.total) * 100).toFixed(0)}%)
- Food: ${results.breakdown.food.toFixed(1)} tons (${((results.breakdown.food / results.total) * 100).toFixed(0)}%)
- Shopping: ${results.breakdown.shopping.toFixed(1)} tons (${((results.breakdown.shopping / results.total) * 100).toFixed(0)}%)
- Waste: ${results.breakdown.waste.toFixed(1)} tons (${((results.breakdown.waste / results.total) * 100).toFixed(0)}%)

Transportation Details:
- Car miles/week: ${carbonData.transportation.carMiles}
- Car type: ${carbonData.transportation.carType}
- Flight hours/year: ${carbonData.transportation.flightHours}

Energy Details:
- Home size: ${carbonData.energy.homeSize}
- Monthly electricity bill: $${carbonData.energy.electricityBill}
- Heating type: ${carbonData.energy.heatingType}
- Uses renewable energy: ${carbonData.energy.renewableEnergy ? 'Yes' : 'No'}

Food Details:
- Diet type: ${carbonData.food.dietType}
- Meat meals/week: ${carbonData.food.meatMealsPerWeek}
- Local food: ${carbonData.food.localFoodPercentage}%
- Food waste: ${carbonData.food.foodWastePercentage}%

Please provide exactly 6 recommendations in this JSON format:
{
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Clear, actionable title",
      "description": "Detailed explanation of the action",
      "category": "transportation|energy|food|shopping|waste",
      "difficulty": "easy|medium|hard",
      "timeframe": "immediate|1-4 weeks|1-3 months|3-6 months",
      "estimatedReduction": "X.X tons CO2/year",
      "costSavings": "$X/year or $0 if no savings",
      "steps": [
        "Step 1: Specific action",
        "Step 2: Next action",
        "Step 3: Final action"
      ],
      "tips": "Helpful tip for implementation"
    }
  ]
}

Focus on the highest impact categories first. Make recommendations specific, achievable, and personalized to their situation. Include cost savings when applicable.`;

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 2000,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const response = message.content[0];
  if (response.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    const parsed = JSON.parse(response.text);
    return parsed.recommendations;
  } catch (parseError) {
    console.error('Error parsing AI response:', parseError);
    throw new Error('Invalid AI response format');
  }
}

function generateFallbackRecommendations(carbonData: any, results: any) {
  const recommendations = [];
  
  // Transportation fallbacks
  if (results.breakdown.transportation > 2) {
    if (carbonData.transportation.carMiles > 100) {
      recommendations.push({
        id: 'reduce-driving',
        title: 'Reduce Weekly Driving',
        description: 'Combine trips, work from home, or use public transport to reduce your weekly driving miles.',
        category: 'transportation',
        difficulty: 'easy',
        timeframe: 'immediate',
        estimatedReduction: '0.5 tons CO2/year',
        costSavings: '$800/year',
        steps: [
          'Plan and combine errands into single trips',
          'Work from home 1-2 days per week if possible',
          'Use public transport for regular commutes'
        ],
        tips: 'Start with one day per week and gradually increase'
      });
    }
    
    if (carbonData.transportation.carType === 'gasoline' || carbonData.transportation.carType === 'diesel') {
      recommendations.push({
        id: 'electric-vehicle',
        title: 'Consider Electric Vehicle',
        description: 'Switch to an electric or hybrid vehicle for your next car purchase.',
        category: 'transportation',
        difficulty: 'hard',
        timeframe: '3-6 months',
        estimatedReduction: '1.2 tons CO2/year',
        costSavings: '$1200/year',
        steps: [
          'Research electric vehicle options in your budget',
          'Calculate total cost of ownership including fuel savings',
          'Test drive electric vehicles at local dealerships'
        ],
        tips: 'Look for federal and state incentives that can reduce purchase price'
      });
    }
  }

  // Energy fallbacks
  if (results.breakdown.energy > 2) {
    if (!carbonData.energy.renewableEnergy) {
      recommendations.push({
        id: 'renewable-energy',
        title: 'Switch to Renewable Energy',
        description: 'Sign up for a green energy plan or install solar panels.',
        category: 'energy',
        difficulty: 'medium',
        timeframe: '1-3 months',
        estimatedReduction: '1.0 tons CO2/year',
        costSavings: '$200/year',
        steps: [
          'Contact your utility company about green energy options',
          'Compare renewable energy plans in your area',
          'Sign up for the most cost-effective green energy plan'
        ],
        tips: 'Many utilities offer renewable energy at competitive rates'
      });
    }
    
    recommendations.push({
      id: 'energy-efficiency',
      title: 'Improve Home Energy Efficiency',
      description: 'Simple changes to reduce your home energy consumption and costs.',
      category: 'energy',
      difficulty: 'easy',
      timeframe: '1-4 weeks',
      estimatedReduction: '0.8 tons CO2/year',
      costSavings: '$300/year',
      steps: [
        'Switch to LED bulbs throughout your home',
        'Adjust thermostat by 2-3 degrees',
        'Unplug electronics when not in use'
      ],
      tips: 'Focus on the most used rooms first for maximum impact'
    });
  }

  // Food fallbacks
  if (results.breakdown.food > 2) {
    if (carbonData.food.meatMealsPerWeek > 7) {
      recommendations.push({
        id: 'reduce-meat',
        title: 'Try Meatless Meals',
        description: 'Reduce meat consumption with delicious plant-based alternatives.',
        category: 'food',
        difficulty: 'easy',
        timeframe: 'immediate',
        estimatedReduction: '0.6 tons CO2/year',
        costSavings: '$400/year',
        steps: [
          'Start with "Meatless Monday" each week',
          'Try plant-based versions of favorite dishes',
          'Explore new vegetarian recipes'
        ],
        tips: 'Focus on familiar flavors with plant-based ingredients'
      });
    }
    
    if (carbonData.food.foodWastePercentage > 25) {
      recommendations.push({
        id: 'reduce-food-waste',
        title: 'Reduce Food Waste',
        description: 'Plan meals and store food properly to minimize waste.',
        category: 'food',
        difficulty: 'easy',
        timeframe: '1-4 weeks',
        estimatedReduction: '0.3 tons CO2/year',
        costSavings: '$600/year',
        steps: [
          'Plan weekly meals before grocery shopping',
          'Store fruits and vegetables properly',
          'Use leftovers creatively in new meals'
        ],
        tips: 'Start by planning just 3-4 meals per week'
      });
    }
  }

  // Waste fallbacks
  if (results.breakdown.waste > 0) {
    if (carbonData.waste.recyclingPercentage < 70) {
      recommendations.push({
        id: 'improve-recycling',
        title: 'Improve Recycling Habits',
        description: 'Increase your recycling rate and learn proper recycling practices.',
        category: 'waste',
        difficulty: 'easy',
        timeframe: 'immediate',
        estimatedReduction: '0.2 tons CO2/year',
        costSavings: '$0/year',
        steps: [
          'Learn what materials are recyclable in your area',
          'Set up convenient recycling stations at home',
          'Clean containers before recycling'
        ],
        tips: 'Check your local recycling guidelines as they vary by location'
      });
    }
  }

  return recommendations.slice(0, 6);
}