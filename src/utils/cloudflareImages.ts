// Cloudflare Images configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_IMAGES_DOMAIN = process.env.REACT_APP_CLOUDFLARE_IMAGES_DOMAIN || 'imagedelivery.net';

// Image variants for different use cases - optimized for WebP and responsive sizing
export const IMAGE_VARIANTS = {
  // Small thumbnails
  thumbnail: 'w=300,h=300,fit=cover,f=webp',
  thumbnail_avif: 'w=300,h=300,fit=cover,f=avif',
  
  // Gallery images - optimized for WebP
  gallery: 'w=800,h=600,fit=cover,f=webp',
  gallery_avif: 'w=800,h=600,fit=cover,f=avif',
  gallery_jpeg: 'w=800,h=600,fit=cover,f=jpeg',
  
  // Larger images for detailed view
  full: 'w=1200,h=800,fit=cover,f=webp',
  full_avif: 'w=1200,h=800,fit=cover,f=avif',
  
  // Background images
  background: 'w=1920,h=1080,fit=cover,f=webp',
  background_avif: 'w=1920,h=1080,fit=cover,f=avif',
  
  // Legacy formats for fallback
  webp: 'w=800,h=600,fit=cover,f=webp',
  avif: 'w=800,h=600,fit=cover,f=avif',
  jpeg: 'w=800,h=600,fit=cover,f=jpeg',
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

/**
 * Generate a Cloudflare Images URL
 * @param imageId - The Cloudflare Images ID
 * @param variant - The image variant to use
 * @returns The complete Cloudflare Images URL
 */
export function getCloudflareImageUrl(imageId: string, variant: ImageVariant = 'gallery'): string {
  if (!CLOUDFLARE_ACCOUNT_ID) {
    console.warn('Cloudflare Account ID not configured. Using fallback image path.');
    return `/images/${imageId}`;
  }
  
  const variantParams = IMAGE_VARIANTS[variant];
  return `https://${CLOUDFLARE_ACCOUNT_ID}.${CLOUDFLARE_IMAGES_DOMAIN}/${imageId}/${variantParams}`;
}

/**
 * Generate multiple format URLs for responsive images with WebP priority
 * @param imageId - The Cloudflare Images ID
 * @param variants - Array of variants to generate
 * @returns Object with variant URLs
 */
export function getResponsiveImageUrls(imageId: string, variants: ImageVariant[] = ['gallery_avif', 'gallery', 'gallery_jpeg']) {
  return variants.reduce((acc, variant) => {
    acc[variant] = getCloudflareImageUrl(imageId, variant);
    return acc;
  }, {} as Record<ImageVariant, string>);
}

/**
 * Get optimized image URLs for different screen sizes
 * @param imageId - The Cloudflare Images ID
 * @returns Object with responsive URLs
 */
export function getResponsiveSizes(imageId: string) {
  return {
    small: getCloudflareImageUrl(imageId, 'thumbnail'),
    medium: getCloudflareImageUrl(imageId, 'gallery'),
    large: getCloudflareImageUrl(imageId, 'full'),
    background: getCloudflareImageUrl(imageId, 'background'),
  };
}

/**
 * Check if Cloudflare Images is properly configured
 */
export function isCloudflareConfigured(): boolean {
  return !!CLOUDFLARE_ACCOUNT_ID;
} 