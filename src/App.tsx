import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { OptimizedMediaItem } from './components/OptimizedMediaItem';
import { getCloudflareImageUrl, isCloudflareConfigured } from './utils/cloudflareImages';
import { getCloudflareImageId } from './utils/cloudflareImageMapping';

const navLeft = 'haitham';
const navRight = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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
            <ContactLink
              key={item.label}
              to={item.href}
              className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
            >
              {item.label}
            </ContactLink>
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
                <OptimizedMediaItem src={src} idx={idx} />
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      </main>
    </div>
  );
}

// AnimatedHi now uses forwardRef to expose a triggerScrollStage method
const AnimatedHi = forwardRef(function AnimatedHi({ onAnimationEnd }: { onAnimationEnd?: () => void }, ref) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [encryptedText, setEncryptedText] = useState("");
  const [scrollStage, setScrollStage] = useState(0); // 0-5 for finer steps
  const maxStage = 5;
  const leftFull = 'Haitham';
  const rightFull = 'Iswed';
  const total = leftFull.length + rightFull.length;
  const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?";
  const animationDone = expanded || scrollStage >= maxStage;

  // Expose a method to trigger scroll stage from parent
  useImperativeHandle(ref, () => ({
    triggerScrollStage: () => {
      setScrollStage((prev) => Math.min(prev + 1, maxStage));
    }
  }), [maxStage]);

  // Reveal left and right letters one by one
  const left = leftFull.slice(0, Math.min(revealCount, leftFull.length));
  const right = revealCount > leftFull.length ? rightFull.slice(0, revealCount - leftFull.length) : '';

  // Progress for HI expansion (0 to 1)
  const hiProgress = hovered || scrollStage >= 2 ? 1 : scrollStage / 2; // smoother
  // Progress for full name expansion (0 to 1)
  const isExpanded = expanded || scrollStage >= maxStage;
  const progress = isExpanded ? revealCount / total : 0;
  // Max translation for HI (closer together), and for full name
  const hiMaxTranslate = 60; // px, much closer for HI
  const nameMaxTranslate = 900; // px, full expansion for name

  // Encryption effect for the revealed text
  React.useEffect(() => {
    if (animationDone && revealCount < total) {
      const timer = setTimeout(() => {
        setRevealCount(revealCount + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
    if (!animationDone && revealCount > 0) {
      setRevealCount(0);
    }
  }, [animationDone, revealCount, total]);

  // Notify parent when animation is done and all letters are revealed
  React.useEffect(() => {
    if (animationDone && revealCount === total && onAnimationEnd) {
      onAnimationEnd();
    }
  }, [animationDone, revealCount, total, onAnimationEnd]);

  // Generate encrypted text for the remaining characters
  React.useEffect(() => {
    if (isExpanded) {
      const remainingLength = total - revealCount;
      const encrypted = Array.from({ length: remainingLength }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
      setEncryptedText(encrypted);
    } else {
      setEncryptedText("");
    }
  }, [isExpanded, revealCount, total, chars]);

  // Handle click - toggle expanded state
  const handleClick = () => {
    if ((hovered || scrollStage >= 2) && !isExpanded) {
      // First click: expand
      setExpanded(true);
    } else if (isExpanded) {
      // Second click: collapse
      setExpanded(false);
      setHovered(false);
    }
  };

  // On mouse leave, only reset hover (not expanded state)
  const handleMouseLeave = () => {
    if (!isExpanded) {
      setHovered(false);
    }
  };

  // Smoother scroll event logic
  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulated = 0;
    const threshold = 40; // px per stage
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      accumulated += delta;
      lastScrollY = window.scrollY;
      if (accumulated > threshold && scrollStage < maxStage) {
        setScrollStage((prev) => Math.min(prev + 1, maxStage));
        accumulated = 0;
      }
    };
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [scrollStage]);

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
          opacity: isExpanded ? 1 : 0,
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
});

// Restore AboutPage React component
function AboutPage() {
  const [bgPos, setBgPos] = useState('center');
  const [showInfoSection, setShowInfoSection] = useState(false);
  const [locked, setLocked] = useState(true);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<any>(null);
  const location = useLocation();
  const isAbout = location.pathname === '/about';

  // Lock/unlock scroll by setting body overflow
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);

  // Listen for wheel/touch events while locked and forward to AnimatedHi
  useEffect(() => {
    if (!locked) return;
    const handleScrollEvent = (e: Event) => {
      e.preventDefault();
      if (hiRef.current && typeof hiRef.current.triggerScrollStage === 'function') {
        hiRef.current.triggerScrollStage();
      }
    };
    window.addEventListener('wheel', handleScrollEvent, { passive: false });
    window.addEventListener('touchmove', handleScrollEvent, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScrollEvent);
      window.removeEventListener('touchmove', handleScrollEvent);
    };
  }, [locked]);

  // When animation is done, unlock scroll and snap to info section
  const handleAnimationEnd = useCallback(() => {
    setTimeout(() => {
      setLocked(false);
      if (infoSectionRef.current) {
        window.scrollTo({
          top: infoSectionRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 400); // short delay for natural feel
  }, []);

  // Snap to top function
  const snapToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Optionally, re-lock scroll and reset HI animation here if you want to re-run it
    // setLocked(true); // Uncomment if you want to re-lock and re-run HI
    // if (hiRef.current && typeof hiRef.current.reset === 'function') hiRef.current.reset();
  }, []);

  // Scroll detection for revealing info section (no snap here) and snap back up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let snapCooldown = false;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Show info section when user scrolls past 50% of viewport
      if (scrollY > windowHeight * 0.5) {
        setShowInfoSection(true);
      } else {
        setShowInfoSection(false);
      }
      // Snap back up if scrolling up and above 20% of first section
      if (!locked && lastScrollY > scrollY && scrollY < windowHeight * 0.2 && !snapCooldown) {
        snapCooldown = true;
        snapToTop();
        setTimeout(() => { snapCooldown = false; }, 1000); // debounce
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [locked, snapToTop]);

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
    const imageId = 'face.jpeg';
    const fallbackUrl = '/assets/face.jpeg';
    
    if (isCloudflareConfigured()) {
      try {
        // Get the Cloudflare Image ID from the mapping
        const cloudflareImageId = getCloudflareImageId(imageId);
        console.log('About page - Cloudflare Image ID:', cloudflareImageId);
        
        // Use the Cloudflare Images system with the actual Cloudflare ID
        const cloudflareUrl = getCloudflareImageUrl(cloudflareImageId, 'background');
        console.log('About page background - Cloudflare URL:', cloudflareUrl);
        return cloudflareUrl;
      } catch (error) {
        console.warn('Failed to generate Cloudflare URL for face.jpeg, using fallback:', error);
      }
    }
    
    console.log('About page background - using fallback URL:', fallbackUrl);
    return fallbackUrl;
  };

  const backgroundUrl = getBackgroundImageUrl();

  return (
    <div className="bg-black dark:bg-black text-white overflow-x-hidden w-full max-w-full">
      {/* First section: HI animation with background */}
      <div
        className="min-h-screen flex flex-col items-center justify-center relative w-full max-w-full overflow-x-hidden"
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
            {navRight
              .filter(item => (!isAbout ? item.label !== 'About' : item.label !== 'About' && item.label !== 'Contact'))
              .map((item) => (
                <ContactLink
                  key={item.label}
                  to={item.href}
                  className="font-medium text-lg opacity-80 hover:opacity-100 transition-opacity duration-200"
                >
                  {item.label}
                </ContactLink>
              ))}
          </div>
        </nav>
        <div className="h-20" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatedHi ref={hiRef} onAnimationEnd={handleAnimationEnd} />
        </div>
      </div>

      {/* Second section: Contact page replica */}
      <div
        ref={infoSectionRef}
        className={`min-h-screen bg-white text-black font-mono relative overflow-hidden transition-opacity duration-1000 w-full max-w-full ${showInfoSection ? 'opacity-100' : 'opacity-0'}`}
        style={{ fontSize: '15px', letterSpacing: '0.01em', overflowX: 'hidden', maxWidth: '100vw' }}
      >
        {/* Absolutely positioned close button */}
        <button
          className="fixed md:absolute top-4 right-4 z-50 cursor-pointer bg-transparent border-none p-0 text-inherit text-xs"
          style={{ fontFamily: 'monospace', lineHeight: 1.2, letterSpacing: '0.01em' }}
          onClick={snapToTop}
        >
          [CLOSE]
        </button>
        {/* Top bar */}
        <div className="w-full flex justify-between items-start px-8 pt-4 text-xs" style={{ fontFamily: 'monospace' }}>
          <div>US EASTERN / {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: false })}</div>
          {/* Email top center: desktop only */}
          <div className="hidden md:block text-center w-full absolute left-0 right-0 mx-auto" style={{ pointerEvents: 'none' }}>
            <span className="inline-block" style={{ pointerEvents: 'auto' }}>INFO@HAITHAMISWED.COM</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-start w-full pt-8 md:pt-16 pr-4 md:pr-12 gap-0">
          {/* Left: Large Info, flush left */}
          <div className="flex flex-col justify-start items-start w-full md:w-auto" style={{ minWidth: '0' }}>
            <span className="text-[14vw] md:text-[9vw] font-bold leading-none select-none mb-2 md:mb-0" style={{ fontFamily: 'monospace', lineHeight: 1 }}>info</span>
          </div>
          {/* Right: Info and Socials block, responsive */}
          <div className="flex flex-col items-start justify-start w-full md:ml-[8vw] mt-2 pl-4 md:pl-12">
            <div className="bg-white border-none shadow-none p-0 min-w-[0] max-w-full md:min-w-[320px] md:max-w-[420px]" style={{ fontFamily: 'monospace', marginTop: 0 }}>
              <div className="mb-6 w-full">
                <div className="mb-2 font-bold text-xs">INFO:</div>
                <div className="text-xs" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  HAITHAM ISWED<br/>
                  407 *** ****<br/>
                  ORL, FL<br/>               
                  HELLO@HAITHAMISWED.COM
                </div>
              </div>
              <div className="w-full">
                <div className="mb-2 font-bold text-xs">SOCIALS:</div>
                <div className="text-xs" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  <a href="https://www.instagram.com/hiswed/" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>INSTAGRAM</a><br/>
                  <a href="https://www.behance.net/haithamiswed" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>BEHANCE</a><br/>
                  <a href="https://www.artstation.com/haithamiswed" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>ARTSTATION</a><br/>
                  <a href="https://www.youtube.com/@" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>YOUTUBE</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer for mobile/desktop */}
        <div>
          {/* Desktop & mobile: absolute copyright bottom left */}
          <div className="absolute left-0 bottom-0 px-8 pb-4 text-xs flex flex-col gap-1 z-10 select-none" style={{ fontFamily: 'monospace' }}>
            <span>ALL RIGHTS RESERVED</span>
            <span>HAITHAM ISWED ©2025</span>
          </div>
          {/* Desktop: absolute footers */}
          <div className="hidden md:block">
            {/* Policy menu at the bottom right */}
            <div className="absolute right-0 bottom-0 px-8 pb-4 text-xs flex flex-row items-center gap-3 z-10 select-none" style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
              <Link to="/privacy-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>PRIVACY POLICY</Link>
              <Link to="/cookie-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>COOKIE POLICY</Link>
            </div>
            {/* Main menu at the bottom center, stacked */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pb-4 text-xs flex flex-col items-center gap-0 z-10 select-none" style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
              <Link to="/commercial" className="cursor-pointer mb-1" style={{ textDecoration: 'none', color: 'inherit' }}>COMMERCIAL</Link>
              <Link to="/photography" className="cursor-pointer mb-1" style={{ textDecoration: 'none', color: 'inherit' }}>PHOTOGRAPHY</Link>
              <Link to="/advertising" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>ADVERTISING</Link>
            </div>
          </div>
          {/* Mobile: stacked, left-aligned footer (menu only, copyright stays pinned left) */}
          <div className="block md:hidden w-full px-4 pb-4 pt-8 text-xs flex flex-col gap-1 z-10 select-none" style={{ fontFamily: 'monospace' }}>
            <div className="w-full text-left mb-2">
              <span className="inline-block" style={{ pointerEvents: 'auto' }}>INFO@HAITHAMISWED.COM</span>
            </div>
            <Link to="/privacy-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>PRIVACY POLICY</Link>
            <Link to="/cookie-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>COOKIE POLICY</Link>
            <Link to="/commercial" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>COMMERCIAL</Link>
            <Link to="/photography" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>PHOTOGRAPHY</Link>
            <Link to="/advertising" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>ADVERTISING</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add ContactPage component
function ContactPage() {
  // Animation state
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Get current time in US Eastern timezone
  const now = new Date();
  const easternTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: false });

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  // Get previous path from location.state
  let prevPath = '/';
  if (location.state && location.state.prevPath && location.state.prevPath !== '/contact') {
    prevPath = location.state.prevPath;
  }

  // Handle close with animation
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      navigate(prevPath);
    }, 700); // match transition duration
  };

  return (
    <div
      className={`min-h-screen w-full bg-white text-black font-mono fixed inset-0 z-50 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ fontSize: '15px', letterSpacing: '0.01em' }}
    >
      {/* Top bar */}
      <div className="w-full flex justify-between items-start px-8 pt-4 text-xs" style={{ fontFamily: 'monospace' }}>
        <div>US EASTERN / {easternTime}</div>
        {/* Email top center: desktop only */}
        <div className="hidden md:block text-center w-full absolute left-0 right-0 mx-auto" style={{ pointerEvents: 'none' }}>
          <span className="inline-block" style={{ pointerEvents: 'auto' }}>INFO@HAITHAMISWED.COM</span>
        </div>
        <button className="ml-4 cursor-pointer bg-transparent border-none p-0 text-inherit" style={{ fontFamily: 'monospace' }} onClick={handleClose}>[CLOSE]</button>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row items-start w-full pt-8 md:pt-16 pr-4 md:pr-12 gap-0">
        {/* Left: Large Info, flush left */}
        <div className="flex flex-col justify-start items-start w-full md:w-auto" style={{ minWidth: '0' }}>
          <span className="text-[14vw] md:text-[9vw] font-bold leading-none select-none mb-2 md:mb-0" style={{ fontFamily: 'monospace', lineHeight: 1 }}>hello</span>
        </div>
        {/* Right: Clients and Awards block, responsive */}
        <div className="flex flex-col items-start justify-start w-full md:ml-[8vw] mt-2 pl-4 md:pl-12">
          <div className="bg-white border-none shadow-none p-0 min-w-[0] max-w-full md:min-w-[320px] md:max-w-[420px]" style={{ fontFamily: 'monospace', marginTop: 0 }}>
            <div className="mb-6 w-full">
              <div className="mb-2 font-bold text-xs">HELLO:</div>
              <div className="text-xs" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                HAITHAM ISWED<br/>
                407 *** ****<br/>
                ORL, FL<br/>               
                HELLO@HAITHAMISWED.COM
              </div>
            </div>
            <div className="w-full">
              <div className="mb-2 font-bold text-xs">SOCIALS:</div>
              <div className="text-xs" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                <a href="https://www.instagram.com/hiswed/" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>INSTAGRAM</a><br/>
                <a href="https://www.behance.net/haithamiswed" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>BEHANCE</a><br/>
                <a href="https://www.artstation.com/haithamiswed" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>ARTSTATION</a><br/>
                <a href="https://www.youtube.com/@" target="_blank" rel="noopener noreferrer" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>YOUTUBE</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer for mobile/desktop */}
      {/* On mobile, stack and left-align all footer items. On desktop, keep previous layout. */}
      <div>
        {/* Desktop & mobile: absolute copyright bottom left */}
        <div className="absolute left-0 bottom-0 px-8 pb-4 text-xs flex flex-col gap-1 z-10 select-none" style={{ fontFamily: 'monospace' }}>
          <span>ALL RIGHTS RESERVED</span>
          <span>HAITHAM ISWED ©2025</span>
        </div>
        {/* Desktop: absolute footers */}
        <div className="hidden md:block">
          {/* Policy menu at the bottom right */}
          <div className="absolute right-0 bottom-0 px-8 pb-4 text-xs flex flex-row items-center gap-3 z-10 select-none" style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
            <Link to="/privacy-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>PRIVACY POLICY</Link>
            <Link to="/cookie-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>COOKIE POLICY</Link>
          </div>
          {/* Main menu at the bottom center, stacked */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pb-4 text-xs flex flex-col items-center gap-0 z-10 select-none" style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
            <Link to="/commercial" className="cursor-pointer mb-1" style={{ textDecoration: 'none', color: 'inherit' }}>COMMERCIAL</Link>
            <Link to="/photography" className="cursor-pointer mb-1" style={{ textDecoration: 'none', color: 'inherit' }}>PHOTOGRAPHY</Link>
            <Link to="/advertising" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>ADVERTISING</Link>
          </div>
        </div>
        {/* Mobile: email above menu, then stacked, left-aligned footer (menu only, copyright stays pinned left) */}
        <div className="block md:hidden w-full px-4 pb-4 pt-8 text-xs flex flex-col gap-1 z-10 select-none" style={{ fontFamily: 'monospace' }}>
          <div className="w-full text-left mb-2">
            <span className="inline-block" style={{ pointerEvents: 'auto' }}>INFO@HAITHAMISWED.COM</span>
          </div>
          <Link to="/privacy-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>PRIVACY POLICY</Link>
          <Link to="/cookie-policy" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>COOKIE POLICY</Link>
          <Link to="/commercial" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>COMMERCIAL</Link>
          <Link to="/photography" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>PHOTOGRAPHY</Link>
          <Link to="/advertising" className="cursor-pointer" style={{ textDecoration: 'none', color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.01em' }}>ADVERTISING</Link>
        </div>
      </div>
    </div>
  );
}

// Add placeholder pages for menu items
function PrivacyPolicyPage() {
  return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono"><h1 className="text-3xl">Privacy Policy</h1></div>;
}
function CookiePolicyPage() {
  return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono"><h1 className="text-3xl">Cookie Policy</h1></div>;
}
function AdvertisingPage() {
  return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono"><h1 className="text-3xl">Advertising</h1></div>;
}
function CommercialPage() {
  return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono"><h1 className="text-3xl">Commercial</h1></div>;
}
function PhotographyPage() {
  return <div className="min-h-screen flex items-center justify-center bg-white text-black font-mono"><h1 className="text-3xl">Photography</h1></div>;
}

// Restore AboutPage route
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  // Check if the current route is /contact
  const isContact = location.pathname === '/contact';
  // Store the previous location for modal overlay
  const [prevLocation, setPrevLocation] = React.useState(location);
  React.useEffect(() => {
    if (!isContact) setPrevLocation(location);
  }, [location, isContact]);

  return (
    <>
      <Routes location={isContact ? prevLocation : location}>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/advertising" element={<AdvertisingPage />} />
        <Route path="/commercial" element={<CommercialPage />} />
        <Route path="/photography" element={<PhotographyPage />} />
      </Routes>
      {/* Modal overlay for ContactPage */}
      {isContact && <ContactPage />}
    </>
  );
}

// Utility: Link wrapper to pass prevPath in state for Contact link
type ContactLinkProps = { to: string; [key: string]: any };
export function ContactLink({ to, ...props }: ContactLinkProps) {
  const location = useLocation();
  return <Link to={to} state={{ prevPath: location.pathname }} {...props} />;
}