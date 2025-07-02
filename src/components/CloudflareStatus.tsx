import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured } from '../utils/cloudflareImages';
import { getCloudflareImageId, shouldUseCloudflare } from '../utils/cloudflareImageMapping';

export const CloudflareStatus: React.FC = () => {
  const [status, setStatus] = useState<{[key: string]: 'loading' | 'cloudflare' | 'local' | 'error'}>({});
  const [isConfigured, setIsConfigured] = useState(false);

  const testImages = [
    'audi.png',
    'flower.png', 
    'untitled.png',
    'batman.jpg',
    'chair.jpg',
    'max.jpg'
  ];

  useEffect(() => {
    setIsConfigured(isCloudflareConfigured());
    
    testImages.forEach(filename => {
      if (!shouldUseCloudflare(filename)) return;
      
      const cloudflareId = getCloudflareImageId(filename);
      const cloudflareUrl = getCloudflareImageUrl(cloudflareId, 'gallery');
      
      const img = new Image();
      img.onload = () => {
        setStatus(prev => ({ ...prev, [filename]: 'cloudflare' }));
        console.log(`✅ ${filename} loaded from Cloudflare: ${cloudflareUrl}`);
      };
      img.onerror = () => {
        setStatus(prev => ({ ...prev, [filename]: 'local' }));
        console.log(`❌ ${filename} failed Cloudflare, using local`);
      };
      img.src = cloudflareUrl;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-4">Cloudflare Status</h3>
      
      <div className="mb-4">
        <div className="text-gray-300">
          <strong>Cloudflare Configured:</strong> {isConfigured ? '✅ Yes' : '❌ No'}
        </div>
        <div className="text-gray-300">
          <strong>Account Hash:</strong> {process.env.REACT_APP_CLOUDFLARE_ACCOUNT_HASH || 'Not set'}
        </div>
        <div className="text-gray-300">
          <strong>Domain:</strong> {process.env.REACT_APP_CLOUDFLARE_IMAGES_DOMAIN || 'imagedelivery.net'}
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-white font-semibold">Image Status:</h4>
        {testImages.map(filename => (
          <div key={filename} className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">{filename}:</span>
            {status[filename] === 'loading' && <span className="text-yellow-400">⏳ Testing...</span>}
            {status[filename] === 'cloudflare' && <span className="text-green-400">✅ Cloudflare</span>}
            {status[filename] === 'local' && <span className="text-blue-400">📁 Local</span>}
            {status[filename] === 'error' && <span className="text-red-400">❌ Error</span>}
            {!status[filename] && <span className="text-gray-400">⏳ Waiting...</span>}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>✅ = Loading from Cloudflare</p>
        <p>📁 = Fallback to local image</p>
        <p>❌ = Failed to load</p>
      </div>
    </div>
  );
}; 