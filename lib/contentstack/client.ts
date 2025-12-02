/**
 * Contentstack Client Setup
 * Initializes Content Delivery API (CDA) and Content Management API (CMA) clients
 */

import Contentstack from 'contentstack';
import * as contentstackManagement from '@contentstack/management';

// Content Delivery API (CDA) - For reading published content
const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
export const Stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENV || 'production',
  region: region as any, // Type assertion for Contentstack SDK region
});

// Content Management API (CMA) - For creating/updating content
export const getManagementClient = () => {
  if (!process.env.CONTENTSTACK_MANAGEMENT_TOKEN) {
    throw new Error('CONTENTSTACK_MANAGEMENT_TOKEN is not defined');
  }

  return contentstackManagement.client({
    authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
  });
};

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
  console.log('  Contentstack Configuration:');
  console.log('   Region:', process.env.NEXT_PUBLIC_CONTENTSTACK_REGION);
  console.log('   Environment:', process.env.NEXT_PUBLIC_CONTENTSTACK_ENV);
  console.log('   API Key:', process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? 'Set' : 'Missing');
  console.log('   Delivery Token:', process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? 'Set' : 'Missing');
}

