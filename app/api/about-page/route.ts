/**
 * About Page Data API Route
 * Serves about page content from Contentstack
 */

import { NextResponse } from 'next/server';
import { getAboutPageContent } from '@/lib/contentstack/about';

export async function GET() {
  try {
    const content = await getAboutPageContent();
    
    if (!content) {
      return NextResponse.json(
        { error: 'About page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching about page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about page content' },
      { status: 500 }
    );
  }
}

