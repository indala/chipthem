'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { motion ,Variants} from 'framer-motion'; // Keep AnimatePresence imported if needed, but 'motion' is the key.

const HERO_IMAGE_PATH = "/hero.jpg"; 

// 1. Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3, // Start delay for the whole group
      staggerChildren: 0.2, // Time between each child item's animation
    }
  }
};

const itemVariants:Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};


const Hero = () => {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="py-24 relative overflow-hidden hero-bg">
      
      {/* Background Image using Next.js Image - Not animated */}
      <div 
        className="absolute inset-0"
      >
        <Image
            src={HERO_IMAGE_PATH}
            alt={t('imageAlt')}
            fill
            priority
            style={{ 
                objectFit: 'cover',
                backgroundAttachment: 'fixed',
            }}
            
            className="opacity-90"
        />
      </div>
      
      {/* Dark Overlay - Not animated */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex-col items-center justify-start pt-16 text-center ${isRTL ? 'rtl' : 'ltr'}`}>
        
        {/* 2. Use motion.div as the main content container */}
        <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants} // Apply the main container variants
            initial="hidden" // Start from 'hidden' state
            animate="visible" // Animate to 'visible' state
        >
          
          {/* Trust Badge - Animated Item 1 */}
          <motion.div 
            className="mb-6"
            variants={itemVariants} // Apply the individual item variants
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-amber-100/40 backdrop-blur-sm px-6 py-3 shadow-sm">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <div className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className="text-sm font-semibold text-white">{t('trustedBy')}</span>
            </div>
          </motion.div>

          {/* Main Headline - Animated Item 2 */}
<motion.h1
  className="text-4xl  md:text-6xl xl:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-xl font-sans tracking-tight"
  variants={itemVariants}
>
  {t('title')}
</motion.h1>

          {/* Subtitle - Animated Item 3 */}
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA Buttons - Animated Item 4 */}
          <motion.div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'rtl' : 'ltr'}`}
            variants={itemVariants}
          >
            <Button
              asChild
              size="lg"
              className="w-[240px] h-[64px] bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 border-0 shadow-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <Link href="/getpetmicrochipped">
                  <span className={`${isRTL ? 'ml-2' : 'mr-2'} text-lg`}>🏠</span>
                  {t('cta')}
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="w-[240px] h-[64px] bg-red-600 hover:bg-red-700 text-white hover:text-white border-0 shadow-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <Link href="/lostfound"> 
                  <span className={`${isRTL ? 'ml-2' : 'mr-2'} text-lg`}>🚨</span>
                  {t('reportLost')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;