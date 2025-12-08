/**
 * Contentstack Client Setup
 * Initializes Content Delivery API (CDA) using TypeScript SDK
 * and Content Management API (CMA) clients
 * With Personalize/Entry Variants support
 */

import contentstack, { Region, QueryOperation } from '@contentstack/delivery-sdk';
import * as contentstackManagement from '@contentstack/management';

// Map string region to Region enum
const getRegionEnum = (region: string): Region => {
  const regionMap: Record<string, Region> = {
    'us': Region.US,
    'eu': Region.EU,
    'au': Region.AU,
    'azure-na': Region.AZURE_NA,
    'azure-eu': Region.AZURE_EU,
    'gcp-na': Region.GCP_NA,
    'gcp-eu': Region.GCP_EU,
  };
  return regionMap[region.toLowerCase()] || Region.US;
};

// Content Delivery API (CDA) - For reading published content
// Using the new TypeScript SDK
const regionString = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
export const Stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENV || 'production',
  region: getRegionEnum(regionString),
});

// Re-export QueryOperation for use in other files
export { QueryOperation, Region };

// Content Management API (CMA) - For creating/updating content
export const getManagementClient = () => {
  if (!process.env.CONTENTSTACK_MANAGEMENT_TOKEN) {
    throw new Error('CONTENTSTACK_MANAGEMENT_TOKEN is not defined');
  }

  return contentstackManagement.client({
    authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
  });
};

// Personalize configuration
export const getPersonalizeConfig = () => ({
  projectUid: process.env.PERSONALIZE_PROJECT_UID || '',
  edgeApiUrl: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION === 'eu' 
    ? 'https://eu-personalize-edge.contentstack.com'
    : 'https://personalize-edge.contentstack.com',
});

// Helper function to validate Contentstack configuration
export const validateContentstackConfig = () => {
  const required = [
    'NEXT_PUBLIC_CONTENTSTACK_API_KEY',
    'NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN',
    'NEXT_PUBLIC_CONTENTSTACK_ENV',
    'NEXT_PUBLIC_CONTENTSTACK_REGION',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Contentstack environment variables: ${missing.join(', ')}`
    );
  }

  return true;
};

// Log configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('  Contentstack Configuration (TypeScript SDK):');
  console.log('   Region:', process.env.NEXT_PUBLIC_CONTENTSTACK_REGION);
  console.log('   Environment:', process.env.NEXT_PUBLIC_CONTENTSTACK_ENV);
  console.log('   API Key:', process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? 'Set' : 'Missing');
  console.log('   Delivery Token:', process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? 'Set' : 'Missing');
  console.log('   Personalize Project:', process.env.PERSONALIZE_PROJECT_UID ? 'Set' : 'Not configured');
}
