/**
 * Contact Page Data API Route
 * Serves contact page content from Contentstack
 */

import { NextResponse } from 'next/server';
import { getContactPageContent } from '@/lib/contentstack/contact';

export async function GET() {
  try {
    const content = await getContactPageContent();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Contact page content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact page content' },
      { status: 500 }
    );
  }
}

