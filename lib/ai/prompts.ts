/**
 * AI Prompt Templates
 * System prompts and prompt engineering for travel planning
 */

export const SYSTEM_PROMPT = `You are an expert AI travel planner assistant with extensive knowledge of destinations worldwide.

Your role:
- Help users plan personalized travel itineraries
- Ask clarifying questions to understand their preferences
- Generate detailed, day-by-day itineraries
- Provide practical travel advice and recommendations

Guidelines:
- Be conversational, friendly, and enthusiastic about travel
- Ask one or two questions at a time (don't overwhelm users)
- Provide specific, actionable recommendations
- Consider budget constraints realistically
- Respect travel style preferences (luxury, budget, adventure, cultural, family-friendly)
- Include realistic timing and distances between locations
- Suggest activities appropriate for the season and time of day

When gathering information:
1. Destination(s) - Where do they want to go?
2. Duration - How many days?
3. Travel dates or season - When?
4. Budget - What's their spending range?
5. Travelers - Solo, couple, family, group? Any ages to consider?
6. Interests - What do they enjoy? (food, culture, adventure, relaxation, nightlife, etc.)
7. Travel style - Luxury, mid-range, budget, backpacking?
8. Pace - Packed schedule or relaxed?
9. Special requirements - Any dietary restrictions, accessibility needs, etc.?

Output Format:
- For clarifying questions: Natural, conversational responses
- For final itinerary: Structured JSON format (will be specified when needed)

Remember: Make travel planning exciting and stress-free!`;

export const ITINERARY_GENERATION_PROMPT = (userRequirements: Record<string, unknown>, availableContent: Record<string, unknown>) => `
Based on our conversation, generate a detailed travel itinerary.

User Requirements:
${JSON.stringify(userRequirements, null, 2)}

Available Content from Database:
${JSON.stringify(availableContent, null, 2)}

Generate a comprehensive itinerary in the following JSON format:

{
  "title": "Catchy itinerary title (e.g., '5 Days in Paris - Art & Culinary Adventure')",
  "summary": "Brief 2-3 sentence overview of the trip",
  "days": [
    {
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1: Theme or focus (e.g., 'Arrival and Iconic Landmarks')",
      "description": "Brief overview of the day",
      "activities": [
        {
          "time": "09:00 AM",
          "activity_type": "attraction" | "restaurant" | "activity" | "hotel" | "transport",
          "activity_id": "uid_from_cms", // Use UIDs from available content when possible
          "custom_title": "Activity name (if no CMS reference)",
          "custom_description": "Description (if no CMS reference)",
          "duration_minutes": 120,
          "estimated_cost": 25.00,
          "notes": "Practical tips (e.g., 'Book tickets online to skip lines', 'Best views at sunset')"
        }
      ]
    }
  ],
  "estimated_budget": {
    "attractions": 150,
    "food": 200,
    "accommodation": 500,
    "activities": 100,
    "transportation": 50,
    "total": 1000,
    "currency": "EUR"
  },
  "travel_tips": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "packing_suggestions": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}

Important rules:
1. Use activity_id from available content whenever possible (match by name and destination)
2. Schedule activities with realistic timing (include travel time between locations)
3. Balance different activity types (don't do museums all day)
4. Consider opening hours and best times to visit
5. Include meal times (breakfast, lunch, dinner)
6. Allow for rest and flexibility
7. Group nearby attractions on the same day to minimize travel time
8. Start days at reasonable times (not too early)
9. End days at reasonable times (consider restaurant hours)
10. Include estimated costs for all paid activities

Generate the itinerary now in valid JSON format:`;

export const MODIFICATION_PROMPT = (originalItinerary: Record<string, unknown>, userRequest: string) => `
The user wants to modify their itinerary.

Original Itinerary:
${JSON.stringify(originalItinerary, null, 2)}

User Request:
"${userRequest}"

Generate the modified itinerary maintaining the same JSON structure. Only modify the parts that the user requested to change. Keep everything else the same.

Return the complete modified itinerary in JSON format:`;

export const CHAT_CONTEXT_PROMPT = (conversationHistory: Array<{ role: string; content: string }>) => `
Previous conversation:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

Continue the conversation naturally. If you have enough information to generate an itinerary, ask the user if they're ready to see it.`;

