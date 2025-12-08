# ✈️ Voyyara - AI Travel Planner

> Your AI-powered travel companion. Plan perfect trips with personalized itineraries in seconds, powered by Next.js 15, React 19, and the full Contentstack DXP suite.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Contentstack](https://img.shields.io/badge/Contentstack-DXP-purple)](https://www.contentstack.com/)
[![Launch](https://img.shields.io/badge/Contentstack-Launch-blue)](https://www.contentstack.com/products/launch)

## 🏗️ Contentstack Products Integrated

| Product | Usage | Impact |
|---------|-------|--------|
| **Headless CMS** | Stores destinations, itineraries, attractions, and site content | Central content repository for all travel data |
| **Launch** | Hosts and deploys the Next.js application | Production-ready hosting with automatic deployments |
| **Automate** | Triggers email notifications on contact form submissions | Automated workflow for customer enquiries |
| **Generative AI API** | Powers the AI travel planner with Brand Kit voice profile | On-brand AI responses using Voyyara voice |
| **Brand Kit** | Defines voice profile for consistent AI-generated content | Ensures all AI content matches brand tone |
| **Personalize** | Enables entry variants for different travel styles | Luxury/Budget variants of itineraries |

## ✨ Features

- **Voyyara Genie** - AI travel assistant (supports OpenAI GPT-4 or Contentstack Gen AI)
- **Natural Conversations** - Chat naturally to plan your dream trip
- **Smart Recommendations** - Discover hidden gems and popular attractions
- **Detailed Itineraries** - Day-by-day plans with timing and activities
- **Beautiful UI** - Vibrant design with Poppins font and smooth animations
- **Animated Backgrounds** - Stunning floating elements and gradients
- **Fully Responsive** - Perfect experience on any device
- **Multiple Destinations** - Vietnam, Japan, Thailand, South Korea, Singapore & more
- **CMS Integration** - Content managed through Contentstack
- **Email Notifications** - Automated enquiry notifications via Contentstack Automate
- ✈️ **Predefined Itineraries** - Ready-made travel plans with detailed day-by-day schedules

## Quick Start

### Prerequisites

- Node.js 18+
- Contentstack account (EU region)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd voyyara-ai-travel-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your actual keys:
   - Get Contentstack credentials from: https://app.contentstack.com
   - Get OpenAI API key from: https://platform.openai.com/api-keys

4. **Set up Contentstack content types**
   ```bash
   npm run setup
   ```

   This creates:
   - Content types (destination, attraction, itinerary)
   - Sample destination (Paris)
   - Sample attractions (Eiffel Tower, Louvre, etc.)

5. **Publish entries in Contentstack**
   - Go to your Contentstack dashboard
   - Navigate to Entries
   - Publish all newly created entries

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Visit http://localhost:3000


## Usage

### Planning a Trip

1. Visit the Voyyara homepage
2. Click "Start Planning" 
3. Chat with Voyyara Genie:
   ```
   "I want to visit Vietnam for 7 days with $1500 budget"
   "Plan a cultural trip to Japan for 10 days"
   "Create a beach vacation itinerary in Thailand"
   ```
4. Review the AI-generated itinerary
5. Customize and save your plan

### Exploring Destinations

1. Click "Destinations" in the navigation
2. Browse featured destinations (Vietnam, Japan, Thailand, etc.)
3. View predefined itineraries for each destination
4. Click "Plan with AI" to customize any itinerary
5. Use "Chat with Voyyara Genie" for personalized planning

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Poppins Font** - Modern, geometric typography
- **Framer Motion** - Smooth animations and transitions

### Backend & APIs
- **Next.js API Routes** - Backend endpoints
- **OpenAI GPT-4** - AI itinerary generation (switchable)
- **Contentstack Generative AI** - On-brand AI responses with Voice Profile
- **Vercel AI SDK** - Streaming responses
- **Contentstack CMS** - Content management
  - Content Delivery API (CDA) - Read content
  - Content Management API (CMA) - Write content
  - Generative AI API - AI content generation
  - Automate Webhooks - Workflow automation

### State & Forms
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation


## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Setup
npm run setup        # Create Contentstack content types
```

## 📚 Documentation

### Contentstack Integration
For detailed information about our CMS integration, see [CONTENTSTACK_INTEGRATION.md](./CONTENTSTACK_INTEGRATION.md)

This document covers:
- Content types and schemas
- API integration patterns
- Data flow architecture
- Asset management
- Best practices

## Key Features Implementation

### AI Chat with Streaming

The app uses Vercel AI SDK for real-time streaming responses:

```typescript
import { useChat } from 'ai/react';

const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
});
```

### Contentstack Integration

Content is fetched using the CDA SDK:

```typescript
import { getAllDestinations } from '@/lib/contentstack';

const destinations = await getAllDestinations();
```

### Itinerary Generation

GPT-4 generates structured itineraries:

```typescript
import { generateItinerary } from '@/lib/ai/generate-itinerary';

const itinerary = await generateItinerary({
  destinations: ['Paris'],
  duration: 5,
  budget: 2000,
  travelers: 2,
});
```

## 🌟 About Voyyara

**Voyyara** is an AI-powered travel planning platform that makes trip planning effortless and enjoyable. Our AI assistant, **Voyyara Genie** 🧞, creates personalized itineraries tailored to your preferences, budget, and travel style.

### Why Voyyara?

- **Personalized** - Every itinerary is unique to you
- **Budget-Friendly** - Find the best experiences for your budget
- **Hidden Gems** - Discover authentic local experiences
- **Stress-Free** - No surprises, just well-planned adventures

## 📝 License

This project is built for demonstration and portfolio purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI GPT-4](https://openai.com/)
- Content managed by [Contentstack](https://www.contentstack.com/)
- Beautiful UI with [Poppins font](https://fonts.google.com/specimen/Poppins)

---

**Ready to plan your next adventure with Voyyara?** ✈️🌍
