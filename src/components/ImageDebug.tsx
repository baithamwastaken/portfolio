import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured, getResponsiveImageUrls } from '../utils/cloudflareImages';

interface ImageDebugProps {
  imageId: string;
}

export const ImageDebug: React.FC<ImageDebugProps> = ({ imageId }) => {
  const [cloudflareUrl, setCloudflareUrl] = useState<string>('');
  const [localUrl, setLocalUrl] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [responsiveUrls, setResponsiveUrls] = useState<any>(null);

  useEffect(() => {
    setIsConfigured(isCloudflareConfigured());
    
    if (isConfigured) {
      try {
        const cfUrl = getCloudflareImageUrl(imageId, 'gallery');
        setCloudflareUrl(cfUrl);
        
        const respUrls = getResponsiveImageUrls(imageId);
        setResponsiveUrls(respUrls);
      } catch (error) {
        console.error('Error generating Cloudflare URL:', error);
      }
    }
    
    setLocalUrl(`/images/${imageId}`);
  }, [imageId, isConfigured]);

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-2">Image Debug: {imageId}</h3>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div>
          <strong>Cloudflare Configured:</strong> {isConfigured ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Account ID:</strong> {process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || 'Not set'}
        </div>
        
        <div>
          <strong>Local URL:</strong> {localUrl}
        </div>
        
        {cloudflareUrl && (
          <div>
            <strong>Cloudflare URL:</strong> {cloudflareUrl}
          </div>
        )}
        
        {responsiveUrls && (
          <div>
            <strong>Responsive URLs:</strong>
            <pre className="text-xs mt-1 bg-gray-800 p-2 rounded">
              {JSON.stringify(responsiveUrls, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Test Images */}
      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-white font-semibold mb-2">Local Image Test:</h4>
          <img 
            src={localUrl} 
            alt="Local test" 
            className="w-32 h-32 object-cover border border-gray-600"
            onError={(e) => {
              console.error('Local image failed to load:', localUrl);
              e.currentTarget.style.border = '2px solid red';
            }}
            onLoad={() => console.log('Local image loaded successfully:', localUrl)}
          />
        </div>
        
        {cloudflareUrl && (
          <div>
            <h4 className="text-white font-semibold mb-2">Cloudflare Image Test:</h4>
            <img 
              src={cloudflareUrl} 
              alt="Cloudflare test" 
              className="w-32 h-32 object-cover border border-gray-600"
              onError={(e) => {
                console.error('Cloudflare image failed to load:', cloudflareUrl);
                e.currentTarget.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Cloudflare image loaded successfully:', cloudflareUrl)}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 