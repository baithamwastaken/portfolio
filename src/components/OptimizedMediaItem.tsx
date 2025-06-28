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
  const [useCloudflare, setUseCloudflare] = useState(false);

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
    
    // For now, use local images by default
    setCurrentSrc(src);
    setUseCloudflare(false);
    setIsLoading(false);
    
    // Optional: Test Cloudflare if configured
    if (isCloudflareConfigured()) {
      // Test if Cloudflare is working by trying to load one image
      const testImage = new Image();
      const cloudflareUrl = `https://${process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID}.imagedelivery.net/${imageId}/w=800,h=600,fit=cover,f=webp`;
      
      testImage.onload = () => {
        console.log('Cloudflare Images working, switching to Cloudflare URLs');
        setUseCloudflare(true);
        setCurrentSrc(cloudflareUrl);
      };
      
      testImage.onerror = () => {
        console.log('Cloudflare Images not working, using local images');
        setUseCloudflare(false);
        setCurrentSrc(src);
      };
      
      testImage.src = cloudflareUrl;
    }
  }, [src, isVideo]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    e.currentTarget.style.opacity = '1';
  };

  const handleImageError = () => {
    // Fallback to original image if Cloudflare fails
    if (useCloudflare && currentSrc !== src) {
      console.log('Cloudflare image failed, falling back to local image');
      setCurrentSrc(src);
      setUseCloudflare(false);
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

  // For now, use simple img tag with local images
  return (
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
  );
}; 