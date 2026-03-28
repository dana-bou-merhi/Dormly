import { useState } from 'react';
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DormsImagesGallery({ images, selectedImage, setSelectedImage }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Normalize images array
  // If images is empty or undefined, use a default array with at least one image if possible
  const displayImages = (images && images.length > 0) ? images : ["/images/default.png"];
  
  const handleMainImageClick = () => {
    setLightboxIndex(selectedImage);
    setIsLightboxOpen(true);
  };

  const handleThumbnailClick = (idx) => {
    setSelectedImage(idx);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleViewAllClick = () => {
    setLightboxIndex(0);
    setIsLightboxOpen(true);
  };

  // Determine grid layout based on number of images
  const hasMultipleImages = displayImages.length > 1;

  return (
    <>
      {/* Main Gallery Grid */}
      <section className={`grid gap-3 h-96 md:h-125 mb-10 rounded-2xl overflow-hidden ${
        hasMultipleImages ? 'grid-cols-1 md:grid-cols-4 grid-rows-2' : 'grid-cols-1'
      }`}>
        
        {/* Main Image */}
        <div 
          className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
            hasMultipleImages ? 'col-span-1 md:col-span-2 row-span-2' : ''
          }`}
          onClick={handleMainImageClick}
        >
          <img
            src={displayImages[selectedImage] || displayImages[0]}
            alt="Main"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition duration-300">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <Images size={16} className="text-teal-600" />
                <span className="text-sm font-semibold text-gray-700">Click to expand</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Grid (only if multiple images exist) */}
        {hasMultipleImages && displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            onClick={() => handleThumbnailClick(idx + 1)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group transition-all ${
              selectedImage === idx + 1 ? 'ring-2 ring-teal-500' : ''
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
            
            {/* View All Overlay on Last visible Thumbnail if there are more than 5 total images */}
            {idx === 3 && displayImages.length > 5 && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAllClick();
                }}
              >
                <span className="text-white font-semibold flex items-center gap-2 border border-white/50 px-4 py-2 rounded-lg backdrop-blur-sm text-sm hover:border-white transition">
                  <Images size={16} /> View All {displayImages.length} Photos
                </span>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Main Lightbox Image */}
          <div className="flex items-center justify-center max-w-4xl w-full h-full relative">
            <img
              src={displayImages[lightboxIndex] || displayImages[0]}
              alt={`Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Previous Button */}
            {displayImages.length > 1 && (
              <button
                onClick={handleLightboxPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Button */}
            {displayImages.length > 1 && (
              <button
                onClick={handleLightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition z-20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {lightboxIndex + 1} / {displayImages.length}
          </div>

          {/* Thumbnail Strip at Bottom */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 pb-2 scrollbar-hide">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    lightboxIndex === idx
                      ? 'border-teal-400 scale-110'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}