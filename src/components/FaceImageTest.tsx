import React, { useState, useEffect } from 'react';
import { getCloudflareImageUrl, isCloudflareConfigured } from '../utils/cloudflareImages';
import { getCloudflareImageId, shouldUseCloudflare } from '../utils/cloudflareImageMapping';

const FaceImageTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    testFaceImage();
  }, []);

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

  const testFaceImage = async () => {
    const imageId = 'face.jpeg';
    const fallbackUrl = '/assets/face.jpeg';
    
    console.log('=== Face Image Test ===');
    console.log('Image ID:', imageId);
    console.log('Fallback URL:', fallbackUrl);
    console.log('Cloudflare configured:', isCloudflareConfigured());
    console.log('Should use Cloudflare:', shouldUseCloudflare(imageId));
    
    const results: any = {
      imageId,
      fallbackUrl,
      cloudflareConfigured: isCloudflareConfigured(),
      shouldUseCloudflare: shouldUseCloudflare(imageId),
      cloudflareId: null,
      cloudflareUrl: null,
      fallbackTest: null,
      cloudflareTest: null,
      error: null
    };

    // Test fallback image
    results.fallbackTest = await testImageLoad(fallbackUrl);
    console.log('Fallback test result:', results.fallbackTest);

    // Test Cloudflare image
    if (isCloudflareConfigured() && shouldUseCloudflare(imageId)) {
      try {
        results.cloudflareId = getCloudflareImageId(imageId);
        results.cloudflareUrl = getCloudflareImageUrl(results.cloudflareId, 'background');
        console.log('Cloudflare ID:', results.cloudflareId);
        console.log('Cloudflare URL:', results.cloudflareUrl);
        
        results.cloudflareTest = await testImageLoad(results.cloudflareUrl);
        console.log('Cloudflare test result:', results.cloudflareTest);
      } catch (error) {
        results.error = error;
        console.error('Cloudflare error:', error);
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="text-white">Testing face image...</div>;
  }

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2">Face Image Test</h3>
      
      <div className="mb-4">
        <strong>Configuration:</strong>
        <div>Image ID: {testResults.imageId}</div>
        <div>Cloudflare Configured: {testResults.cloudflareConfigured ? 'Yes' : 'No'}</div>
        <div>Should Use Cloudflare: {testResults.shouldUseCloudflare ? 'Yes' : 'No'}</div>
      </div>

      <div className="mb-4">
        <strong>URLs:</strong>
        <div>Fallback: {testResults.fallbackUrl}</div>
        <div>Cloudflare ID: {testResults.cloudflareId || 'N/A'}</div>
        <div>Cloudflare URL: {testResults.cloudflareUrl || 'N/A'}</div>
      </div>

      <div className="mb-4">
        <strong>Test Results:</strong>
        <div>Fallback: {testResults.fallbackTest ? '✅' : '❌'}</div>
        <div>Cloudflare: {testResults.cloudflareTest ? '✅' : '❌'}</div>
      </div>

      {testResults.error && (
        <div className="mb-4 text-red-400">
          <strong>Error:</strong> {testResults.error.toString()}
        </div>
      )}

      <button 
        onClick={testFaceImage}
        className="bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Retest
      </button>
    </div>
  );
};

export default FaceImageTest; 