'use client';

import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

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
                  zIndex: count - i,
                }}
              >
                <div
                  className="rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 w-full h-full"
                  style={{ transform: `rotate(${angle / 4}deg)` }}
                >
                  <img
                    src={src}
                    alt={`Creator ${i + 1}`}
                    className="block w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/400x400/334155/e2e8f0?text=Creator`;
                    }}
                  />
                </div>
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
      `}</style>
    </section>
  );
};
