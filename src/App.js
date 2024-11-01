import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [fallingEmojis, setFallingEmojis] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 14;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Create audio element only once when component mounts
    audioRef.current = new Audio('mema.mp3');
    audioRef.current.loop = true;
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleAudioError = (e) => {
      console.error('Audio playback error:', e);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('error', handleAudioError);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleAudioError);
        }
      };
    }
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
    img.src = `m${currentImageIndex}.png`;
  }, [currentImageIndex]);

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
        <img src={`m${currentImageIndex}.png`} alt="Masterpiece Artwork" className="w-full h-full object-cover" />
      </div>

      {/* Frame texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 rounded-lg pointer-events-none"></div>
    </div>
  );

  useEffect(() => {
    const cycleImages = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % (totalImages + 1));
    }, 500);

    return () => clearInterval(cycleImages);
  }, []);

  const handlePlayPause = async () => {
    try {
      if (audioRef.current) {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          if (audioRef.current.ended) {
            audioRef.current.currentTime = 0;
          }
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error handling audio:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex justify-center items-center bg-white md:text-white font-custom relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: 'none' }} // Prevent the video from capturing pointer events
      >
        <source src={`${process.env.PUBLIC_URL}/bg.mp4`} type="video/mp4" />
      </video>

      {/* Falling Emojis */}
      {fallingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute text-3xl"
          style={{
            top: '-3rem',
            left: `${emoji.left}%`,
            animation: `fall ${emoji.animationDuration}s linear forwards`,
            zIndex: 0
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Main Content */}
      <div className="absolute bottom-2 left-2 md:flex items-center space-x-2 bg-opacity-80 p-2 rounded-lg fade-in hidden">
        <img src="m.webp" alt="Artist" className="size-14 rounded-full object-cover" />
        <span className="text-base font-semibold">• Mema Lisa</span>
      </div>
      <div className='flex absolute bottom-4 right-4 md:bottom-7 md:right-7 space-x-2'>
        <a href="https://x.com/" className='hover:underline'>Twitter</a>
        <a href="https://t.me/" className='hover:underline'>Telegram</a>
      </div>
      <div className='md:flex gap-4 hidden z-10'>
        <div className="spin-in">{renderFrame()}</div>
        <div className='text-6xl'>
          Mema Lisa
          <div className='text-lg'>circa 2024</div>
          <div className='text-sm max-w-[350px]'>
            "Mema Lisa" is a vibrant parody that reimagines the iconic Mona Lisa through the lens of crypto and internet culture. Adorned with outrageous hairstyles and colorful accessories, she embodies the playful and chaotic spirit of the digital age. With a mischievous smile, the Mema Lisa invites viewers to engage with the unpredictable nature of contemporary digital culture, where art and humor converge in a lively celebration of creativity.
          </div>
        </div>
      </div>
      <div className='gap-1 md:hidden z-10'>
        <div className='flex justify-center'>
          <div className="spin-in">{renderFrame()}</div>
        </div>
        <div className='text-4xl text-center'>
          Mema Lisa
          <div className='text-lg'>circa 2024</div>
        </div>
      </div>
      <div className='absolute top-5 text-[8px] md:text-base'>CA: updating...</div>
      <div className="spotlight-overlay fade-in"></div>

      {/* Play/Pause Button */}
      <button 
        onClick={handlePlayPause} 
        className="absolute top-5 right-5 p-2 bg-pink-500 text-white rounded-full hidden md:flex"
        style={{ fontSize: '1.5rem' }}
      >
        {isPlaying ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="size-9"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 5.25v13.5m-7.5-13.5v13.5" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="size-9"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" 
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default App;