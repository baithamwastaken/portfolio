// Cloudflare Images configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_IMAGES_DOMAIN = process.env.REACT_APP_CLOUDFLARE_IMAGES_DOMAIN || 'imagedelivery.net';

// Image variants for different use cases
export const IMAGE_VARIANTS = {
  thumbnail: 'w=300,h=300,fit=cover',
  gallery: 'w=800,h=600,fit=cover',
  full: 'w=1200,h=800,fit=cover',
  background: 'w=1920,h=1080,fit=cover',
  webp: 'w=800,h=600,fit=cover,f=webp',
  avif: 'w=800,h=600,fit=cover,f=avif',
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
 * Generate multiple format URLs for responsive images
 * @param imageId - The Cloudflare Images ID
 * @param variants - Array of variants to generate
 * @returns Object with variant URLs
 */
export function getResponsiveImageUrls(imageId: string, variants: ImageVariant[] = ['gallery', 'webp', 'avif']) {
  return variants.reduce((acc, variant) => {
    acc[variant] = getCloudflareImageUrl(imageId, variant);
    return acc;
  }, {} as Record<ImageVariant, string>);
}

/**
 * Check if Cloudflare Images is properly configured
 */
export function isCloudflareConfigured(): boolean {
  return !!CLOUDFLARE_ACCOUNT_ID;
} 