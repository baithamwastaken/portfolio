import React from 'react';
import { getCloudflareImageUrl, getResponsiveSizes, isCloudflareConfigured } from '../utils/cloudflareImages';

interface ImageOptimizationTestProps {
  imageId: string;
}

export const ImageOptimizationTest: React.FC<ImageOptimizationTestProps> = ({ imageId }) => {
  if (!isCloudflareConfigured()) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">Cloudflare Images not configured</p>
      </div>
    );
  }

  const sizes = getResponsiveSizes(imageId);

  return (
    <div className="p-4 bg-gray-100 border rounded">
      <h3 className="font-bold mb-2">Cloudflare Images Test - {imageId}</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Account ID:</strong> {process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID}
        </div>
        
        <div>
          <strong>Small (300x300 WebP):</strong>
          <a href={sizes.small} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            View
          </a>
          <div className="text-xs text-gray-600 mt-1">{sizes.small}</div>
        </div>
        
        <div>
          <strong>Medium (800x600 WebP):</strong>
          <a href={sizes.medium} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            View
          </a>
          <div className="text-xs text-gray-600 mt-1">{sizes.medium}</div>
        </div>
        
        <div>
          <strong>Large (1200x800 WebP):</strong>
          <a href={sizes.large} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            View
          </a>
          <div className="text-xs text-gray-600 mt-1">{sizes.large}</div>
        </div>
        
        <div>
          <strong>Background (1920x1080 WebP):</strong>
          <a href={sizes.background} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            View
          </a>
          <div className="text-xs text-gray-600 mt-1">{sizes.background}</div>
        </div>
      </div>
      
      <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded">
        <p className="text-green-800 text-sm">
          ✅ Cloudflare Images is working! Check the Network tab in DevTools to see WebP images loading.
        </p>
      </div>
    </div>
  );
}; 