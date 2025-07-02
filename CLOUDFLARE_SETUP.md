# Cloudflare Images Setup Guide

This guide will help you configure Cloudflare Images for your portfolio site to optimize image loading and performance.

## Prerequisites

1. A Cloudflare account
2. Cloudflare Images enabled on your account
3. Your images uploaded to Cloudflare Images

## Setup Steps

### 1. Get Your Cloudflare Account ID

1. Log into your Cloudflare dashboard
2. Go to the right sidebar and copy your Account ID
3. It should look something like: `a1b2c3d4e5f6g7h8i9j0`

### 2. Upload Your Images to Cloudflare Images

1. In your Cloudflare dashboard, go to **Images**
2. Upload all your images from the `/public/images/` folder
3. Note the Image IDs that Cloudflare assigns to each image

### 3. Configure Environment Variables

Create a `.env` file in your project root with the following:

```env
REACT_APP_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
REACT_APP_CLOUDFLARE_IMAGES_DOMAIN=imagedelivery.net
```

Replace `your_account_id_here` with your actual Cloudflare Account ID.

### 4. Update Image IDs (if needed)

If your Cloudflare Image IDs don't match your original filenames, you'll need to update the `imageFiles` array in `src/App.tsx` to use the Cloudflare Image IDs instead.

For example, if your original file is `batman.jpg` but Cloudflare assigned it the ID `abc123-def456`, update the array:

```typescript
const imageFiles = [
  'abc123-def456', // instead of 'batman.jpg'
  // ... other image IDs
];
```

### 5. Restart Your Development Server

After adding the environment variables, restart your development server:

```bash
npm start
```

## Features Added

### Image Optimization
- **Automatic format selection**: Serves WebP and AVIF to supported browsers
- **Responsive sizing**: Different sizes for different use cases
- **Lazy loading**: Images load only when needed
- **Error handling**: Falls back to original images if Cloudflare fails

### Image Variants
- `thumbnail`: 300x300px for small previews
- `gallery`: 800x600px for gallery display
- `full`: 1200x800px for full-size viewing
- `background`: 1920x1080px for background images
- `webp`: WebP format for modern browsers
- `avif`: AVIF format for the latest browsers

### Performance Benefits
- **Faster loading**: Images are served from Cloudflare's global CDN
- **Smaller file sizes**: Modern formats (WebP/AVIF) are significantly smaller
- **Better caching**: Cloudflare's edge caching improves repeat visits
- **Automatic optimization**: Cloudflare handles compression and optimization

## Troubleshooting

### Images not loading
1. Check that your Account ID is correct
2. Verify that images are uploaded to Cloudflare Images
3. Check the browser console for any error messages

### Fallback behavior
If Cloudflare Images is not configured, the site will automatically fall back to serving images from your local `/images/` folder.

### Custom domain
If you have a custom domain for Cloudflare Images, update the `REACT_APP_CLOUDFLARE_IMAGES_DOMAIN` environment variable.

## Video Files

Note: Video files (`.mp4`, `.mov`) are not processed through Cloudflare Images and will continue to be served from your local `/images/` folder. For video optimization, consider using Cloudflare Stream or similar services. 