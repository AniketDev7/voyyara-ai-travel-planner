import { NextResponse } from 'next/server';

/**
 * API Route: POST /api/enquiry
 * Forwards contact form submissions to Contentstack Automate HTTP Trigger
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Contentstack Automate HTTP Trigger URL
    // This URL is generated when you create an HTTP Trigger in Automate
    const automateWebhookUrl = process.env.CONTENTSTACK_AUTOMATE_WEBHOOK_URL;

    if (!automateWebhookUrl) {
      console.error('[Enquiry] Automate webhook URL not configured');
      // Still return success to user but log the error
      // In production, you might want to handle this differently
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        // For development: indicate webhook not configured
        ...(process.env.NODE_ENV === 'development' && {
          warning: 'Automate webhook not configured - message not sent to Automate'
        })
      });
    }

    // Prepare payload for Contentstack Automate
    const payload = {
      enquiry: {
        name,
        email,
        subject: subject || 'General Enquiry',
        message,
        submitted_at: new Date().toISOString(),
        source: 'voyyara-website',
        page_url: request.headers.get('referer') || 'unknown',
      },
      metadata: {
        user_agent: request.headers.get('user-agent') || 'unknown',
        timestamp: Date.now(),
      }
    };

    // Send to Contentstack Automate
    const automateResponse = await fetch(automateWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!automateResponse.ok) {
      console.error('[Enquiry] Automate webhook failed:', automateResponse.status);
      // Still return success to user - we don't want to expose internal errors
    } else {
      console.log('[Enquiry] Successfully sent to Automate');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });

  } catch (error) {
    console.error('[Enquiry] Error processing enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process your enquiry. Please try again.' },
      { status: 500 }
    );
  }
}

