import React, { useState, useEffect } from 'react';
import { getResponsiveImageUrls, isCloudflareConfigured, ImageVariant } from '../utils/cloudflareImages';

interface OptimizedMediaItemProps {
  src: string;
  idx: number;
  variant?: ImageVariant;
  className?: string;
}

export const OptimizedMediaItem: React.FC<OptimizedMediaItemProps> = ({
  src,
  idx,
  variant = 'gallery',
  className = "w-full object-cover opacity-0 group-hover:opacity-90 transition-all duration-700 ease-out"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov');
  
  // Extract image ID from the src path (e.g., "/images/batman.jpg" -> "batman.jpg")
  const getImageId = (imagePath: string): string => {
    return imagePath.split('/').pop() || imagePath;
  };

  useEffect(() => {
    if (isVideo) {
      setCurrentSrc(src);
      setIsLoading(false);
      return;
    }

    const imageId = getImageId(src);
    
    if (isCloudflareConfigured()) {
      // Use Cloudflare Images with WebP-optimized variants
      const responsiveUrls = getResponsiveImageUrls(imageId, ['gallery_avif', 'gallery', 'gallery_jpeg']);
      setCurrentSrc(responsiveUrls.gallery);
    } else {
      // Fallback to original path
      setCurrentSrc(src);
    }
    setIsLoading(false);
  }, [src, isVideo]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    e.currentTarget.style.opacity = '1';
  };

  const handleImageError = () => {
    // Fallback to original image if Cloudflare fails
    if (isCloudflareConfigured() && currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  // Don't render anything until we have a source
  if (isLoading || !currentSrc) {
    return (
      <div 
        className={`${className} bg-gray-800 animate-pulse`}
        style={{ animation: 'fadeIn 1s forwards', animationDelay: `${idx * 0.05}s` }}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={currentSrc}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        style={{ animation: 'fadeIn 1s forwards', animationDelay: `${idx * 0.05}s` }}
        onLoadedData={e => (e.currentTarget.style.opacity = '1')}
      />
    );
  }

  const imageId = getImageId(src);
  const responsiveUrls = isCloudflareConfigured() ? getResponsiveImageUrls(imageId, ['gallery_avif', 'gallery', 'gallery_jpeg']) : null;

  return (
    <picture>
      {/* Modern formats for browsers that support them - AVIF first, then WebP */}
      {responsiveUrls && (
        <>
          <source srcSet={responsiveUrls.gallery_avif} type="image/avif" />
          <source srcSet={responsiveUrls.gallery} type="image/webp" />
          <source srcSet={responsiveUrls.gallery_jpeg} type="image/jpeg" />
        </>
      )}
      
      {/* Fallback image */}
      <img
        src={currentSrc}
        alt={`artwork-${idx}`}
        className={className}
        style={{ 
          animation: 'fadeIn 1s forwards', 
          animationDelay: `${idx * 0.05}s`,
          opacity: imageLoaded ? 1 : 0
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}; 