'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const floatTransition1 = {
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut" as const
};

const floatTransition2 = {
  duration: 9,
  repeat: Infinity,
  ease: "easeInOut" as const
};

export function GlobalFloatingImages() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Mid-page Left - Vietnamese Lanterns */}
      <motion.div
        className="absolute top-[45%] left-[2%] w-[140px] hidden lg:block opacity-60"
        animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ ...floatTransition1, delay: 0.5 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=500&fit=crop"
          alt="Vietnam Lanterns"
          width={140}
          height={180}
          className="rounded-2xl shadow-xl"
        />
      </motion.div>

      {/* Mid-page Right - Japanese Cherry Blossoms */}
      <motion.div
        className="absolute top-[55%] right-[3%] w-[150px] hidden lg:block opacity-60"
        animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
        transition={{ ...floatTransition2, delay: 0.7 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=500&fit=crop"
          alt="Japan Cherry Blossoms"
          width={150}
          height={190}
          className="rounded-2xl shadow-xl"
        />
      </motion.div>

      {/* Lower Section - Korean Palace */}
      <motion.div
        className="absolute top-[75%] left-[8%] w-[160px] hidden xl:block opacity-50"
        animate={{ y: [0, -18, 0] }}
        transition={{ ...floatTransition1, delay: 1 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=400&fit=crop"
          alt="Korean Palace"
          width={160}
          height={160}
          className="rounded-2xl shadow-xl"
        />
      </motion.div>

      {/* Lower Section Right - Thai Floating Market */}
      <motion.div
        className="absolute top-[78%] right-[7%] w-[150px] hidden xl:block opacity-50"
        animate={{ y: [0, 12, 0] }}
        transition={{ ...floatTransition2, delay: 1.2 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=400&fit=crop"
          alt="Thai Market"
          width={150}
          height={150}
          className="rounded-2xl shadow-xl"
        />
      </motion.div>

      {/* Decorative Emojis Scattered */}
      <motion.div
        className="absolute top-[60%] left-[15%] text-5xl hidden md:block opacity-40"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        🏮
      </motion.div>

      <motion.div
        className="absolute top-[70%] right-[18%] text-5xl hidden md:block opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        🌸
      </motion.div>

      <motion.div
        className="absolute top-[85%] left-[25%] text-4xl hidden lg:block opacity-35"
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        🎋
      </motion.div>
    </div>
  );
}

