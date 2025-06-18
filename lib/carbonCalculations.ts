// Carbon emission factors (kg CO2 per unit)
export const EMISSION_FACTORS = {
  // Transportation (kg CO2 per mile/hour)
  transportation: {
    gasoline_car: 0.404, // kg CO2 per mile
    hybrid_car: 0.250,
    electric_car: 0.150, // varies by grid
    diesel_car: 0.450,
    public_transport: 0.089, // kg CO2 per passenger mile (average)
    flight_domestic: 0.255, // kg CO2 per passenger mile
    flight_international: 0.195, // more efficient per mile due to longer distances
    walking_cycling: 0 // zero emissions
  },
  
  // Energy (kg CO2 per kWh or unit)
  energy: {
    electricity_us_avg: 0.386, // kg CO2 per kWh (US average)
    natural_gas: 0.202, // kg CO2 per kWh
    heating_oil: 0.264, // kg CO2 per kWh
    heat_pump: 0.193, // kg CO2 per kWh (more efficient)
    wood_biomass: 0.018, // kg CO2 per kWh (considered carbon neutral)
    renewable: 0.02 // kg CO2 per kWh (lifecycle emissions)
  },
  
  // Food (kg CO2 per serving/meal)
  food: {
    beef: 26.5, // kg CO2 per kg
    pork: 7.6,
    chicken: 5.7,
    fish: 5.4,
    dairy: 3.2, // per liter milk equivalent
    vegetables: 0.4, // per kg
    grains: 1.1, // per kg
    local_multiplier: 0.85, // 15% reduction for local food
    organic_multiplier: 0.95, // 5% reduction for organic
    waste_multiplier: 1.3 // 30% increase for food waste
  },
  
  // Shopping (kg CO2 per item/year)
  shopping: {
    clothing_new: 33.4, // kg CO2 per garment (average)
    clothing_secondhand: 6.7, // 80% reduction
    electronics: 300, // kg CO2 per device (smartphone/laptop average)
    sustainable_multiplier: 0.7 // 30% reduction for sustainable choices
  },
  
  // Waste (kg CO2 savings per kg waste)
  waste: {
    recycling_benefit: -0.5, // negative = carbon savings
    composting_benefit: -0.3,
    landfill_emission: 0.5 // methane emissions from landfill
  }
};

export interface CarbonData {
  transportation: {
    carMiles: number;
    carType: string;
    publicTransportHours: number;
    flightHours: number;
    walkingCyclingHours: number;
  };
  energy: {
    homeSize: string;
    electricityBill: number;
    heatingType: string;
    coolingHours: number;
    renewableEnergy: boolean;
  };
  food: {
    dietType: string;
    meatMealsPerWeek: number;
    localFoodPercentage: number;
    foodWastePercentage: number;
    organicPercentage: number;
  };
  shopping: {
    clothingFrequency: string;
    electronicsFrequency: string;
    sustainableChoices: number;
    secondHandPercentage: number;
  };
  waste: {
    recyclingPercentage: number;
    composting: boolean;
    wasteReduction: number;
  };
}

export interface CarbonResults {
  total: number;
  breakdown: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
    waste: number;
  };
  recommendations: string[];
}

export function calculateCarbonFootprint(data: CarbonData): CarbonResults {
  // Transportation calculations
  const transportationEmissions = calculateTransportation(data.transportation);
  
  // Energy calculations
  const energyEmissions = calculateEnergy(data.energy);
  
  // Food calculations
  const foodEmissions = calculateFood(data.food);
  
  // Shopping calculations
  const shoppingEmissions = calculateShopping(data.shopping);
  
  // Waste calculations (can be negative due to recycling benefits)
  const wasteEmissions = calculateWaste(data.waste);
  
  const total = transportationEmissions + energyEmissions + foodEmissions + shoppingEmissions + wasteEmissions;
  
  return {
    total: Math.max(0, total), // Ensure non-negative total
    breakdown: {
      transportation: transportationEmissions,
      energy: energyEmissions,
      food: foodEmissions,
      shopping: shoppingEmissions,
      waste: wasteEmissions
    },
    recommendations: generateRecommendations(data, {
      transportation: transportationEmissions,
      energy: energyEmissions,
      food: foodEmissions,
      shopping: shoppingEmissions,
      waste: wasteEmissions
    })
  };
}

function calculateTransportation(data: any): number {
  const { carMiles, carType, publicTransportHours, flightHours, walkingCyclingHours } = data;
  
  // Car emissions (weekly miles * 52 weeks)
  const carEmissionFactor = EMISSION_FACTORS.transportation[`${carType}_car` as keyof typeof EMISSION_FACTORS.transportation] || EMISSION_FACTORS.transportation.gasoline_car;
  const carEmissions = carMiles * 52 * carEmissionFactor;
  
  // Public transport (hours * average speed * weeks)
  const publicTransportMiles = publicTransportHours * 15 * 52; // assume 15 mph average
  const publicTransportEmissions = publicTransportMiles * EMISSION_FACTORS.transportation.public_transport;
  
  // Flight emissions (hours * average speed)
  const flightMiles = flightHours * 500; // assume 500 mph average
  const flightEmissions = flightMiles * EMISSION_FACTORS.transportation.flight_domestic;
  
  // Walking/cycling has zero emissions
  
  return (carEmissions + publicTransportEmissions + flightEmissions) / 1000; // Convert to tons
}

function calculateEnergy(data: any): number {
  const { homeSize, electricityBill, heatingType, coolingHours, renewableEnergy } = data;
  
  // Home size multipliers
  const sizeMultipliers = {
    small: 0.7,
    medium: 1.0,
    large: 1.5,
    'very-large': 2.0
  };
  
  const sizeMultiplier = sizeMultipliers[homeSize as keyof typeof sizeMultipliers] || 1.0;
  
  // Electricity emissions (monthly bill * 12 months * kWh per dollar * emission factor)
  const kWhPerDollar = 10; // approximate kWh per dollar
  const electricityKWh = electricityBill * 12 * kWhPerDollar * sizeMultiplier;
  const electricityEmissionFactor = renewableEnergy ? EMISSION_FACTORS.energy.renewable : EMISSION_FACTORS.energy.electricity_us_avg;
  const electricityEmissions = electricityKWh * electricityEmissionFactor;
  
  // Heating emissions (estimated based on type and home size)
  const heatingEmissionFactors = {
    gas: EMISSION_FACTORS.energy.natural_gas,
    electric: electricityEmissionFactor,
    oil: EMISSION_FACTORS.energy.heating_oil,
    'heat-pump': EMISSION_FACTORS.energy.heat_pump,
    wood: EMISSION_FACTORS.energy.wood_biomass
  };
  
  const heatingFactor = heatingEmissionFactors[heatingType as keyof typeof heatingEmissionFactors] || EMISSION_FACTORS.energy.natural_gas;
  const heatingEmissions = 5000 * sizeMultiplier * heatingFactor; // 5000 kWh base heating
  
  // Cooling emissions (hours per day * days per year * kW * emission factor)
  const coolingEmissions = coolingHours * 120 * 3 * electricityEmissionFactor; // 120 days, 3kW AC
  
  return (electricityEmissions + heatingEmissions + coolingEmissions) / 1000; // Convert to tons
}

function calculateFood(data: any): number {
  const { dietType, meatMealsPerWeek, localFoodPercentage, foodWastePercentage, organicPercentage } = data;
  
  // Base emissions by diet type (tons CO2 per year)
  const dietEmissions = {
    vegan: 1.5,
    vegetarian: 1.7,
    pescatarian: 2.3,
    omnivore: 2.5,
    'high-meat': 3.3
  };
  
  let baseEmissions = dietEmissions[dietType as keyof typeof dietEmissions] || dietEmissions.omnivore;
  
  // Adjust for actual meat consumption
  const avgMeatMeals = 10; // average omnivore meals per week
  const meatAdjustment = meatMealsPerWeek / avgMeatMeals;
  baseEmissions *= meatAdjustment;
  
  // Apply local food multiplier
  const localMultiplier = 1 - (localFoodPercentage / 100) * 0.15; // 15% reduction for 100% local
  baseEmissions *= localMultiplier;
  
  // Apply organic multiplier
  const organicMultiplier = 1 - (organicPercentage / 100) * 0.05; // 5% reduction for 100% organic
  baseEmissions *= organicMultiplier;
  
  // Apply food waste multiplier
  const wasteMultiplier = 1 + (foodWastePercentage / 100) * 0.3; // 30% increase for 100% waste
  baseEmissions *= wasteMultiplier;
  
  return baseEmissions;
}

function calculateShopping(data: any): number {
  const { clothingFrequency, electronicsFrequency, sustainableChoices, secondHandPercentage } = data;
  
  // Clothing emissions
  const clothingMultipliers = {
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    yearly: 1,
    rarely: 0.5
  };
  
  const clothingItems = clothingMultipliers[clothingFrequency as keyof typeof clothingMultipliers] || 12;
  const newClothingItems = clothingItems * (1 - secondHandPercentage / 100);
  const secondHandItems = clothingItems * (secondHandPercentage / 100);
  
  const clothingEmissions = (newClothingItems * EMISSION_FACTORS.shopping.clothing_new + 
                           secondHandItems * EMISSION_FACTORS.shopping.clothing_secondhand) / 1000;
  
  // Electronics emissions
  const electronicsMultipliers = {
    yearly: 1,
    'every-2-years': 0.5,
    'every-3-years': 0.33,
    'every-5-years': 0.2,
    rarely: 0.1
  };
  
  const electronicsPerYear = electronicsMultipliers[electronicsFrequency as keyof typeof electronicsMultipliers] || 0.5;
  const electronicsEmissions = electronicsPerYear * EMISSION_FACTORS.shopping.electronics / 1000;
  
  // Apply sustainable choices multiplier
  const sustainableMultiplier = 1 - (sustainableChoices / 100) * 0.3; // 30% reduction for 100% sustainable
  
  return (clothingEmissions + electronicsEmissions) * sustainableMultiplier;
}

function calculateWaste(data: any): number {
  const { recyclingPercentage, composting, wasteReduction } = data;
  
  // Average household waste: 1,600 kg per year
  const baseWaste = 1600;
  
  // Waste reduction
  const actualWaste = baseWaste * (1 - wasteReduction / 100);
  
  // Recycling benefits (negative emissions)
  const recyclableWaste = actualWaste * 0.3; // 30% of waste is recyclable
  const recycledWaste = recyclableWaste * (recyclingPercentage / 100);
  const recyclingBenefit = recycledWaste * EMISSION_FACTORS.waste.recycling_benefit;
  
  // Composting benefits
  const organicWaste = actualWaste * 0.3; // 30% of waste is organic
  const compostingBenefit = composting ? organicWaste * EMISSION_FACTORS.waste.composting_benefit : 0;
  
  // Landfill emissions from remaining waste
  const landfillWaste = actualWaste - recycledWaste - (composting ? organicWaste : 0);
  const landfillEmissions = landfillWaste * EMISSION_FACTORS.waste.landfill_emission;
  
  return (landfillEmissions + recyclingBenefit + compostingBenefit) / 1000; // Convert to tons
}

function generateRecommendations(data: CarbonData, breakdown: any): string[] {
  const recommendations: string[] = [];
  
  // Transportation recommendations
  if (breakdown.transportation > 2) {
    if (data.transportation.carMiles > 100) {
      recommendations.push("Consider carpooling, public transport, or working from home to reduce driving");
    }
    if (data.transportation.carType === 'gasoline' || data.transportation.carType === 'diesel') {
      recommendations.push("Switching to a hybrid or electric vehicle could reduce transport emissions by 40-70%");
    }
    if (data.transportation.flightHours > 20) {
      recommendations.push("Consider offsetting flight emissions or choosing closer destinations");
    }
  }
  
  // Energy recommendations
  if (breakdown.energy > 2) {
    if (!data.energy.renewableEnergy) {
      recommendations.push("Switch to renewable energy to reduce home emissions by 50-80%");
    }
    if (data.energy.electricityBill > 150) {
      recommendations.push("Improve home insulation and use energy-efficient appliances");
    }
    if (data.energy.heatingType === 'oil') {
      recommendations.push("Consider switching from oil heating to a heat pump or natural gas");
    }
  }
  
  // Food recommendations
  if (breakdown.food > 2) {
    if (data.food.meatMealsPerWeek > 10) {
      recommendations.push("Reducing meat consumption by 2-3 meals per week can significantly lower food emissions");
    }
    if (data.food.localFoodPercentage < 30) {
      recommendations.push("Buying more local and seasonal food reduces transport emissions");
    }
    if (data.food.foodWastePercentage > 25) {
      recommendations.push("Reducing food waste through meal planning and proper storage");
    }
  }
  
  // Shopping recommendations
  if (breakdown.shopping > 1) {
    if (data.shopping.secondHandPercentage < 30) {
      recommendations.push("Buying second-hand items can reduce shopping emissions by 80%");
    }
    if (data.shopping.sustainableChoices < 50) {
      recommendations.push("Choose sustainable and durable products to reduce long-term impact");
    }
  }
  
  // Waste recommendations
  if (breakdown.waste > 0) {
    if (data.waste.recyclingPercentage < 70) {
      recommendations.push("Increase recycling rate to reduce landfill emissions");
    }
    if (!data.waste.composting) {
      recommendations.push("Start composting organic waste to reduce methane emissions");
    }
  }
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
}