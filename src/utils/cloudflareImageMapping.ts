// Mapping between local filenames and Cloudflare Image IDs
// This mapping should be updated with the actual Cloudflare Image IDs from your dashboard

export const CLOUDFLARE_IMAGE_MAPPING: { [key: string]: string } = {
  // Common patterns - update these with your actual Cloudflare Image IDs
  'audi.png': 'audi',
  'back.mp4': 'back',
  'batman.jpg': 'batman',
  'chair.jpg': 'chair',
  'city.mp4': 'city',
  'cloud-lab.jpg': 'cloud-lab',
  'discord provile.png': 'discord-provile',
  'flower.png': 'flower',
  'glass.mp4': 'glass',
  'grass.png': 'grass',
  'hotwheels.mp4': 'hotwheels',
  'loopy.mp4': 'loopy',
  'max.jpg': 'max',
  'mooncar051115_0000.mp4': 'mooncar051115-0000',
  'museum_1.jpg': 'museum-1',
  'newbusts.jpg': 'newbusts',
  'NewLevelSequence.0105.jpg': 'newlevelsequence-0105',
  'NewLevelSequence1.0640.png': 'newlevelsequence1-0640',
  'pots.jpg': 'pots',
  'Room.png': 'room',
  'skull.jpg': 'skull',
  'spacehome071040_0000.mp4': 'spacehome071040-0000',
  'spaceman asset.jpg': 'spaceman-asset',
  'stardrive.mp4': 'stardrive',
  'suit_12345_0090.jpg': 'suit-12345-0090',
  'tele.mp4': 'tele',
  'there0001-0250.mov': 'there0001-0250',
  'untitled.jpg': 'untitled',
  'untitled.png': 'untitled-png',
  'venus.jpg': 'venus',
  'warehouse220919_0450.jpg': 'warehouse220919-0450',
  'watertemple1-studio.jpg': 'watertemple1-studio',
  'window.png': 'window',
};

/**
 * Get Cloudflare Image ID for a local filename
 * @param filename - The local filename
 * @returns The Cloudflare Image ID or the cleaned filename as fallback
 */
export function getCloudflareImageId(filename: string): string {
  // First check if we have a direct mapping
  if (CLOUDFLARE_IMAGE_MAPPING[filename]) {
    return CLOUDFLARE_IMAGE_MAPPING[filename];
  }
  
  // Fallback: clean the filename
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();
}

/**
 * Check if a file should use Cloudflare Images
 * @param filename - The filename to check
 * @returns True if the file should use Cloudflare Images
 */
export function shouldUseCloudflare(filename: string): boolean {
  const isVideo = filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.mov');
  return !isVideo; // Only use Cloudflare for images, not videos
} 