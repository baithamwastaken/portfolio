import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, getResponsiveImageUrls, isCloudflareConfigured, ImageVariant } from '../utils/cloudflareImages';

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
  const [error, setError] = useState(false);

  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov');
  
  // Extract image ID from the src path (e.g., "/images/batman.jpg" -> "batman.jpg")
  const getImageId = (imagePath: string): string => {
    return imagePath.split('/').pop() || imagePath;
  };

  useEffect(() => {
    if (isVideo) {
      setCurrentSrc(src);
      return;
    }

    const imageId = getImageId(src);
    
    if (isCloudflareConfigured()) {
      // Use Cloudflare Images with responsive variants
      const responsiveUrls = getResponsiveImageUrls(imageId, ['webp', 'avif', 'gallery']);
      setCurrentSrc(responsiveUrls.gallery);
    } else {
      // Fallback to original path
      setCurrentSrc(src);
    }
  }, [src, isVideo]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    e.currentTarget.style.opacity = '1';
  };

  const handleImageError = () => {
    setError(true);
    // Fallback to original image if Cloudflare fails
    if (isCloudflareConfigured() && currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

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
  const responsiveUrls = isCloudflareConfigured() ? getResponsiveImageUrls(imageId, ['webp', 'avif', 'gallery']) : null;

  return (
    <picture>
      {/* Modern formats for browsers that support them */}
      {responsiveUrls && (
        <>
          <source srcSet={responsiveUrls.avif} type="image/avif" />
          <source srcSet={responsiveUrls.webp} type="image/webp" />
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