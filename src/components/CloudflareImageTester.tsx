import React, { useState } from 'react';
import { getCloudflareImageUrl } from '../utils/cloudflareImages';

interface CloudflareImageTesterProps {
  imageName: string;
}

export const CloudflareImageTester: React.FC<CloudflareImageTesterProps> = ({ imageName }) => {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [isTesting, setIsTesting] = useState(false);

  const accountId = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || 'ab486e3586d401ea089ce76298c70e92';
  
  // Different possible ID formats
  const possibleIds = [
    imageName, // Original filename
    imageName.replace(/\.[^/.]+$/, ''), // Without extension
    imageName.toLowerCase(), // Lowercase
    imageName.toLowerCase().replace(/\.[^/.]+$/, ''), // Lowercase without extension
    imageName.replace(/[^a-zA-Z0-9]/g, ''), // Alphanumeric only
    imageName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), // Lowercase alphanumeric only
    // Clean version (what our utility generates)
    imageName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase(),
  ];

  const testImage = (id: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      const url = getCloudflareImageUrl(id, 'gallery');
      
      img.onload = () => {
        console.log(`✅ Image found: ${id} → ${url}`);
        resolve(true);
      };
      
      img.onerror = () => {
        console.log(`❌ Image not found: ${id} → ${url}`);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  const runTests = async () => {
    setIsTesting(true);
    const results: {[key: string]: boolean} = {};
    
    for (const id of possibleIds) {
      results[id] = await testImage(id);
    }
    
    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-2">Cloudflare Image ID Tester: {imageName}</h3>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Possible IDs'}
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="text-gray-300">
          <strong>Account ID:</strong> {accountId}
        </div>
        
        <div className="text-gray-300">
          <strong>Possible IDs:</strong>
        </div>
        
        {Object.entries(testResults).map(([id, success]) => (
          <div key={id} className={`p-2 rounded ${success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            <strong>{success ? '✅' : '❌'}</strong> {id}
            {success && (
              <div className="text-xs mt-1">
                URL: {getCloudflareImageUrl(id, 'gallery')}
              </div>
            )}
          </div>
        ))}
        
        {Object.keys(testResults).length === 0 && (
          <div className="text-gray-400">
            Click "Test Possible IDs" to find the correct Cloudflare Image ID
          </div>
        )}
      </div>
    </div>
  );
}; 