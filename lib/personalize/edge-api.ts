/**
 * Contentstack Personalize Edge API Integration
 * Fetches the correct variant UID based on user attributes
 */

interface PersonalizeVariantResponse {
  variantUid: string | null;
  experienceUid: string | null;
  audienceUid: string | null;
}

/**
 * Get variant UID from Personalize Edge API based on user attributes
 */
export async function getPersonalizeVariant(
  attributes: Record<string, string>
): Promise<PersonalizeVariantResponse> {
  const projectUid = process.env.PERSONALIZE_PROJECT_UID;
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
  
  if (!projectUid) {
    console.log('Personalize project UID not configured');
    return { variantUid: null, experienceUid: null, audienceUid: null };
  }

  const edgeApiUrl = region === 'eu'
    ? 'https://eu-personalize-edge.contentstack.com'
    : 'https://personalize-edge.contentstack.com';

  try {
    // Build the request with user attributes
    const requestBody = {
      attributes: attributes,
    };

    console.log(`Calling Personalize Edge API with attributes:`, attributes);

    const response = await fetch(`${edgeApiUrl}/v2/personalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-uid': projectUid,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Personalize Edge API response:', JSON.stringify(data, null, 2));
      
      // Extract the variant UID from the response
      // The response contains matched experiences and their variants
      if (data.experiences && data.experiences.length > 0) {
        const experience = data.experiences[0];
        return {
          variantUid: experience.variant_uid || null,
          experienceUid: experience.experience_uid || null,
          audienceUid: experience.audience_uid || null,
        };
      }
    } else {
      console.log(`Personalize Edge API error: ${response.status}`);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error calling Personalize Edge API:', error);
  }

  return { variantUid: null, experienceUid: null, audienceUid: null };
}

/**
 * Get variant for currency preference
 */
export async function getVariantForCurrency(currency: string): Promise<string | null> {
  const result = await getPersonalizeVariant({
    user_currency: currency,
  });
  return result.variantUid;
}

/**
 * Get variant for language preference
 */
export async function getVariantForLanguage(language: string): Promise<string | null> {
  const result = await getPersonalizeVariant({
    user_language: language,
  });
  return result.variantUid;
}

/**
 * Get variant for combined preferences
 */
export async function getVariantForPreferences(
  currency?: string,
  language?: string,
  travelStyle?: string
): Promise<string | null> {
  const attributes: Record<string, string> = {};
  
  if (currency) attributes.user_currency = currency;
  if (language) attributes.user_language = language;
  if (travelStyle) attributes.price_type = travelStyle;
  
  const result = await getPersonalizeVariant(attributes);
  return result.variantUid;
}

