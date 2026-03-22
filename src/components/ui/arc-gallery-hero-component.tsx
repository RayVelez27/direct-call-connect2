'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Star } from 'lucide-react';

// Mock creator data to show on hover
const mockCreators = [
  { name: 'Jessica', age: 24, rating: 4.9, reviews: 127, price: 25, tags: ['GFE', 'Video Calls'], online: true },
  { name: 'Marcus', age: 28, rating: 4.8, reviews: 89, price: 35, tags: ['Live Shows', 'Custom'], online: true },
  { name: 'Valentina', age: 22, rating: 5.0, reviews: 203, price: 30, tags: ['Roleplay', 'Phone Sex'], online: false },
  { name: 'Aaliyah', age: 26, rating: 4.7, reviews: 156, price: 20, tags: ['Sexting', 'GFE'], online: true },
  { name: 'Diego', age: 30, rating: 4.9, reviews: 74, price: 40, tags: ['Fetish', 'Domination'], online: true },
  { name: 'Mia', age: 23, rating: 4.8, reviews: 198, price: 28, tags: ['Video Calls', 'Custom'], online: false },
  { name: 'Luna', age: 25, rating: 4.6, reviews: 112, price: 22, tags: ['Companionship', 'Chat'], online: true },
  { name: 'Andre', age: 27, rating: 4.9, reviews: 63, price: 45, tags: ['Live Shows', 'JOI'], online: true },
  { name: 'Sofia', age: 21, rating: 5.0, reviews: 241, price: 32, tags: ['Striptease', 'GFE'], online: true },
  { name: 'Kai', age: 29, rating: 4.7, reviews: 95, price: 35, tags: ['Roleplay', 'Fantasy'], online: false },
  { name: 'Camila', age: 24, rating: 4.8, reviews: 178, price: 27, tags: ['Video Calls', 'Sexting'], online: true },
  { name: 'Zara', age: 26, rating: 4.9, reviews: 134, price: 30, tags: ['Custom Content', 'GFE'], online: true },
];

// --- The ArcGalleryHero Component ---
type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
}) => {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
        setIsMobile(true);
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
        setIsMobile(false);
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const handleMouseEnter = useCallback((index: number) => {
    if (isMobile) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredIndex(index), 150);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredIndex(null), 100);
  }, []);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section className={`relative overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col ${className}`}>
      {/* Background ring container */}
      <div
        className="relative mx-auto"
        style={{
          width: '100%',
          height: dimensions.radius * 1.2,
        }}
      >
        {/* Center pivot */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;
            const creator = mockCreators[i % mockCreators.length];
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={i}
                className="absolute opacity-0 animate-fade-in-up"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: `translate(-50%, 50%)`,
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'forwards',
                  zIndex: isHovered ? 50 : count - i,
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Image card */}
                <div
                  className={`rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 w-full h-full transition-all duration-300 ${
                    isHovered ? 'scale-110 shadow-2xl ring-2 ring-[#4180FB]' : 'hover:scale-105'
                  }`}
                  style={{ transform: `rotate(${isHovered ? 0 : angle / 4}deg)` }}
                >
                  <img
                    src={src}
                    alt={`Creator ${i + 1}`}
                    className="block w-full h-full object-cover"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x400/334155/e2e8f0?text=Creator`;
                    }}
                  />
                </div>

                {/* Hover card */}
                {isHovered && !isMobile && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 animate-card-pop"
                    style={{ top: `${dimensions.cardSize + 8}px`, zIndex: 100 }}
                  >
                    {/* Name + age + online dot */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {creator.name}, {creator.age}
                        </span>
                        {creator.online && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">{creator.rating}</span>
                      <span className="text-xs text-gray-400">({creator.reviews})</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {creator.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#4180FB]/10 text-[#4180FB] dark:bg-[#4180FB]/20 dark:text-[#7AAFFD]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        From <span className="font-semibold text-gray-900 dark:text-white">${creator.price}</span>
                      </span>
                      <a
                        href="/explore"
                        className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#4180FB] text-white hover:bg-[#3268D4] transition-colors"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content positioned below the arc */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 -mt-40 md:-mt-52 lg:-mt-64">
        <div className="text-center max-w-2xl px-6 opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your Virtual Adult Services Marketplace
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Plezyy is a virtual marketplace where creators and users connect for intimate, adult experiences through secure, private virtual content and services.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/explore" className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4180FB] dark:bg-[#5A96FC] text-white hover:bg-[#3268D4] dark:hover:bg-[#7AAFFD] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Explore Services
            </a>
            <a href="/sign-up" className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-200">
              Become a Creator
            </a>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 50%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes card-pop {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
        .animate-card-pop {
          animation-name: card-pop;
          animation-duration: 0.2s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};
