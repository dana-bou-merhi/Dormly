import { Images } from 'lucide-react';

export default function DormsImagesGallery({ images, selectedImage, setSelectedImage }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-100 md:h-125 mb-10 rounded-2xl overflow-hidden">
      <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-2xl">
        <img
          src={images[selectedImage]}
          alt="Main"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {images.slice(1).map((img, idx) => (
        <div
          key={idx}
          onClick={() => setSelectedImage(idx + 1)}
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
        >
          <img
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          {idx === images.length - 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition">
              <span className="text-white font-semibold flex items-center gap-2 border border-white/50 px-4 py-2 rounded-lg backdrop-blur-sm text-sm">
                <Images size={16} /> View All {images.length} Photos
              </span>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}