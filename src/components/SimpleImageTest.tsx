import React from 'react';

export const SimpleImageTest: React.FC = () => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-4">Simple Image Test</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-white text-sm mb-2">Test Image 1:</h4>
          <img 
            src="/images/batman.jpg" 
            alt="Batman test" 
            className="w-full h-32 object-cover border border-gray-600"
            onLoad={() => console.log('✅ Batman image loaded successfully')}
            onError={(e) => {
              console.error('❌ Batman image failed to load');
              e.currentTarget.style.border = '2px solid red';
            }}
          />
        </div>
        
        <div>
          <h4 className="text-white text-sm mb-2">Test Image 2:</h4>
          <img 
            src="/images/audi.png" 
            alt="Audi test" 
            className="w-full h-32 object-cover border border-gray-600"
            onLoad={() => console.log('✅ Audi image loaded successfully')}
            onError={(e) => {
              console.error('❌ Audi image failed to load');
              e.currentTarget.style.border = '2px solid red';
            }}
          />
        </div>
        
        <div>
          <h4 className="text-white text-sm mb-2">Test Video:</h4>
          <video 
            src="/images/back.mp4" 
            className="w-full h-32 object-cover border border-gray-600"
            onLoadedData={() => console.log('✅ Video loaded successfully')}
            onError={() => console.error('❌ Video failed to load')}
          />
        </div>
        
        <div>
          <h4 className="text-white text-sm mb-2">Non-existent Image:</h4>
          <img 
            src="/images/nonexistent.jpg" 
            alt="Non-existent test" 
            className="w-full h-32 object-cover border border-gray-600"
            onLoad={() => console.log('✅ Non-existent image loaded (unexpected)')}
            onError={(e) => {
              console.log('❌ Non-existent image failed to load (expected)');
              e.currentTarget.style.border = '2px solid red';
            }}
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-300">
        <p>Check the browser console for load/error messages.</p>
        <p>Red borders indicate failed loads.</p>
      </div>
    </div>
  );
}; 