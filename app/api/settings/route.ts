import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/contentstack/settings';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    
    if (settings) {
      return NextResponse.json(settings);
    }
    
    return NextResponse.json(
      { error: 'Site settings not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

