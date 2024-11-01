import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [fallingEmojis, setFallingEmojis] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth <= 768;
      setIsMobile(isMobileSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxHeight = window.innerHeight * 0.5;
      const height = Math.min(maxHeight, img.height);
      const width = height * aspectRatio;
      setDimensions({ width, height });
    };
    img.src = 'm.webp';
  }, []);

  useEffect(() => {
    const createFallingEmoji = () => {
      const emojis = ['📈', '📉', '💹', '💲', '💱', '🤑', '💰', '💵', '💸', '💳', '🏦', '💴', '🧲', '🐂', '🍾'];
      const newEmoji = {
        id: Date.now(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 2,
      };
      setFallingEmojis(prevEmojis => [...prevEmojis, newEmoji]);

      setTimeout(() => {
        setFallingEmojis(prevEmojis => prevEmojis.filter(emoji => emoji.id !== newEmoji.id));
      }, newEmoji.animationDuration * 1000);
    };

    const intervalId = setInterval(createFallingEmoji, 200);
    return () => clearInterval(intervalId);
  }, []);

  const renderFrame = () => (
    <div className="relative scale-[75%] md:scale-100" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}>
      {/* Outer frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg shadow-2xl"></div>

      {/* Inner frame details */}
      <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg"></div>
      <div className="absolute inset-4 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-lg"></div>
      <div className="absolute inset-6 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg"></div>

      {/* Ornate corner decorations */}
      {[
        "top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"
      ].map((position, index) => (
        <div key={index} className={`absolute w-16 h-16 ${position}`}>
          <div className="absolute inset-0 bg-yellow-600 rounded-full transform rotate-45"></div>
          <div className="absolute inset-1 bg-yellow-400 rounded-full transform rotate-45"></div>
          <div className="absolute inset-2 bg-yellow-600 rounded-full transform rotate-45"></div>
          <div className="absolute inset-3 bg-yellow-400 rounded-full"></div>
        </div>
      ))}

      {/* Ornate side decorations */}
      {[
        "top-1/2 left-0 -translate-y-1/2",
        "top-1/2 right-0 -translate-y-1/2",
        "left-1/2 top-0 -translate-x-1/2 rotate-90",
        "left-1/2 bottom-0 -translate-x-1/2 rotate-90"
      ].map((position, index) => (
        <div key={index} className={`absolute w-24 h-12 transform ${position}`}>
          <div className="absolute inset-0 bg-yellow-600 rounded-full"></div>
          <div className="absolute inset-1 bg-yellow-400 rounded-full"></div>
          <div className="absolute inset-2 bg-yellow-600 rounded-full"></div>
          <div className="absolute inset-3 bg-yellow-400 rounded-full"></div>
        </div>
      ))}

      {/* Image container */}
      <div className="absolute inset-8 bg-white rounded-lg shadow-inner overflow-hidden">
        <img src="m.webp" alt="Masterpiece Artwork" className="w-full h-full object-cover" />
      </div>

      {/* Frame texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 rounded-lg pointer-events-none"></div>
    </div>
  );

  return (
    <div className="h-[100vh] w-screen flex justify-center items-center bg-white font-custom relative overflow-hidden">
      {/* Falling Emojis */}
      {fallingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute text-3xl"
          style={{
            top: '-3rem',
            left: `${emoji.left}%`,
            animation: `fall ${emoji.animationDuration}s linear forwards`,
            zIndex: 0 // Ensures the emojis are behind the painting frame
          }}
        >
          {emoji.emoji}
        </div>
      ))}
      
      {/* Main Content */}
      <div className="absolute bottom-2 left-2 md:flex items-center space-x-2 bg-opacity-80 p-2 rounded-lg fade-in hidden">
        <img src="m.webp" alt="Artist" className="size-14 rounded-full object-cover" />
        <span className="text-base text-gray-800 font-semibold">• Freaky Lisa</span>
      </div>
      <div className='flex absolute bottom-4 right-4 md:bottom-7 md:right-7 space-x-2'>
        <a href="https://x.com/dogcassocoin">Twitter</a>
        <a href="https://t.me/dcassosol">Telegram</a>
      </div>
      <div className='md:flex gap-4 hidden z-10'>
        <div className="spin-in">{renderFrame()}</div>
        <div className='text-6xl'>
          Freaky Lisa
          <div className='text-lg'>(circa 2024)</div>
          <div className='text-base max-w-[300px]'>
            In this reimagining of the Mona Lisa, the icon sports a wild, electrified hairstyle, as if she's just weathered the stormiest market plunge in history. Yet, despite the chaos—lightning flashing in the background and every hair standing on end—she maintains that classic, mysterious smile. This version of Mona Lisa perfectly captures the essence of a true holder: calm, collected, and unshaken, no matter how turbulent the world around her becomes.
          </div>
        </div>
      </div>
      <div className='gap-1 md:hidden z-10'>
        <div className='flex justify-center'>
          <div className="spin-in">{renderFrame()}</div>
        </div>
        <div className='text-4xl text-center'>
          Freaky Lisa
          <div className='text-lg'>(circa 2024)</div>
        </div>
      </div>
      <div className='absolute top-5 text-[10px] md:text-base'>CA: uploading...</div>
      <div className="spotlight-overlay fade-in"></div>
    </div>
  );
}

export default App;