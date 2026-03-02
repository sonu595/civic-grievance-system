import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const MediaSwiper = ({ 
  imagePreview, 
  imageFile, 
  videoPreview, 
  videoFile,
  onImageRemove,
  onVideoRemove 
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  // Media items ko update karo jab bhi image/video change ho
  useEffect(() => {
    const items = [];
    
    if (imagePreview) {
      items.push({
        type: 'image',
        src: imagePreview,
        file: imageFile,
        label: 'Photo Evidence'
      });
    }
    
    if (videoPreview) {
      items.push({
        type: 'video',
        src: videoPreview,
        file: videoFile,
        label: 'Video Evidence'
      });
    }
    
    setMediaItems(items);
  }, [imagePreview, videoPreview, imageFile, videoFile]);

  // Agar koi media nahi hai to null return karo
  if (mediaItems.length === 0) {
    return null;
  }

  // Agar sirf ek media item hai to simple preview dikhao
  if (mediaItems.length === 1) {
    const item = mediaItems[0];
    return (
      <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden">
        {item.type === 'image' ? (
          <img 
            src={item.src} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
        ) : (
          <video 
            src={item.src} 
            controls 
            className="w-full h-full object-contain bg-black"
          />
        )}
        
        {/* Remove Button */}
        <button 
          onClick={item.type === 'image' ? onImageRemove : onVideoRemove}
          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600 text-lg z-10 shadow-lg"
        >
          ✕
        </button>

        {/* Media Type Badge */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          {item.type === 'image' ? '📷 Photo' : '🎥 Video'}
        </div>
      </div>
    );
  }

  // Agar dono media hain to swiper dikhao
  return (
    <div className="relative w-full">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs, FreeMode]}
        navigation={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full aspect-square rounded-xl overflow-hidden bg-gray-900"
      >
        {mediaItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
              {item.type === 'image' ? (
                <img 
                  src={item.src} 
                  alt={`Media ${index + 1}`} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={item.src} 
                  controls 
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper (Navigation ke liye) */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Navigation, Thumbs]}
        freeMode={true}
        watchSlidesProgress={true}
        spaceBetween={8}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
        className="mt-2 h-16 sm:h-20"
      >
        {mediaItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div 
              className={`relative w-full h-full rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                activeIndex === index 
                  ? 'border-[#8C52FF] opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {item.type === 'image' ? (
                <img 
                  src={item.src} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full bg-gray-800">
                  <video 
                    src={item.src} 
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-xs font-bold">🎥</span>
                  </div>
                </div>
              )}
              
              {/* Active indicator */}
              {activeIndex === index && (
                <div className="absolute inset-0 border-2 border-[#8C52FF] rounded-lg pointer-events-none" />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Media Counter */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10">
        {activeIndex + 1} / {mediaItems.length}
      </div>

      {/* Media Type Badge on Active Slide */}
      <div className="absolute bottom-16 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10">
        {mediaItems[activeIndex]?.type === 'image' ? '📷 Photo' : '🎥 Video'}
      </div>

      {/* Remove Current Media Button */}
      <button 
        onClick={() => {
          const currentItem = mediaItems[activeIndex];
          if (currentItem.type === 'image') {
            onImageRemove();
          } else {
            onVideoRemove();
          }
        }}
        className="absolute top-2 left-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600 text-lg z-10 shadow-lg"
      >
        ✕
      </button>
    </div>
  );
};

export default MediaSwiper;