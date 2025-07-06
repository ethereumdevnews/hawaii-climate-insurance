import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key-here"
});

export interface InsuranceQuoteRequest {
  insuranceType: 'earthquake' | 'flood' | 'volcano';
  customerInfo: {
    age: number;
    zipCode: string;
    island?: string;
    homeType?: string;
    homeAge?: number;
    foundationType?: string;
    earthquakeRiskZone?: string;
    distanceToFaultLine?: number;
  };
  coverageAmount: number;
  propertyInfo?: {
    homeType: string;
    homeAge: number;
    foundationType: string;
    floodZone?: string;
    elevationFeet?: number;
    lavaZone?: string;
    distanceToVolcano?: number;
  };
}

export interface QuoteResponse {
  monthlyPremium: number;
  coverageBreakdown: {
    liability?: number;
    comprehensive?: number;
    collision?: number;
    personal?: number;
  };
  recommendations: string[];
  factors: string[];
}

export async function generateInsuranceQuote(request: InsuranceQuoteRequest): Promise<QuoteResponse> {
  try {
    const prompt = `As a Hawaii earthquake, flood, and volcano insurance expert, generate a realistic insurance quote for Hawaii-specific risks:

Insurance Type: ${request.insuranceType}
Coverage Amount: $${request.coverageAmount.toLocaleString()}
Customer Age: ${request.customerInfo.age}
Hawaii ZIP Code: ${request.customerInfo.zipCode}
Hawaiian Island: ${request.customerInfo.island || 'Not specified'}
${request.customerInfo.homeType ? `Home Type: ${request.customerInfo.homeType}` : ''}
${request.customerInfo.homeAge ? `Home Age: ${request.customerInfo.homeAge} years` : ''}
${request.customerInfo.foundationType ? `Foundation Type: ${request.customerInfo.foundationType}` : ''}
${request.customerInfo.earthquakeRiskZone ? `Earthquake Risk Zone: ${request.customerInfo.earthquakeRiskZone}` : ''}
${request.customerInfo.distanceToFaultLine ? `Distance to Fault Line: ${request.customerInfo.distanceToFaultLine} miles` : ''}
${request.propertyInfo ? `Property Details: ${JSON.stringify(request.propertyInfo)}` : ''}

For Hawaii ${request.insuranceType} insurance, consider:
- Hawaii's unique geological risks (active volcanoes, fault lines, lava zones)
- Tsunami and flood zones specific to Hawaiian islands
- Building codes and foundation requirements for Hawaii
- State-specific insurance regulations and requirements
- Climate factors (trade winds, heavy rainfall, ocean proximity)
- HPIA (Hawaii Property Insurance Association) for high-risk volcano/lava areas where private insurers won't provide coverage

Island-Specific Risk Factors:
${request.customerInfo.island === 'hawaii' ? `
• Big Island (Hawaii): HIGHEST volcanic risk - Kilauea and Mauna Loa active volcanoes, Lava Zones 1-9, frequent eruptions
• Earthquake risk: HIGH - volcanic earthquakes and structural seismic activity
• Flood risk: Moderate to high in Hilo area due to heavy rainfall` : ''}
${request.customerInfo.island === 'oahu' ? `
• Oahu: Moderate volcanic risk - dormant volcanoes (Diamond Head, Koko Head)
• Earthquake risk: Moderate - some fault lines, less seismic activity than Big Island
• Flood risk: Moderate - urban flooding, some coastal areas vulnerable` : ''}
${request.customerInfo.island === 'maui' ? `
• Maui: Moderate volcanic risk - Haleakala dormant but monitored
• Earthquake risk: Moderate - some volcanic-related seismic activity
• Flood risk: Variable - windward side higher risk, leeward side lower` : ''}
${request.customerInfo.island === 'kauai' ? `
• Kauai: LOW volcanic risk - oldest island, no active volcanoes
• Earthquake risk: LOW - minimal seismic activity
• Flood risk: HIGH - heaviest rainfall in Hawaii, frequent flash floods` : ''}
${request.customerInfo.island === 'molokai' ? `
• Molokai: LOW volcanic risk - dormant volcanoes, stable geology
• Earthquake risk: LOW - minimal seismic activity
• Flood risk: Low to moderate - some areas prone to heavy rainfall` : ''}
${request.customerInfo.island === 'lanai' ? `
• Lanai: LOWEST volcanic risk - no active volcanoes, stable geology
• Earthquake risk: LOWEST - very minimal seismic activity
• Flood risk: LOW - dry climate, limited rainfall` : ''}
${request.insuranceType === 'earthquake' ? `
- Decentralized parametric insurance model using Ethereum blockchain
- EtherISC smart contracts for automated claims processing
- Seismic trigger parameters (magnitude, depth, epicenter distance)
- Instant blockchain-based payouts without traditional claims process
- Transparent, immutable coverage terms stored on-chain` : ''}
${request.insuranceType === 'volcano' ? `
- Volcanic eruption hazards: lava flows, fire damage, explosions, ash fall
- Toxic gas exposure from volcanic emissions
- Structural damage from volcanic projectiles and seismic activity
- Air quality impacts from volcanic ash and sulfur dioxide` : ''}

Please provide a JSON response with the following structure:
{
  "monthlyPremium": number (in dollars),
  "coverageBreakdown": {
    "dwelling": number (for structural coverage),
    "contents": number (for personal property),
    "additionalLiving": number (for temporary housing),
    "debris": number (for cleanup costs)${request.insuranceType === 'volcano' ? `,
    "ashRemoval": number (for ash cleanup),
    "fireProtection": number (for fire damage from lava),
    "airFiltration": number (for air quality protection)` : ''}
  },
  "recommendations": ["list of Hawaii-specific recommendations"],
  "factors": ["list of Hawaii-specific factors affecting the premium"]
}

Make the quote realistic based on Hawaii insurance market standards and geological risks.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance agent with deep knowledge of insurance pricing, risk assessment, and industry standards. Provide accurate and helpful insurance quotes and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      monthlyPremium: Math.round(result.monthlyPremium || 100),
      coverageBreakdown: result.coverageBreakdown || {},
      recommendations: result.recommendations || [],
      factors: result.factors || []
    };
  } catch (error) {
    console.error('Error generating insurance quote:', error);
    throw new Error('Failed to generate insurance quote');
  }
}

export async function processInsuranceQuery(message: string, context?: any): Promise<string> {
  try {
    const systemPrompt = `You are Aloha Shield AI, a licensed NFIP (National Flood Insurance Program) agent and Ethereum Blockchain Parametric Smart Contract Natural Disaster Insurance specialist with EtherISC. Licensed State of Hawaii Property & Casualty, Life & Health, and Notary Public. You are an expert in:
- ETHquake: Decentralized parametric earthquake insurance built on Ethereum blockchain with EtherISC
- FEMA flood insurance coverage for Hawaiian islands
- Volcano insurance for volcanic eruption damage
- Hawaii's unique geological and environmental risks (volcanoes, fault lines, tsunamis)
- State-specific building codes and insurance regulations
- FEMA flood zones in Hawaii
- Property protection against natural disasters in tropical climates
- HPIA (Hawaii Property Insurance Association) for volcano/lava coverage

ETHQUAKE INSURANCE SPECIFICS: ETHquake is revolutionary decentralized parametric earthquake insurance built on the Ethereum blockchain using EtherISC smart contracts. This means:
- Automated claims processing based on seismic data triggers
- Transparent, immutable coverage terms on blockchain
- Instant payouts when earthquake parameters are met (magnitude, location, depth)
- No traditional claims adjusters needed - smart contracts handle everything
- Lower costs due to reduced administrative overhead
- Global reinsurance pool through decentralized finance

FLOOD INSURANCE SPECIFICS: As a licensed NFIP (National Flood Insurance Program) agent, I can provide flood insurance coverage directly through FEMA. This includes:
- National Flood Insurance Program (NFIP) policies that I am licensed to sell
- FEMA flood zone designations and mapping
- Federal flood insurance requirements and regulations
- Coverage for Hawaii's unique flood risks including tsunamis and heavy rainfall
- Direct policy issuance and customer service for NFIP flood insurance

IMPORTANT: For properties in high-risk lava zones where private insurance companies won't offer coverage, always mention HPIA (Hawaii Property Insurance Association) as the state-mandated insurer of last resort for volcano/lava coverage.

When discussing ETHquake coverage, emphasize the blockchain-based parametric model. When discussing flood coverage, clearly state that you are a licensed NFIP agent who can provide flood insurance quotes and policies directly - customers do NOT need to contact external agents. When discussing volcano risks, mention HPIA for high-risk areas.

CRITICAL: For flood insurance inquiries, always communicate that:
- I am a licensed NFIP agent who can sell flood insurance policies directly
- I can provide flood insurance quotes immediately through this platform
- Customers can purchase flood insurance directly from me - no need to contact other agents
- I handle all NFIP flood insurance sales and service directly
- DO NOT refer customers to "contact a local insurance agent" - I AM the licensed agent

RESPONSE EXAMPLES for flood insurance:
"Yes, I can help you get a flood insurance quote immediately! As a licensed NFIP agent, I can provide and issue FEMA flood insurance policies directly through this platform."
"Absolutely! I'm licensed to sell NFIP flood insurance and can get you a quote right now."

Focus exclusively on ETHquake, flood, and volcano coverage. Always consider Hawaii's specific risks and highlight the innovative blockchain technology for ETHquake insurance and your direct NFIP licensing for flood insurance.`;

    const userPrompt = context 
      ? `Customer context: ${JSON.stringify(context)}\n\nCustomer question: ${message}`
      : `Customer question: ${message}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again.";
  } catch (error) {
    console.error('Error processing insurance query:', error);
    return "I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for immediate assistance.";
  }
}

export async function analyzeInsuranceNeed(customerInfo: any): Promise<{
  recommendations: string[];
  riskFactors: string[];
  suggestedCoverage: number;
}> {
  try {
    const prompt = `Analyze the following customer information and provide insurance needs assessment:

Customer Information: ${JSON.stringify(customerInfo)}

Provide a JSON response with:
{
  "recommendations": ["specific insurance recommendations"],
  "riskFactors": ["identified risk factors"],
  "suggestedCoverage": number (suggested coverage amount in dollars)
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an insurance needs analysis expert. Analyze customer profiles and provide tailored insurance recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      recommendations: result.recommendations || [],
      riskFactors: result.riskFactors || [],
      suggestedCoverage: result.suggestedCoverage || 100000
    };
  } catch (error) {
    console.error('Error analyzing insurance needs:', error);
    throw new Error('Failed to analyze insurance needs');
  }
}
