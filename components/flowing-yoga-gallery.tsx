import { ImageWithFallback } from "./figma/ImageWithFallback";
import warriorSunsetImage from "./src/assets/warrior.png";
import treePoseSunsetImage from "./src/assets/tree.png";
import headstandSunsetImage from "./src/assets/headstand.png";
import meditationSunsetImage from "./src/assets/medidation.png";

export function FlowingYogaGallery() {
  const yogaImages = [
    {
      src: headstandSunsetImage,
      alt: "Headstand yoga pose silhouette at sunset",
      style: "aspect-[3/4]",
    },
    {
      src: warriorSunsetImage,
      alt: "Warrior yoga pose silhouette at sunset",
      style: "aspect-[16/9]",
    },
    {
      src: treePoseSunsetImage,
      alt: "Tree pose yoga silhouette at sunset",
      style: "aspect-[5/3]",
    },
    {
      src: meditationSunsetImage,
      alt: "Meditation yoga pose silhouette at sunset",
      style: "aspect-[3/4]",
    },
  ];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Very subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-25 via-cream-25 to-white opacity-40"></div>

      <div className="relative">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-gray-800 mb-3">
            Experience the Journey
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            From grounding poses that connect you to your
            foundation, to inversions that shift your
            perspective - every practice is a step towards inner
            peace and physical strength.
          </p>
        </div>

        {/* Flowing image gallery with no gaps and no rounded corners */}
        <div className="flex overflow-x-auto scroll-smooth px-6 pb-4 scrollbar-hide">
          {/* Duplicate images for seamless scroll effect */}
          {[...yogaImages, ...yogaImages, ...yogaImages].map(
            (image, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-80 ${image.style} group cursor-pointer`}
              >
                <div className="relative h-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-500">
                  <ImageWithFallback
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 opacity-60 brightness-75 contrast-90 saturate-75"
                  />
                  {/* Permanent subtle overlay to tone down brightness */}
                  <div className="absolute inset-0 bg-cream-50/40"></div>
                  {/* Additional overlay on hover for subtle interaction */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}