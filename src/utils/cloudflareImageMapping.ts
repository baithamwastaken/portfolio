// Mapping between local filenames and Cloudflare Image IDs
// This mapping should be updated with the actual Cloudflare Image IDs from your dashboard

export const CLOUDFLARE_IMAGE_MAPPING: { [key: string]: string } = {
  // Actual Cloudflare Image IDs from dashboard
  'audi.png': '3bf4a375-8c0e-4cca-e40b-0b7910bc6100',
  'flower.png': '1c2c862a-86bd-4c4f-eb9c-98b4e6bca200',
  'untitled.png': 'efb44bbf-c08c-42af-3fd3-b8d6d7503f00',
  'face.jpeg': '5c5f9258-6ed2-4326-cc2a-45fdce837800',
  
  // Updated JPG versions with actual Cloudflare IDs
  'grass.jpg': '23b2c07e-b42e-4ad1-6e9d-bf6976a2bf00',
  'window.jpg': '73b7acf1-f594-4c1d-8d31-bdaf5e3e8d00',
  'room.jpg': 'cf62a65a-441d-48c1-f940-300a50935c00',
  
  // Placeholder mappings for other images - update these with actual IDs
  'back.mp4': 'back', // Videos don't use Cloudflare Images
  'batman.jpg': '7e31ba4f-0451-45fc-9d6f-af40d8fb8500', // Update with actual Cloudflare ID
  'chair.jpg': 'e4d92ddc-ebdc-4e02-da33-d6e62ff80d00', // Update with actual Cloudflare ID
  'city.mp4': 'city', // Videos don't use Cloudflare Images
  'cloud-lab.jpg': '42609326-54d0-4d00-b8a4-597ba9c76b00', // Update with actual Cloudflare ID
  'discord provile.png': 'a00a671e-23e7-444e-80b0-231fa812a500', // Update with actual Cloudflare ID
  'glass.mp4': 'glass', // Videos don't use Cloudflare Images
  'hotwheels.mp4': 'hotwheels', // Videos don't use Cloudflare Images
  'loopy.mp4': 'loopy', // Videos don't use Cloudflare Images
  'max.jpg': 'ac94aed6-c8e6-427f-88de-22351f13e700', // Update with actual Cloudflare ID
  'mooncar051115_0000.mp4': 'mooncar051115-0000', // Videos don't use Cloudflare Images
  'museum_1.jpg': 'fb2923dc-eb6d-4915-47ae-9df9f17a7e00', // Update with actual Cloudflare ID
  'newbusts.jpg': 'fff7df20-1e45-497a-1dd2-58ec9e8bfb00', // Update with actual Cloudflare ID
  'NewLevelSequence.0105.jpg': '3a445359-519d-4453-4926-9eedb9572600', // Update with actual Cloudflare ID
  'NewLevelSequence1.0640.png': '72901e74-0b2b-4002-499e-64c6ddcbaf00', // Update with actual Cloudflare ID
  'pots.jpg': '9002aeb7-840a-4900-5189-16652ec97b00', // Update with actual Cloudflare ID
  'skull.jpg': '835b0fb2-0370-4b74-e7f9-ff3d293e0400', // Update with actual Cloudflare ID
  'spacehome071040_0000.mp4': 'spacehome071040-0000', // Videos don't use Cloudflare Images
  'spaceman asset.jpg': 'ec52ee50-b227-41c0-2258-6fab76415600', // Update with actual Cloudflare ID
  'stardrive.mp4': 'stardrive', // Videos don't use Cloudflare Images
  'suit_12345_0090.jpg': '74324189-1362-4ec8-95b0-834af606a900', // Update with actual Cloudflare ID
  'tele.mp4': 'tele', // Videos don't use Cloudflare Images
  'there0001-0250.mov': 'there0001-0250', // Videos don't use Cloudflare Images
  'untitled.jpg': '2d5aec40-c241-49c7-93ba-fe779dc81700', // Update with actual Cloudflare ID
  'venus.jpg': '8f7403dc-8d43-42af-2592-c9ef9e242500', // Update with actual Cloudflare ID
  'warehouse220919_0450.jpg': '75da0f0f-7aeb-4b65-3714-819f45405d00', // Update with actual Cloudflare ID
  'watertemple1-studio.jpg': '432d9c39-29b7-47bc-06bd-d6a053aed700', // Update with actual Cloudflare ID
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