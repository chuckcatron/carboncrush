import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { location, category, query } = await request.json();

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('Google Places API key not configured, returning mock data');
      return NextResponse.json({
        businesses: getMockBusinesses(category)
      });
    }

    // First, geocode the location to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results.length) {
      return NextResponse.json(
        { error: 'Could not find location' },
        { status: 400 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Search for green businesses using Places API
    const businesses = await searchGreenBusinesses(lat, lng, category, query, apiKey);

    return NextResponse.json({
      businesses,
      location: geocodeData.results[0].formatted_address
    });

  } catch (error) {
    console.error('Error searching places:', error);
    return NextResponse.json(
      { error: 'Failed to search businesses' },
      { status: 500 }
    );
  }
}

async function searchGreenBusinesses(lat: number, lng: number, category: string, query: string, apiKey: string) {
  const businesses = [];
  
  // Define search terms for different categories
  const searchTerms = getSearchTermsForCategory(category, query);
  
  for (const searchTerm of searchTerms) {
    try {
      // Use Places API Text Search
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchTerm)}&location=${lat},${lng}&radius=10000&key=${apiKey}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results) {
        for (const place of data.results.slice(0, 5)) { // Limit results per search
          // Get detailed place information
          const details = await getPlaceDetails(place.place_id, apiKey);
          if (details) {
            const businessWithSustainability = await enhanceWithSustainabilityData(details, category);
            if (businessWithSustainability.sustainabilityScore > 60) { // Only include businesses with good sustainability scores
              businesses.push(businessWithSustainability);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error searching for ${searchTerm}:`, error);
    }
  }
  
  // Remove duplicates and sort by sustainability score
  const uniqueBusinesses = businesses.filter((business, index, self) => 
    index === self.findIndex(b => b.place_id === business.place_id)
  );
  
  return uniqueBusinesses
    .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    .slice(0, 20); // Limit to top 20 results
}

async function getPlaceDetails(placeId: string, apiKey: string) {
  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,types,price_level,geometry&key=${apiKey}`;
    
    const response = await fetch(detailsUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
  } catch (error) {
    console.error('Error getting place details:', error);
  }
  
  return null;
}

async function enhanceWithSustainabilityData(place: any, category: string) {
  // Analyze the business for sustainability indicators
  const sustainabilityAnalysis = analyzeSustainability(place, category);
  
  return {
    ...place,
    sustainabilityScore: sustainabilityAnalysis.score,
    sustainabilityReasons: sustainabilityAnalysis.reasons,
    category: mapToCategory(place.types, category),
    distance: calculateDistance(place.geometry?.location)
  };
}

function analyzeSustainability(place: any, category: string) {
  let score = 50; // Base score
  const reasons = [];
  
  const name = place.name?.toLowerCase() || '';
  const types = place.types || [];
  
  // Check for sustainability keywords in name
  const sustainabilityKeywords = [
    'organic', 'eco', 'green', 'sustainable', 'solar', 'renewable', 'electric',
    'vegan', 'vegetarian', 'farm', 'local', 'natural', 'bio', 'zero waste',
    'recycled', 'fair trade', 'carbon neutral', 'energy efficient'
  ];
  
  sustainabilityKeywords.forEach(keyword => {
    if (name.includes(keyword)) {
      score += 10;
      reasons.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} focused`);
    }
  });
  
  // Category-specific scoring
  switch (category) {
    case 'food':
      if (types.includes('meal_takeaway') && name.includes('organic')) score += 15;
      if (name.includes('farm') || name.includes('local')) {
        score += 20;
        reasons.push('Farm-to-table');
      }
      if (name.includes('vegan') || name.includes('vegetarian')) {
        score += 15;
        reasons.push('Plant-based options');
      }
      break;
      
    case 'transport':
      if (name.includes('electric') || name.includes('ev')) {
        score += 25;
        reasons.push('Electric vehicles');
      }
      if (name.includes('bike') || name.includes('bicycle')) {
        score += 20;
        reasons.push('Eco-friendly transport');
      }
      break;
      
    case 'energy':
      if (name.includes('solar') || name.includes('renewable')) {
        score += 30;
        reasons.push('Renewable energy');
      }
      break;
      
    case 'retail':
      if (name.includes('thrift') || name.includes('second hand')) {
        score += 20;
        reasons.push('Second-hand goods');
      }
      if (name.includes('sustainable') || name.includes('eco')) {
        score += 15;
        reasons.push('Sustainable products');
      }
      break;
  }
  
  // Bonus for high ratings (indicates quality)
  if (place.rating >= 4.5) {
    score += 10;
    reasons.push('Highly rated');
  }
  
  // Ensure score is within bounds
  score = Math.min(100, Math.max(0, score));
  
  return {
    score,
    reasons: reasons.slice(0, 4) // Limit to 4 reasons
  };
}

function getSearchTermsForCategory(category: string, query: string) {
  const baseTerms = [];
  
  if (query) {
    baseTerms.push(query);
  }
  
  switch (category) {
    case 'food':
      return [
        ...baseTerms,
        'organic restaurant',
        'farm to table restaurant',
        'vegan restaurant',
        'vegetarian restaurant',
        'sustainable food',
        'local food market',
        'organic grocery store'
      ];
    case 'transport':
      return [
        ...baseTerms,
        'electric vehicle charging',
        'bike shop',
        'car sharing',
        'electric vehicle dealer',
        'bicycle rental'
      ];
    case 'energy':
      return [
        ...baseTerms,
        'solar panel installation',
        'renewable energy',
        'energy efficiency',
        'solar energy company',
        'green energy'
      ];
    case 'retail':
      return [
        ...baseTerms,
        'sustainable fashion',
        'eco-friendly products',
        'zero waste store',
        'thrift store',
        'organic products',
        'recycled goods'
      ];
    case 'services':
      return [
        ...baseTerms,
        'green cleaning service',
        'eco-friendly services',
        'sustainable business',
        'organic cleaning'
      ];
    default:
      return [
        ...baseTerms,
        'sustainable business',
        'eco-friendly',
        'green business',
        'organic',
        'renewable energy',
        'electric vehicle'
      ];
  }
}

function mapToCategory(types: string[], requestedCategory: string) {
  if (requestedCategory !== 'all') return requestedCategory;
  
  if (types.some(type => ['restaurant', 'food', 'meal_takeaway', 'grocery_or_supermarket'].includes(type))) {
    return 'food';
  }
  if (types.some(type => ['car_dealer', 'car_rental', 'gas_station', 'bicycle_store'].includes(type))) {
    return 'transport';
  }
  if (types.some(type => ['electrician', 'general_contractor', 'home_goods_store'].includes(type))) {
    return 'energy';
  }
  if (types.some(type => ['clothing_store', 'store', 'shopping_mall'].includes(type))) {
    return 'retail';
  }
  
  return 'services';
}

function calculateDistance(location: any) {
  // This would calculate actual distance if we had user's coordinates
  // For now, return a placeholder
  return `${(Math.random() * 5 + 0.1).toFixed(1)} miles`;
}

function getMockBusinesses(category: string) {
  const mockBusinesses = [
    {
      place_id: 'mock-1',
      name: 'Green Leaf Organic Bistro',
      formatted_address: '123 Eco Street, Green City, CA 90210',
      formatted_phone_number: '(555) 123-4567',
      website: 'https://greenleafbistro.com',
      rating: 4.8,
      user_ratings_total: 324,
      types: ['restaurant', 'food'],
      geometry: { location: { lat: 37.7749, lng: -122.4194 } },
      sustainabilityScore: 95,
      sustainabilityReasons: ['Organic ingredients', 'Local sourcing', 'Zero waste practices', 'Compost program'],
      category: 'food',
      distance: '0.3 miles',
      opening_hours: { open_now: true }
    },
    {
      place_id: 'mock-2',
      name: 'EcoRide Electric Car Share',
      formatted_address: '456 Clean Ave, Green City, CA 90210',
      formatted_phone_number: '(555) 234-5678',
      website: 'https://ecoride.com',
      rating: 4.6,
      user_ratings_total: 189,
      types: ['car_rental', 'establishment'],
      geometry: { location: { lat: 37.7849, lng: -122.4094 } },
      sustainabilityScore: 92,
      sustainabilityReasons: ['100% electric fleet', 'Solar charging stations', 'Carbon neutral'],
      category: 'transport',
      distance: '0.5 miles',
      opening_hours: { open_now: true }
    },
    {
      place_id: 'mock-3',
      name: 'SunPower Solar Solutions',
      formatted_address: '789 Renewable Rd, Green City, CA 90210',
      formatted_phone_number: '(555) 345-6789',
      website: 'https://sunpowersolutions.com',
      rating: 4.9,
      user_ratings_total: 156,
      types: ['electrician', 'establishment'],
      geometry: { location: { lat: 37.7649, lng: -122.4294 } },
      sustainabilityScore: 98,
      sustainabilityReasons: ['Solar panel experts', 'Energy storage', 'Green certified', '25-year warranty'],
      category: 'energy',
      distance: '1.2 miles',
      opening_hours: { open_now: false }
    }
  ];
  
  if (category === 'all') return mockBusinesses;
  return mockBusinesses.filter(b => b.category === category);
}