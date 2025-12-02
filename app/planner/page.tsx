'use client';

import { ChatInterface } from "@/components/planner/ChatInterface";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Floating animations
const floatAnimation1 = {
  y: ["0%", "6%", "0%"],
  rotate: [0, 3, 0],
  transition: {
    duration: 8,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

const floatAnimation2 = {
  y: ["0%", "-7%", "0%"],
  rotate: [0, -3, 0],
  transition: {
    duration: 10,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

function PlannerContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination');

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        {/* Floating Travel Elements - More visible */}
        <motion.div
          className="absolute top-[10%] left-[5%] w-[240px] h-[300px] hidden lg:block opacity-90"
          animate={floatAnimation1}
        >
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&h=600&fit=crop"
            alt="Travel Adventure"
            width={240}
            height={300}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-[12%] right-[6%] w-[260px] h-[260px] hidden lg:block opacity-90"
          animate={floatAnimation2}
        >
          <Image
            src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&h=500&fit=crop"
            alt="Beautiful Destination"
            width={260}
            height={260}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        <motion.div
          className="absolute top-[25%] right-[8%] w-[200px] h-[320px] hidden xl:block opacity-90"
          animate={floatAnimation1}
        >
          <Image
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&h=700&fit=crop"
            alt="Travel Memories"
            width={200}
            height={320}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Decorative Icons - Larger and more visible */}
        <motion.div
          className="absolute top-[6%] left-[28%] text-7xl hidden md:block opacity-80"
          animate={{ rotate: [0, 360], transition: { duration: 20, ease: "linear", repeat: Infinity } }}
        >
          ✈️
        </motion.div>
        <motion.div
          className="absolute bottom-[6%] right-[25%] text-7xl hidden md:block opacity-80"
          animate={{ rotate: [0, 360], transition: { duration: 20, ease: "linear", repeat: Infinity } }}
        >
          🗺️
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 drop-shadow-sm">
              {destination ? `Plan Your ${destination} Trip` : 'Plan Your Dream Trip'}
            </h1>
            <p className="text-xl text-gray-700 font-medium drop-shadow-sm">
              Tell me where you want to go, and I&apos;ll create your perfect itinerary
            </p>
          </motion.div>

          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-airplane">✈️</div>
      </div>
    }>
      <PlannerContent />
    </Suspense>
  );
}

