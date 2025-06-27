import React, { useState, useEffect, useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';

const navLeft = 'haitham';
const navRight = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: 'https://www.instagram.com/hiswed/?hl=en', external: true },
];

// List of images and videos in the public/images folder
const imageFiles = [
  'audi.png',
  'back.mov',
  'batman.jpg',
  'chair.jpg',
  'city1.20001-0250.mov',
  'cloud-lab.jpg',
  'discord provile.png',
  'flower.png',
  'glass.mov',
  'grass.png',
  'hotwheels.mp4',
  'loopy.mp4',
  'max.jpg',
  'mooncar051115_0000.mp4',
  'museum_1.jpg',
  'newbusts.jpg',
  'NewLevelSequence.0105.jpg',
  'NewLevelSequence1.0640.png',
  'pots.jpg',
  'Room.png',
  'skull.jpg',
  'spacehome071040_0000.mp4',
  'spaceman asset.jpg',
  'stardrive.mp4',
  'suit_12345_0090.jpg',
  'tele.mp4',
  'there0001-0250.mov',
  'untitled.jpg',
  'untitled.png',
  'venus.jpg',
  'warehouse220919_0450.jpg',
  'watertemple1-studio.jpg',
  'window.png',
];

// Helper to fetch image file names from /public/images
const fetchImages = async (page: number, perPage: number) => {
  const images: string[] = [];
  
  for (let i = 0; i < perPage; i++) {
    // Handle negative page numbers by converting to positive and cycling
    let imageIndex;
    if (page < 0) {
      // For negative pages, start from the end and work backwards
      const absPage = Math.abs(page);
      const startPos = (absPage - 1) * perPage + i;
      imageIndex = (imageFiles.length - 1 - startPos) % imageFiles.length;
    } else {
      // For positive pages, work forwards
      const startIndex = (page - 1) * perPage;
      imageIndex = (startIndex + i) % imageFiles.length;
    }
    images.push(`/images/${imageFiles[imageIndex]}`);
  }
  
  return images;
};

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

// Component to render either image or video
const MediaItem = ({ src, idx }: { src: string; idx: number }) => {
  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov');
  
  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full object-cover opacity-0 group-hover:opacity-90 transition-all duration-700 ease-out"
        style={{ animation: 'fadeIn 1s forwards', animationDelay: `${idx * 0.05}s` }}
        onLoadedData={e => (e.currentTarget.style.opacity = '1')}
      />
    );
  }
  
  return (
    <img
      src={src}
      alt={`artwork-${idx}`}
      className="w-full object-cover opacity-0 group-hover:opacity-90 transition-all duration-700 ease-out"
      style={{ animation: 'fadeIn 1s forwards', animationDelay: `${idx * 0.05}s` }}
      onLoad={e => (e.currentTarget.style.opacity = '1')}
      loading="lazy"
    />
  );
};

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    // Load initial images
    const loadInitialImages = async () => {
      const initialImages = await fetchImages(1, perPage * 3); // Load 3 batches initially
      setImages(initialImages);
      setPage(4); // Start next page after initial load
    };
    loadInitialImages();
  }, []);

  const loadMore = async () => {
    const newImages = await fetchImages(page, perPage);
    setImages((prev) => [...prev, ...newImages]);
    setPage((p) => p + 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 40;
    const rotateY = (centerX - x) / 40;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black text-white">
      {/* Transparent Nav Bar */}
      <nav className="flex justify-between items-center px-8 py-6 w-full fixed top-0 left-0 z-10 select-none">
        <div className="font-bold text-lg tracking-widest opacity-90">{navLeft}</div>
        <div className="flex gap-8">
          {navRight.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-base opacity-80 hover:opacity-100 transition-opacity duration-200"
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      {/* Spacer for nav */}
      <div className="h-20" />
      {/* Masonry Infinite Gallery */}
      <main className="w-full px-4 pt-8">
        <InfiniteScroll
          dataLength={images.length}
          next={loadMore}
          hasMore={true}
          loader={<div className="text-center py-8 opacity-50">Loading more artwork...</div>}
          style={{ overflow: 'visible' }}
          scrollThreshold={0.8}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-4"
            columnClassName="masonry-column"
          >
            {images.map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className="mb-4 rounded-lg overflow-hidden shadow-lg bg-neutral-900 bg-opacity-40 hover:shadow-2xl transition-all duration-500 ease-out group cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <MediaItem src={src} idx={idx} />
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      </main>
    </div>
  );
}

export default App;