import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { OptimizedMediaItem } from './components/OptimizedMediaItem';
import { getCloudflareImageUrl, isCloudflareConfigured } from './utils/cloudflareImages';
import { ImageOptimizationTest } from './components/ImageOptimizationTest';

const navLeft = 'haitham';
const navRight = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: 'https://www.instagram.com/hiswed/?hl=en', external: true },
];

// List of images and videos in the public/images folder
const imageFiles = [
  'audi.png',
  'back.mp4',
  'batman.jpg',
  'chair.jpg',
  'city.mp4',
  'cloud-lab.jpg',
  'discord provile.png',
  'flower.png',
  'glass.mp4',
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
  return <OptimizedMediaItem src={src} idx={idx} />;
};

function GalleryPage() {
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
      <nav className="flex justify-between items-center px-8 py-6 w-full fixed top-0 left-0 z-50 select-none">
        <Link
          to="/"
          className="font-normal text-xl tracking-widest text-white opacity-90 hover:opacity-100 transition-opacity duration-200 font-sans"
          style={{
            textDecoration: 'none',
            mixBlendMode: 'difference',
            position: 'relative',
            fontFamily: `'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
          }}
        >
          {navLeft}
        </Link>
        
        <div className="flex gap-8">
          <Link
            to="/about"
            className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            About
          </Link>
          {navRight.filter(item => item.label !== 'About').map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
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

// Restore AnimatedHi component for the About page
function AnimatedHi() {
  const [hovered, setHovered] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [revealCount, setRevealCount] = React.useState(0);
  const [encryptedText, setEncryptedText] = React.useState("");
  const leftFull = 'Haitham';
  const rightFull = 'Iswed';
  const total = leftFull.length + rightFull.length;
  const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?";

  // Reveal left and right letters one by one
  const left = leftFull.slice(0, Math.min(revealCount, leftFull.length));
  const right = revealCount > leftFull.length ? rightFull.slice(0, revealCount - leftFull.length) : '';

  // Progress for HI expansion (0 to 1)
  const hiProgress = hovered ? 1 : 0;
  // Progress for full name expansion (0 to 1)
  const progress = expanded ? revealCount / total : 0;
  // Max translation for HI (closer together), and for full name
  const hiMaxTranslate = 60; // px, much closer for HI
  const nameMaxTranslate = 900; // px, full expansion for name

  // Encryption effect for the revealed text
  React.useEffect(() => {
    if (expanded && revealCount < total) {
      const timer = setTimeout(() => {
        setRevealCount(revealCount + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
    if (!expanded && revealCount > 0) {
      setRevealCount(0);
    }
  }, [expanded, revealCount, total]);

  // Generate encrypted text for the remaining characters
  React.useEffect(() => {
    if (expanded) {
      const remainingLength = total - revealCount;
      const encrypted = Array.from({ length: remainingLength }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      setEncryptedText(encrypted);
    } else {
      setEncryptedText("");
    }
  }, [expanded, revealCount, total, chars]);

  // Handle click - toggle expanded state
  const handleClick = () => {
    if (hovered && !expanded) {
      // First click: expand
      setExpanded(true);
    } else if (expanded) {
      // Second click: collapse
      setExpanded(false);
      setHovered(false);
    }
  };

  // On mouse leave, only reset hover (not expanded state)
  const handleMouseLeave = () => {
    if (!expanded) {
      setHovered(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full h-full select-none"
      style={{ minHeight: '30vh', pointerEvents: 'auto', position: 'relative' }}
    >
      {/* H (moves left on hover, hides when revealed) */}
      <span
        className="absolute left-1/2 top-1/2 text-7xl md:text-9xl font-semibold text-white font-sans cursor-pointer"
        style={{
          transform: `translate(-50%, -50%) translateX(${-hiProgress * hiMaxTranslate * 0.5 - progress * nameMaxTranslate * 0.5}px)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s',
          whiteSpace: 'nowrap',
          zIndex: 2,
          pointerEvents: 'auto',
          opacity: revealCount >= 1 ? 0 : 1,
          fontFamily: `'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        H
      </span>
      {/* I (moves right on hover, hides when revealed) */}
      <span
        className="absolute left-1/2 top-1/2 text-7xl md:text-9xl font-semibold text-white font-sans cursor-pointer"
        style={{
          transform: `translate(-50%, -50%) translateX(${hiProgress * hiMaxTranslate * 0.5 + progress * nameMaxTranslate * 0.5}px)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s',
          whiteSpace: 'nowrap',
          zIndex: 2,
          pointerEvents: 'auto',
          opacity: revealCount >= leftFull.length + 1 ? 0 : 1,
          fontFamily: `'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        I
      </span>
      {/* Center revealed letters with encryption effect */}
      <span
        className="absolute left-1/2 top-1/2 text-7xl md:text-9xl text-white text-center font-sans cursor-pointer"
        style={{
          transform: 'translate(-50%, -50%)',
          letterSpacing: '0.05em',
          zIndex: 1,
          pointerEvents: 'auto',
          minWidth: '1ch',
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.3s',
          fontFamily: `'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {left}
        {left && right ? '\u00A0\u00A0' : ''}
        <span style={{ fontWeight: 400 }}>{right}</span>
        {encryptedText}
      </span>
    </div>
  );
}

// Restore AboutPage React component
function AboutPage() {
  const [bgPos, setBgPos] = React.useState('center');

  // Parallax mouse move handler (even more subtle)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { innerWidth, innerHeight } = window;
    const x = e.clientX / innerWidth;
    const y = e.clientY / innerHeight;
    // Parallax range: -4px to +4px from center (even less)
    const offsetX = (x - 0.5) * 8;
    const offsetY = (y - 0.5) * 8;
    setBgPos(`${50 + offsetX}% ${50 + offsetY}%`);
  };

  // Get optimized background image URL with proper fallback
  const getBackgroundImageUrl = () => {
    const fallbackUrl = '/assets/face.jpeg';
    
    if (isCloudflareConfigured()) {
      try {
        const cloudflareUrl = getCloudflareImageUrl('face.jpeg', 'background');
        // Only use Cloudflare URL if it's valid (not empty)
        if (cloudflareUrl && cloudflareUrl !== `/images/face.jpeg`) {
          return cloudflareUrl;
        }
      } catch (error) {
        console.warn('Failed to generate Cloudflare URL, using fallback:', error);
      }
    }
    
    return fallbackUrl;
  };

  const backgroundUrl = getBackgroundImageUrl();

  return (
    <div
      className="min-h-screen bg-black dark:bg-black text-white flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: '110%', // Less zoom
        backgroundPosition: bgPos,
        backgroundRepeat: 'no-repeat',
      }}
      onMouseMove={handleMouseMove}
    >
      <nav className="flex justify-between items-center px-8 py-6 w-full fixed top-0 left-0 z-10 select-none">
        <Link
          to="/"
          className="font-normal text-xl tracking-widest text-white opacity-90 hover:opacity-100 transition-opacity duration-200 font-sans"
          style={{ textDecoration: 'none', mixBlendMode: 'difference' }}
        >
          {navLeft}
        </Link>
        
        <div className="flex gap-8">
          <Link
            to="/about"
            className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
            About
          </Link>
          {navRight.filter(item => item.label !== 'About').map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="h-20" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatedHi />
      </div>
      
      {/* Temporary debug component - remove after testing */}
      <div className="absolute bottom-4 left-4 z-20">
        <ImageOptimizationTest imageId="face.jpeg" />
      </div>
    </div>
  );
}

// Restore AboutPage route
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}