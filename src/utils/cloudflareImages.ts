// Cloudflare Images configuration
const CLOUDFLARE_IMAGES_DOMAIN = process.env.REACT_APP_CLOUDFLARE_IMAGES_DOMAIN || 'imagedelivery.net';
const CLOUDFLARE_ACCOUNT_HASH = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_HASH || '_91C5nLBdJJSmgo9yUewLA';

// Image variants for different use cases - using common variant names
export const IMAGE_VARIANTS = {
  // Basic variants that are commonly available
  public: 'public', // Default public variant
  thumbnail: 'thumbnail', // Thumbnail variant
  gallery: 'gallery', // Gallery variant
  full: 'full', // Full size variant
  background: 'background', // Background variant
  
  // Fallback variants with parameters
  webp: 'w=800,h=600,fit=cover,f=webp',
  avif: 'w=800,h=600,fit=cover,f=avif',
  jpeg: 'w=800,h=600,fit=cover,f=jpeg',
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

/**
 * Clean image ID for Cloudflare URLs
 * @param imageId - The original image ID
 * @returns Cleaned image ID safe for URLs
 */
function cleanImageId(imageId: string): string {
  // Remove file extension and clean the name
  const nameWithoutExt = imageId.replace(/\.[^/.]+$/, '');
  
  // Replace spaces and special characters with hyphens
  const cleaned = nameWithoutExt
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  
  return cleaned;
}

/**
 * Generate a Cloudflare Images URL
 * @param imageId - The Cloudflare Images ID
 * @param variant - The image variant to use
 * @returns The complete Cloudflare Images URL
 */
export function getCloudflareImageUrl(imageId: string, variant: ImageVariant = 'gallery'): string {
  if (!CLOUDFLARE_ACCOUNT_HASH) {
    console.warn('Cloudflare Account Hash not configured. Using fallback image path.');
    return `/images/${imageId}`;
  }
  
  const variantParams = IMAGE_VARIANTS[variant];
  const cleanedId = cleanImageId(imageId);
  
  // Use the custom domain format: https://imagedelivery.net/_91C5nLBdJJSmgo9yUewLA/<image_id>/<variant_name>
  return `https://${CLOUDFLARE_IMAGES_DOMAIN}/${CLOUDFLARE_ACCOUNT_HASH}/${cleanedId}/${variantParams}`;
}

/**
 * Generate multiple format URLs for responsive images with WebP priority
 * @param imageId - The Cloudflare Images ID
 * @param variants - Array of variants to generate
 * @returns Object with variant URLs
 */
export function getResponsiveImageUrls(imageId: string, variants: ImageVariant[] = ['gallery', 'public']) {
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
  return !!CLOUDFLARE_ACCOUNT_HASH;
} 