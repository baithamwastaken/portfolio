import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured } from '../utils/cloudflareImages';
import { getCloudflareImageId, shouldUseCloudflare } from '../utils/cloudflareImageMapping';

export const TunnelDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [isTesting, setIsTesting] = useState(false);

  const testImages = [
    'audi.png',
    'flower.png', 
    'untitled.png',
    'batman.jpg'
  ];

  const testImage = (filename: string) => {
    return new Promise<any>((resolve) => {
      const results: any = {
        filename,
        localUrl: `/images/${filename}`,
        cloudflareUrl: null,
        localTest: null,
        cloudflareTest: null,
        error: null
      };

      // Test local image first
      const localImg = new Image();
      localImg.onload = () => {
        results.localTest = 'success';
        resolve(results);
      };
      localImg.onerror = () => {
        results.localTest = 'failed';
        resolve(results);
      };
      localImg.src = results.localUrl;

      // Test Cloudflare image
      if (isCloudflareConfigured() && shouldUseCloudflare(filename)) {
        try {
          const cloudflareId = getCloudflareImageId(filename);
          const cloudflareUrl = getCloudflareImageUrl(cloudflareId, 'gallery');
          results.cloudflareUrl = cloudflareUrl;

          const cfImg = new Image();
          cfImg.onload = () => {
            results.cloudflareTest = 'success';
            resolve(results);
          };
          cfImg.onerror = () => {
            results.cloudflareTest = 'failed';
            resolve(results);
          };
          cfImg.src = cloudflareUrl;
        } catch (error) {
          results.error = error;
          resolve(results);
        }
      } else {
        results.cloudflareTest = 'not-configured';
        resolve(results);
      }
    });
  };

  const runTests = async () => {
    setIsTesting(true);
    const results: {[key: string]: any} = {};
    
    for (const filename of testImages) {
      results[filename] = await testImage(filename);
    }
    
    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-4">Tunnel Debug</h3>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Image Loading'}
        </button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(testResults).map(([filename, result]) => (
          <div key={filename} className="p-3 bg-gray-800 rounded">
            <h4 className="text-white font-semibold mb-2">{filename}</h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <strong>Local URL:</strong> {result.localUrl}
              </div>
              
              <div>
                <strong>Local Test:</strong> 
                <span className={`ml-2 ${result.localTest === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {result.localTest === 'success' ? '✅ Success' : '❌ Failed'}
                </span>
              </div>
              
              {result.cloudflareUrl && (
                <div>
                  <strong>Cloudflare URL:</strong> 
                  <div className="text-xs text-gray-400 break-all">{result.cloudflareUrl}</div>
                </div>
              )}
              
              <div>
                <strong>Cloudflare Test:</strong> 
                <span className={`ml-2 ${
                  result.cloudflareTest === 'success' ? 'text-green-400' : 
                  result.cloudflareTest === 'failed' ? 'text-red-400' : 
                  'text-yellow-400'
                }`}>
                  {result.cloudflareTest === 'success' ? '✅ Success' : 
                   result.cloudflareTest === 'failed' ? '❌ Failed' : 
                   result.cloudflareTest === 'not-configured' ? '⚠️ Not Configured' : '⏳ Testing'}
                </span>
              </div>
              
              {result.error && (
                <div className="text-red-400">
                  <strong>Error:</strong> {result.error.toString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>This will help identify if the issue is with local images, Cloudflare, or network connectivity.</p>
      </div>
    </div>
  );
}; 