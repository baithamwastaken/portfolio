import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured, ImageVariant } from '../utils/cloudflareImages';
import { getCloudflareImageId, shouldUseCloudflare } from '../utils/cloudflareImageMapping';

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
  const [retryCount, setRetryCount] = useState(0);

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
    
    // Always try Cloudflare first if configured and it's an image
    if (isCloudflareConfigured() && shouldUseCloudflare(imageId)) {
      try {
        // Get the Cloudflare Image ID
        const cloudflareId = getCloudflareImageId(imageId);
        
        // Generate Cloudflare URL
        const cloudflareUrl = getCloudflareImageUrl(cloudflareId, variant);
        
        // Debug: Show the Cloudflare URL being used
        console.log(`Gallery Image: ${imageId} → ${cloudflareId} → ${cloudflareUrl}`);
        
        // Use Cloudflare URL directly - no need to test since we know it works
        setUseCloudflare(true);
        setCurrentSrc(cloudflareUrl);
        setIsLoading(false);
      } catch (error) {
        console.warn('Failed to generate Cloudflare URL, using fallback:', error);
        setUseCloudflare(false);
        setCurrentSrc(src);
        setIsLoading(false);
      }
    } else {
      // Fallback to original path
      setUseCloudflare(false);
      setCurrentSrc(src);
      setIsLoading(false);
    }
  }, [src, isVideo, variant]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`${useCloudflare ? 'Cloudflare' : 'Local'} image loaded successfully:`, src);
    setImageLoaded(true);
    e.currentTarget.style.opacity = '1';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`${useCloudflare ? 'Cloudflare' : 'Local'} image failed to load:`, src);
    
    // If Cloudflare failed, try local as fallback
    if (useCloudflare && currentSrc !== src) {
      console.log('Cloudflare image failed, trying local image');
      setCurrentSrc(src);
      setUseCloudflare(false);
      setRetryCount(prev => prev + 1);
    } else {
      // If local also failed, show error indicator
      e.currentTarget.style.border = '2px solid red';
      console.error('Both Cloudflare and local images failed for:', src);
    }
  };

  // Don't render anything until we have a source
  if (isLoading) {
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
        onError={(e) => console.error('Video failed to load:', src)}
      />
    );
  }

  // Use simple img tag with proper error handling
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