/**
 * AI Itinerary Generation Logic
 */

import { openai, DEFAULT_MODEL } from './openai';
import { SYSTEM_PROMPT, ITINERARY_GENERATION_PROMPT } from './prompts';
import { getAllDestinations, getAllAttractions } from '../contentstack';

export interface UserRequirements {
  destinations: string[];
  duration: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  currency?: string;
  travelers: number;
  travelerTypes?: string[]; // ['adults', 'children', 'seniors']
  interests?: string[];
  travelStyle?: string; // 'luxury', 'mid-range', 'budget', 'backpacking'
  pace?: string; // 'relaxed', 'moderate', 'packed'
  specialRequirements?: string[];
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  days: DayPlan[];
  estimated_budget: BudgetBreakdown;
  travel_tips: string[];
  packing_suggestions: string[];
}

export interface DayPlan {
  day_number: number;
  date: string;
  title: string;
  description: string;
  activities: ActivityPlan[];
}

export interface ActivityPlan {
  time: string;
  activity_type: 'attraction' | 'restaurant' | 'activity' | 'hotel' | 'transport';
  activity_id?: string; // Contentstack UID
  custom_title?: string;
  custom_description?: string;
  duration_minutes: number;
  estimated_cost?: number;
  notes?: string;
}

export interface BudgetBreakdown {
  attractions: number;
  food: number;
  accommodation: number;
  activities: number;
  transportation: number;
  total: number;
  currency: string;
}

/**
 * Generate a complete itinerary based on user requirements
 */
export async function generateItinerary(
  requirements: UserRequirements
): Promise<GeneratedItinerary> {
  try {
    // 1. Fetch relevant content from Contentstack
    console.log('Fetching destinations and attractions from Contentstack...');
    const [destinations, attractions] = await Promise.all([
      getAllDestinations(),
      getAllAttractions(),
    ]);

    // 2. Filter content relevant to user's destinations
    const relevantDestinations = destinations.filter((dest) =>
      requirements.destinations.some((reqDest) =>
        dest.title.toLowerCase().includes(reqDest.toLowerCase()) ||
        dest.country.toLowerCase().includes(reqDest.toLowerCase())
      )
    );

    const relevantAttractions = attractions.filter((attr) =>
      attr.destination?.some((dest) =>
        relevantDestinations.some((relDest) => relDest.uid === dest.uid)
      )
    );

    console.log(`Found ${relevantDestinations.length} destinations and ${relevantAttractions.length} attractions`);

    // 3. Prepare available content for AI
    const availableContent = {
      destinations: relevantDestinations.map((d) => ({
        uid: d.uid,
        title: d.title,
        country: d.country,
        description: d.short_description,
        latitude: d.latitude,
        longitude: d.longitude,
      })),
      attractions: relevantAttractions.map((a) => ({
        uid: a.uid,
        title: a.title,
        category: a.category,
        description: a.description,
        duration_minutes: a.average_visit_duration,
        entry_fee: a.entry_fee,
        currency: a.currency,
        latitude: a.latitude,
        longitude: a.longitude,
        ai_tags: a.ai_tags,
      })),
    };

    // 4. Generate itinerary with GPT-4
    console.log('Generating itinerary with AI...');
    const prompt = ITINERARY_GENERATION_PROMPT(requirements, availableContent);

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const generatedContent = response.choices[0].message.content;
    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    const itinerary: GeneratedItinerary = JSON.parse(generatedContent);
    console.log('Itinerary generated successfully!');

    return itinerary;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}

/**
 * Extract user requirements from conversation messages
 */
export function extractRequirementsFromChat(messages: Array<{ role: string; content: string }>): Partial<UserRequirements> {
  // This is a simplified version - in production, you'd use AI to extract structured data
  const requirements: Partial<UserRequirements> = {
    travelers: 1,
    travelStyle: 'mid-range',
    pace: 'moderate',
  };

  // Simple keyword extraction from messages
  const conversationText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ')
    .toLowerCase();

  // Extract budget
  const budgetMatch = conversationText.match(/\$?\d+,?\d*/);
  if (budgetMatch) {
    requirements.budget = parseInt(budgetMatch[0].replace(/\$|,/g, ''));
  }

  // Extract duration (days)
  const durationMatch = conversationText.match(/(\d+)\s*(day|days|night|nights)/i);
  if (durationMatch) {
    requirements.duration = parseInt(durationMatch[1]);
  }

  return requirements;
}

