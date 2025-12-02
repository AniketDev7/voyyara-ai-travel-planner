/**
 * Save Itinerary API Route
 * Saves generated itinerary to Contentstack using Management API
 */

import { NextResponse } from 'next/server';
import axios from 'axios';

// Get Contentstack Management API base URL
const getBaseURL = () => {
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
  switch (region) {
    case 'eu':
      return 'https://eu-api.contentstack.com/v3';
    case 'azure-na':
      return 'https://azure-na-api.contentstack.com/v3';
    case 'azure-eu':
      return 'https://azure-eu-api.contentstack.com/v3';
    default:
      return 'https://api.contentstack.com/v3';
  }
};

export async function POST(req: Request) {
  try {
    const itineraryData = await req.json();

    // Validate required fields
    if (!itineraryData.title || !itineraryData.daily_plan) {
      return NextResponse.json(
        { error: 'Title and daily plan are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = itineraryData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prepare entry data
    const entryData = {
      title: itineraryData.title,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      summary: itineraryData.summary || '',
      number_of_days: itineraryData.days?.length || 0,
      number_of_travelers: itineraryData.number_of_travelers || 1,
      estimated_budget: itineraryData.estimated_budget?.total || 0,
      currency: itineraryData.estimated_budget?.currency || 'USD',
      daily_plan: itineraryData.daily_plan || itineraryData.days,
      generated_by_ai: true,
      status: 'Draft',
      is_public: false,
    };

    // Save to Contentstack using Management API
    const response = await axios.post(
      `${getBaseURL()}/content_types/itinerary/entries`,
      { entry: entryData },
      {
        headers: {
          'api_key': process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          'authorization': process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      itinerary: response.data.entry,
      uid: response.data.entry.uid,
    });
  } catch (error) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Error saving itinerary:', err.response?.data || err);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorData = err.response?.data;
    return NextResponse.json(
      { 
        error: 'Failed to save itinerary',
        details: errorData || errorMessage 
      },
      { status: 500 }
    );
  }
}

