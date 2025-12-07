import { NextResponse } from 'next/server';
import { getHomepageContent } from '@/lib/contentstack/homepage';

export async function GET() {
  try {
    const content = await getHomepageContent();
    
    if (content) {
      return NextResponse.json(content);
    }
    
    return NextResponse.json(
      { error: 'Homepage content not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

