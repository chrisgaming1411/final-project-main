import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]); // Re-add listener if currentIndex changes to get latest state

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex flex-col items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose} // Close on backdrop click
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110]"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X size={40} />
      </button>

      <div className="relative w-full h-3/4 max-w-5xl flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <button 
          className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-[110] transition-colors"
          onClick={goToPrevious}
        >
          <ChevronLeft size={32} />
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
        />

        <button 
          className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-[110] transition-colors"
          onClick={goToNext}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="w-full max-w-5xl mt-4 flex justify-center gap-2 overflow-x-auto p-2" onClick={e => e.stopPropagation()}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`w-16 h-16 md:w-24 md:h-24 object-cover rounded-md cursor-pointer border-2 transition-all ${currentIndex === index ? 'border-brand-sky-blue scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryModal;
