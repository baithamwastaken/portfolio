import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured } from '../utils/cloudflareImages';
import { getCloudflareImageId, shouldUseCloudflare } from '../utils/cloudflareImageMapping';

const TunnelDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    // Collect debug information
    const info = {
      userAgent: navigator.userAgent,
      location: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      isLocalhost: window.location.hostname === 'localhost',
      isTunnel: window.location.hostname.includes('ngrok') || window.location.hostname.includes('tunnel'),
      cloudflareConfigured: isCloudflareConfigured(),
      envVars: {
        accountHash: process.env.REACT_APP_CLOUDFLARE_ACCOUNT_HASH || 'Not set',
        domain: process.env.REACT_APP_CLOUDFLARE_IMAGES_DOMAIN || 'Not set',
        accountId: process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || 'Not set',
      }
    };
    setDebugInfo(info);

    // Test image loading
    testImageLoading();
  }, []);

  const testImageLoading = async () => {
    const testImages = [
      { name: 'batman.jpg', local: '/images/batman.jpg', cloudflare: null as string | null },
      { name: 'spiderman.jpg', local: '/images/spiderman.jpg', cloudflare: null as string | null },
    ];

    const results: any = {};

    for (const img of testImages) {
      if (shouldUseCloudflare(img.name)) {
        try {
          const cloudflareId = getCloudflareImageId(img.name);
          img.cloudflare = getCloudflareImageUrl(cloudflareId, 'gallery');
        } catch (error) {
          console.error(`Failed to get Cloudflare URL for ${img.name}:`, error);
        }
      }

      results[img.name] = {
        local: await testImageLoad(img.local),
        cloudflare: img.cloudflare ? await testImageLoad(img.cloudflare) : null,
        cloudflareUrl: img.cloudflare
      };
    }

    setTestResults(results);
  };

  const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2">Tunnel Debug Info</h3>
      
      <div className="mb-4">
        <strong>Environment:</strong>
        <div>Hostname: {debugInfo.hostname}</div>
        <div>Protocol: {debugInfo.protocol}</div>
        <div>Port: {debugInfo.port}</div>
        <div>Is Localhost: {debugInfo.isLocalhost ? 'Yes' : 'No'}</div>
        <div>Is Tunnel: {debugInfo.isTunnel ? 'Yes' : 'No'}</div>
      </div>

      <div className="mb-4">
        <strong>Cloudflare Config:</strong>
        <div>Configured: {debugInfo.cloudflareConfigured ? 'Yes' : 'No'}</div>
        <div>Account Hash: {debugInfo.envVars?.accountHash}</div>
        <div>Domain: {debugInfo.envVars?.domain}</div>
      </div>

      <div className="mb-4">
        <strong>Image Test Results:</strong>
        {Object.entries(testResults).map(([name, result]: [string, any]) => (
          <div key={name} className="mt-2">
            <div className="font-semibold">{name}:</div>
            <div>Local: {result.local ? '✅' : '❌'}</div>
            <div>Cloudflare: {result.cloudflare ? '✅' : '❌'}</div>
            {result.cloudflareUrl && (
              <div className="text-xs text-gray-300 break-all">
                URL: {result.cloudflareUrl}
              </div>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={testImageLoading}
        className="bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Retest Images
      </button>
    </div>
  );
};

export default TunnelDebug; 