// Mapping between local filenames and Cloudflare Image IDs
// This mapping should be updated with the actual Cloudflare Image IDs from your dashboard

export const CLOUDFLARE_IMAGE_MAPPING: { [key: string]: string } = {
  // Actual Cloudflare Image IDs from dashboard
  'audi.png': '3bf4a375-8c0e-4cca-e40b-0b7910bc6100',
  'flower.png': '1c2c862a-86bd-4c4f-eb9c-98b4e6bca200',
  'untitled.png': 'efb44bbf-c08c-42af-3fd3-b8d6d7503f00',
  
  // Placeholder mappings for other images - update these with actual IDs
  'back.mp4': 'back', // Videos don't use Cloudflare Images
  'batman.jpg': 'batman', // Update with actual Cloudflare ID
  'chair.jpg': 'chair', // Update with actual Cloudflare ID
  'city.mp4': 'city', // Videos don't use Cloudflare Images
  'cloud-lab.jpg': 'cloud-lab', // Update with actual Cloudflare ID
  'discord provile.png': 'discord-provile', // Update with actual Cloudflare ID
  'glass.mp4': 'glass', // Videos don't use Cloudflare Images
  'grass.png': 'grass', // Update with actual Cloudflare ID
  'hotwheels.mp4': 'hotwheels', // Videos don't use Cloudflare Images
  'loopy.mp4': 'loopy', // Videos don't use Cloudflare Images
  'max.jpg': 'max', // Update with actual Cloudflare ID
  'mooncar051115_0000.mp4': 'mooncar051115-0000', // Videos don't use Cloudflare Images
  'museum_1.jpg': 'museum-1', // Update with actual Cloudflare ID
  'newbusts.jpg': 'newbusts', // Update with actual Cloudflare ID
  'NewLevelSequence.0105.jpg': 'newlevelsequence-0105', // Update with actual Cloudflare ID
  'NewLevelSequence1.0640.png': 'newlevelsequence1-0640', // Update with actual Cloudflare ID
  'pots.jpg': 'pots', // Update with actual Cloudflare ID
  'Room.png': 'room', // Update with actual Cloudflare ID
  'skull.jpg': 'skull', // Update with actual Cloudflare ID
  'spacehome071040_0000.mp4': 'spacehome071040-0000', // Videos don't use Cloudflare Images
  'spaceman asset.jpg': 'spaceman-asset', // Update with actual Cloudflare ID
  'stardrive.mp4': 'stardrive', // Videos don't use Cloudflare Images
  'suit_12345_0090.jpg': 'suit-12345-0090', // Update with actual Cloudflare ID
  'tele.mp4': 'tele', // Videos don't use Cloudflare Images
  'there0001-0250.mov': 'there0001-0250', // Videos don't use Cloudflare Images
  'untitled.jpg': 'untitled', // Update with actual Cloudflare ID
  'venus.jpg': 'venus', // Update with actual Cloudflare ID
  'warehouse220919_0450.jpg': 'warehouse220919-0450', // Update with actual Cloudflare ID
  'watertemple1-studio.jpg': 'watertemple1-studio', // Update with actual Cloudflare ID
  'window.png': 'window', // Update with actual Cloudflare ID
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