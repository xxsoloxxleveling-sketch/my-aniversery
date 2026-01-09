import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Type Definitions ---
declare global {
  interface Window {
    confetti: any;
  }
}

// --- Sound Manager Placeholder ---
// Connect these to actual MP3s later if you wish!
const playSound = (type: 'pop' | 'sparkle' | 'success' | 'bloom' | 'shake') => {
  // Example implementation:
  // const audio = new Audio(`/sounds/${type}.mp3`);
  // audio.play().catch(() => {});
  console.log(`Playing sound: ${type}`);
};

// --- CSS-in-JS Styles ---
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    transition: 'filter 1s ease',
    // Cute Background Pattern
    backgroundImage: `
      radial-gradient(#ff9a9e 2px, transparent 2px), 
      radial-gradient(#ff9a9e 2px, transparent 2px)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    backgroundColor: '#fff0f5', // Lavender Blush
  },
  // Keyframes for cloud animation
  // No keyframes here - moved to <style> tag
  // Custom Cursor
  cursorEmoji: {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    fontSize: '24px',
    transform: 'translate(-50%, -50%)',
    left: 0,
    top: 0,
  },
  // Phase 1: Gatekeeper
  gateContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle at center, #ff9a9e 0%, #ffc2d1 100%)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  },
  bunnyMascot: {
    fontSize: '8rem',
    marginBottom: '20px',
    animation: 'float 3s ease-in-out infinite',
    filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.1))',
    transition: 'transform 0.2s',
    zIndex: 10,
    position: 'relative',
  },
  gateInput: {
    padding: '15px 30px',
    borderRadius: '50px',
    border: '4px solid #fff',
    background: 'rgba(255,255,255,0.9)',
    fontSize: '1.5rem',
    color: '#ff8fa3',
    textAlign: 'center',
    outline: 'none',
    width: '200px',
    marginBottom: '20px',
    boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 20,
  },

  // Phase 2: Cloud Dashboard
  dashboard: {
    padding: '40px 20px',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #c2f2ff 0%, #ffc2d1 40%)',
    minHeight: '400px',
    borderRadius: '0 0 50% 50% / 0 0 100px 100px',
    marginBottom: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  cloudShape: {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    filter: 'blur(20px)',
    zIndex: 0,
  },
  timerCard: {
    background: '#fff',
    display: 'inline-block',
    padding: '20px 40px',
    borderRadius: '30px',
    boxShadow: '0 10px 25px rgba(255, 143, 163, 0.3)',
    marginTop: '20px',
    position: 'relative',
    zIndex: 1,
    border: '4px solid #fffdd0',
  },

  // Phase 3: Bubble Memories
  bubbleSection: {
    minHeight: '600px',
    position: 'relative',
    padding: '40px',
    textAlign: 'center',
  },
  bubbleContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '60px',
    marginTop: '40px',
  },

  // Phase 4: Flower Garden
  gardenSection: {
    background: '#e0f7fa', // Very light blue/green
    padding: '60px 20px',
    textAlign: 'center',
    borderRadius: '50px',
    margin: '40px 20px',
    border: '4px dashed #81d4fa',
  },
  gardenGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginTop: '40px',
  },

  // Phase 5: Love Nuke
  nukeSection: {
    padding: '80px 20px',
    textAlign: 'center',
    position: 'relative',
  },
  heartContainer: {
    width: '200px',
    height: '200px',
    margin: '0 auto 30px auto',
    position: 'relative',
    transition: 'transform 0.1s',
  },
  nukeBtn: {
    fontSize: '1.5rem',
    background: '#ff4d6d',
    color: 'white',
    border: 'none',
    padding: '20px 40px',
    borderRadius: '20px',
    boxShadow: '0 8px 0 #c9184a',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },

  // Phase 6: Grand Reveal
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.8)',
    zIndex: 5000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  scrollPaper: {
    width: '90%',
    maxWidth: '700px',
    background: '#fffdd0',
    padding: '60px 40px',
    borderRadius: '5px',
    boxShadow: '0 0 50px #ffd700',
    position: 'relative',
    animation: 'unfurl 2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
    overflowY: 'auto',
    fontFamily: 'Quicksand',
    color: '#4e342e',
    textAlign: 'center',
  },
  waxSeal: {
    width: '80px',
    height: '80px',
    background: '#d32f2f',
    borderRadius: '50%',
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#b71c1c',
    border: '2px solid rgba(0,0,0,0.2)',
  },

  // Audio FAB
  audioFab: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#222',
    border: '3px solid #ffd700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    zIndex: 4000,
  }
};

// --- Helper Components ---

// 1. Cursor Particle System
const CursorController = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Spawn glitter
      if (Math.random() > 0.7) {
        const id = Date.now() + Math.random();
        const colors = ['#ffd700', '#ffc2d1', '#c2f2ff', '#fff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY, color }]);
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== id));
        }, 800);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <div style={{ ...styles.cursorEmoji, left: position.x, top: position.y }}>
        💖
      </div>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed',
          left: p.x,
          top: p.y,
          width: '6px',
          height: '6px',
          background: p.color,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          animation: 'float 0.8s ease-out forwards, fadeOut 0.8s forwards',
          transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`
        }} />
      ))}
    </>
  );
};

// 2. Bubble Memory Component
const Bubble = ({ photoSrc, id, caption, emojiUrl, rotate }: { photoSrc: string, id: number, caption: string, emojiUrl: string, rotate?: number }) => {

  const [popped, setPopped] = useState(false);

  const handlePop = () => {
    if (popped) return;
    setPopped(true);
    playSound('pop');
    window.confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: (window.event as MouseEvent).clientX / window.innerWidth, y: (window.event as MouseEvent).clientY / window.innerHeight },
      colors: ['#c2f2ff', '#fff']
    });
  };

  const bubbleStyle: React.CSSProperties = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // Animation moved to container
    background: popped ? 'none' : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.1) 40%, rgba(194, 242, 255, 0.4) 60%, rgba(255, 194, 209, 0.6) 100%)',
    boxShadow: popped ? '0 10px 30px rgba(255, 215, 0, 0.4)' : 'inset 0 0 20px rgba(255,255,255,0.5), 0 10px 20px rgba(0,0,0,0.1)',
    border: popped ? '5px solid #ffd700' : '1px solid rgba(255,255,255,0.5)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px',
      animation: `float ${3 + id}s ease-in-out infinite`,
      animationDelay: `${id * 0.5}s`,
    }}>
      <div style={bubbleStyle} onClick={handlePop} className="bouncy-hover">
        {/* Shine effect for bubble */}
        {!popped && <div style={{ position: 'absolute', top: '20%', left: '20%', width: '15px', height: '15px', borderRadius: '50%', background: 'white', filter: 'blur(2px)' }}></div>}

        {/* Gift Box (Visible when NOT popped) */}
        <div style={{
          fontSize: '4rem',
          opacity: popped ? 0 : 1,
          transform: popped ? 'scale(0)' : 'scale(1)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        }}>
          🎁
        </div>

        {/* Image Reveal (Visible when popped) */}
        <img
          src={photoSrc}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            position: 'absolute', top: 0, left: 0,
            opacity: popped ? 1 : 0,
            transform: popped ? `scale(1) rotate(${rotate || 0}deg)` : 'scale(0.5)',
            transition: 'all 0.4s ease 0.2s', // slight delay to let confetti pop
            borderRadius: '50%'
          }}
        />
      </div>
      {/* Caption */}
      <div style={{
        marginTop: '15px',
        color: '#d81b60', // Darker pink for visibility
        fontWeight: '900', // Extra bold
        fontSize: '1.3rem',
        textShadow: '2px 2px 0px rgba(255, 255, 255, 0.8)', // Strong white shadow
        opacity: popped ? 1 : 0.8, // More visible usually
        transition: 'opacity 0.3s',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(255,255,255,0.4)', // Subtle backing
        padding: '5px 15px',
        borderRadius: '20px',
        backdropFilter: 'blur(4px)'
      }}>
        {caption}
        <img src={emojiUrl} style={{ width: '32px', height: '32px', animation: 'bounce 0.8s infinite' }} alt="emoji" />
      </div>
    </div>
  );
};

// 3. Blooming Flower Component
const Flower = ({ message, color }: { message: string, color: string }) => {
  const [bloomed, setBloomed] = useState(false);

  const handleBloom = () => {
    if (bloomed) return;
    setBloomed(true);
    playSound('bloom');
  };

  return (
    <div style={{ position: 'relative', width: '120px', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={handleBloom}>
      {/* Message Popup */}
      <div style={{
        position: 'absolute', top: '-60px', background: 'white', padding: '10px', borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontSize: '0.8rem', width: '150px',
        opacity: bloomed ? 1 : 0, transform: bloomed ? 'scale(1)' : 'scale(0)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10
      }}>
        {message}
        <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', background: 'white' }}></div>
      </div>

      {/* Flower / Rose */}
      <div style={{
        transform: bloomed ? 'scale(1) translateY(0)' : 'scale(0) translateY(50px)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformOrigin: 'bottom center',
        fontSize: '60px',
        animation: 'bounce 2s infinite'
      }}>
        🌹
      </div>

      {/* Stem (Adjusted for Rose) */}
      <div style={{ width: '4px', height: '40px', background: '#4caf50', marginTop: '-10px' }}></div>
      <div style={{ width: '30px', height: '4px', background: '#e0e0e0', borderRadius: '50%' }}></div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  // --- States ---
  const [phase, setPhase] = useState<'LOCKED' | 'UNLOCKED' | 'ENDING'>('LOCKED');
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);

  const [timeSince, setTimeSince] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [nukeProgress, setNukeProgress] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [nukeText, setNukeText] = useState('OVERLOAD MY HEART!');

  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Logic ---

  // Autoplay & Audio Init
  useEffect(() => {
    // Initialize Audio
    if (!audioRef.current) {
      audioRef.current = new Audio('/stephen_sanchez.mp3');
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    const attemptPlay = () => {
      audio.play()
        .then(() => {
          setMusicPlaying(true);
          // Cleanup listeners on success
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('keydown', handleInteraction);
        })
        .catch((e) => {
          console.log("Autoplay blocked, waiting for interaction:", e);
        });
    };

    const handleInteraction = () => {
      // Only attempt if not already playing or manually paused (though manual pause logic isn't tracked here, this ensures start)
      // Actually, we just want to ensure it STARTS. If user mutes, toggleMusic handles it.
      if (audio.paused) {
        attemptPlay();
      }
    };

    // Try immediately
    attemptPlay();

    // Fallback listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      // Cleanup usually
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      // NOTE: We don't pause/null here to persist across re-renders/HMR if possible, 
      // but in StrictMode dev it serves to verify cleanup. 
      // For this user script, let's keep it safe.
      audio.pause();
      // audioRef.current = null; // Don't nullify ref to avoid "null" errors in other functions if async events fire
    };
  }, []);

  // Timer
  useEffect(() => {
    const start = new Date('2024-01-10T00:00:00'); // Anniversary Start
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(daysTotal / 365);
      const days = daysTotal % 365;
      setTimeSince({ years, days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Phase 1: Unlock
  const handleUnlock = () => {
    if (gateInput === '10') {
      playSound('success');
      window.confetti({
        particleCount: 200,
        spread: 120,
        colors: ['#ffd700', '#ffc2d1', '#fff']
      });
      setPhase('UNLOCKED');

      // Auto-start music if not playing? 
      // The global listener handles the "interaction" start. 
      // So we don't need explicit logic here unless we want to FORCE unmute.
      // Let's leave it to the global listener (clicking the button/input triggers it).

    } else {
      setGateError(true);
      setTimeout(() => setGateError(false), 500);
    }
  };

  // Phase 5: Nuke Game
  const handleNukeClick = () => {
    if (nukeProgress >= 100) return;

    // Shake Screen
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 100);
    playSound('shake');

    // Spawn heart particle
    const el = document.createElement('div');
    el.innerText = '💖';
    el.style.position = 'fixed';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '100vh';
    el.style.fontSize = '30px';
    el.style.transition = 'top 1s ease-out, opacity 1s';
    el.style.zIndex = '4000';
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.top = '0';
      el.style.opacity = '0';
    }, 50);
    setTimeout(() => el.remove(), 1000);

    // Progress Logic
    const next = nukeProgress + 4; // 25 clicks to win
    setNukeProgress(next);

    if (next < 30) setNukeText("Faster! ❤️");
    else if (next < 70) setNukeText("MORE! ❤️‍🔥");
    else if (next < 100) setNukeText("MAXIMUM LOVE IMMINENT! 🚨");
    else {
      // Win
      setNukeText("EXPLOSION! 💥");
      window.confetti({ duration: 3000, particleCount: 500 });
      setTimeout(() => setPhase('ENDING'), 1500);
    }
  };

  // Audio Toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Manual play failed:", e));
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <>
      <style>{`
      @keyframes moveClouds { 0% { transform: translateX(-100px); } 100% { transform: translateX(120vw); } }
      @keyframes moveCloudsReverse { 0% { transform: translateX(0); } 100% { transform: translateX(-120vw); } }
      @keyframes bgPan { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
      @keyframes floatRabbit { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    `}</style>
      <div style={styles.appContainer} className={screenShake ? 'shake-screen' : ''}>
        <CursorController />

        {/* GATEKEEPER: "Halt! Speak the secret date!" */}
        {phase === 'LOCKED' && (
          <div style={{
            height: '100vh', width: '100vw',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 50
          }}>
            {/* Background Layer (Video) */}
            <video
              autoPlay loop muted playsInline
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: -1
              }}
              src="/gatekeeper_video_bg.mp4"
            />

            {/* Glassmorphism Card (UI) */}
            <div style={{
              zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(10px)',
              padding: '40px', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}>
              {/* Cute Rabbit Mascot (Video) - Floating */}
              <video
                autoPlay loop muted playsInline
                src="/rabbit_mascot_animated.mp4"
                style={{
                  width: '150px', marginBottom: '15px', borderRadius: '50%',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)', border: '4px solid #fff',
                  objectFit: 'cover', height: '150px', // Ensure circle shape
                  animation: 'floatRabbit 3s ease-in-out infinite'
                }}
              />

              <h1 style={{
                color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.4)', marginBottom: '20px',
                fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: '2rem', textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Halt! Speak the secret date!
              </h1>

              <input
                type="text"
                placeholder="XX"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                style={{
                  padding: '15px 30px', fontSize: '1.5rem', borderRadius: '50px', border: 'none',
                  textAlign: 'center', width: '120px', outline: 'none', marginBottom: '20px',
                  background: 'rgba(255,255,255,0.9)', color: '#333', fontWeight: 'bold',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
              />

              <button
                onClick={handleUnlock}
                style={{
                  padding: '12px 30px', fontSize: '1.2rem', borderRadius: '30px', border: 'none',
                  background: '#ff8fa3', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 143, 163, 0.6)', transition: 'transform 0.2s',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Enter Kingdom 🏰
              </button>
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT (Revealed after unlock) --- */}
        <div style={{
          opacity: phase === 'LOCKED' ? 0 : 1,
          transition: 'opacity 1s ease 0.5s',
          filter: phase === 'ENDING' ? 'brightness(0.4)' : 'none' // Dim for finale
        }}>

          {/* PHASE 2: DASHBOARD */}
          <section style={styles.dashboard}>
            {/* BG Clouds */}
            <div style={{ ...styles.cloudShape, width: '300px', height: '300px', top: '-100px', left: '-50px' }}></div>
            <div style={{ ...styles.cloudShape, width: '200px', height: '200px', top: '50px', right: '-50px' }}></div>

            <h1 style={{ fontSize: '3rem', color: '#fff', textShadow: '4px 4px 0px #ffc2d1', position: 'relative', zIndex: 1 }}>
              Happy 2nd Anniversary!
            </h1>

            <div style={styles.timerCard}>
              <h3 style={{ color: '#ff8fa3', margin: 0 }}>Time Since We Said Hello:</h3>
              <div style={{ fontSize: '2rem', marginTop: '10px', color: '#5d4037' }}>
                {timeSince.years} Years<br />
                {timeSince.days}d : {timeSince.hours}h : {timeSince.minutes}m : {timeSince.seconds}s
              </div>
            </div>
          </section>

          {/* PHASE 3: BUBBLE MEMORIES */}
          <section style={styles.bubbleSection}>
            <h2 style={{ color: '#ff8fa3', fontSize: '2.5rem' }}>✨ My Cutie ✨</h2>
            <p style={{ color: '#888' }}>Pop the bubbles to see!</p>

            <div style={styles.bubbleContainer}>
              {/* Valid Image Files from Directory */}
              {[
                { file: "IMG-20260101-WA0030.jpg", text: "My Cutie", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png" },
                { file: "IMG-20260104-WA0123.jpg", text: "My Babe", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Blowing%20a%20Kiss.png" },
                { file: "IMG-20260104-WA0124.jpg", text: "My Love", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" },
                { file: "IMG-20260104-WA0125.jpg", text: "My Everything", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sun%20with%20Face.png" },
                { file: "IMG-20260104-WA0126.jpg", text: "My Heart", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" },
                { file: "IMG-20260104-WA0127.jpg", text: "My Soulmate", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Two%20Hearts.png" },
                { file: "IMG-20260104-WA0128.jpg", text: "My Angel", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Halo.png" },
                { file: "IMG-20260104-WA0129.jpg", text: "My Princess", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png" },
                { file: "IMG-20260104-WA0130.jpg", text: "My Queen", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png" },
                { file: "IMG-20260105-WA0085.jpg", text: "My Sweetheart", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Revolving%20Hearts.png" },
                { file: "IMG-20260105-WA0086.jpg", text: "My Joy", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Tears%20of%20Joy.png" },
                { file: "IMG-20260105-WA0087.jpg", text: "My Happiness", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Smiling%20Eyes.png" },
                { file: "IMG-20260105-WA0088.jpg", text: "My Dream", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Thought%20Balloon.png", rotate: 270 },
                { file: "IMG-20260105-WA0089.jpg", text: "My World", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Americas.png" },
                { file: "IMG-20260105-WA0090.jpg", text: "My Baby", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Baby%20Angel.png" },
                { file: "IMG-20260105-WA0091.jpg", text: "My Darling", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Kissing%20Face.png" },
                { file: "IMG-20260105-WA0092.jpg", text: "My Miracle", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Magic%20Wand.png" },
                { file: "IMG-20260105-WA0093.jpg", text: "My Hotie", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20on%20Fire.png" },
                { file: "IMG-20260105-WA0094.jpg", text: "My Life", emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Growing%20Heart.png", rotate: 270 }
              ].map((item, index) => (
                <Bubble key={item.file} id={index} photoSrc={`/${item.file}`} caption={item.text} emojiUrl={item.emoji} rotate={item.rotate} />
              ))}
            </div>
          </section>

          {/* PHASE 4: FLOWER GARDEN */}
          <section style={styles.gardenSection}>
            <h2 style={{ color: '#4db6ac' }}>🌱 Water the Love Garden 🌱</h2>
            <div style={styles.gardenGrid}>
              <Flower color="#ff8a80" message="Your laugh is my favorite song 🎵" />
              <Flower color="#ea80fc" message="You make life colorful 🌈" />
              <Flower color="#8c9eff" message="My comfort person 🧸" />
              <Flower color="#ffd180" message="The best adventure buddy 🗺️" />
              <Flower color="#ff5252" message="I love you infinitely ❤️" />
            </div>
          </section>

          {/* PHASE 5: LOVE NUKE GAME */}
          <section style={styles.nukeSection}>
            <h2 style={{ color: '#ff4d6d', fontSize: '3rem', marginBottom: '40px' }}>⚠️ DANGER: LOVE OVERLOAD ⚠️</h2>

            <div style={styles.heartContainer}>
              {/* SVG Heart Container */}
              <svg viewBox="0 0 100 100" width="200" height="200" style={{ overflow: 'visible' }}>
                <path d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4 26.2 11.9 41.4 11.9 50.9 21.4L50 22.3 49.1 21.4C58.6 11.9 73.8 11.9 83.3 21.4 92.8 30.9 92.8 46.1 83.3 55.6L50 88.9z"
                  fill="none" stroke="#ff4d6d" strokeWidth="4" />
                {/* Liquid Fill */}
                <clipPath id="fillClip">
                  <path d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4 26.2 11.9 41.4 11.9 50.9 21.4L50 22.3 49.1 21.4C58.6 11.9 73.8 11.9 83.3 21.4 92.8 30.9 92.8 46.1 83.3 55.6L50 88.9z" />
                </clipPath>
                <rect x="0" y={100 - nukeProgress} width="100" height="100" fill="#ff4d6d" clipPath="url(#fillClip)" style={{ transition: 'y 0.1s' }} />
              </svg>
            </div>

            <button
              onMouseDown={handleNukeClick}
              style={{
                ...styles.nukeBtn,
                transform: `scale(${1 + nukeProgress / 200})`, // Button grows
              }}
            >
              {nukeText}
            </button>
            <p style={{ marginTop: '20px', color: '#888' }}>Click rapidly!</p>
          </section>

        </div>

        {/* --- PHASE 6: GRAND FINALE (MODAL) --- */}
        {
          phase === 'ENDING' && (
            <div style={styles.modalOverlay}>
              <div style={styles.scrollPaper}>
                <div style={styles.waxSeal}>❤️</div>
                <h2 style={{ marginTop: '40px', fontSize: '2.5rem', color: '#d32f2f' }}>My Dearest Love,</h2>

                <div style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'left', marginTop: '30px' }}>
                  <p><b>Happy 2nd Anniversary!</b></p>

                  {/* --- PASTE YOUR FINAL LETTER HERE --- */}
                  <p>
                    These past two years have been the most magical adventure of my life.
                    Every day with you feels like a walk in the clouds.
                  </p>
                  <p>
                    Thank you for being my player two <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png" alt="Game Controller" style={{ width: '24px', verticalAlign: 'middle' }} />, my best friend <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20and%20Man%20Holding%20Hands.png" alt="Best Friend" style={{ width: '24px', verticalAlign: 'middle' }} />, and the love of my life <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png" alt="Love" style={{ width: '24px', verticalAlign: 'middle' }} />.
                    I can't wait for all the levels we have yet to unlock together! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Old%20Key.png" alt="Key" style={{ width: '24px', verticalAlign: 'middle' }} /> <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkles.png" alt="Sparkles" style={{ width: '24px', verticalAlign: 'middle' }} />
                  </p>
                  <p>
                    I know there were ups and downs along the way <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Roller%20Coaster.png" alt="Roller Coaster" style={{ width: '24px', verticalAlign: 'middle' }} />. I know I have made a lot of mistakes, and I am sure I will make more in the future as well <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pensive%20Face.png" alt="Sad" style={{ width: '24px', verticalAlign: 'middle' }} />... but please know it is never my intention to hurt you. I am so sorry for everything <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Holding%20Back%20Tears.png" alt="Sorry" style={{ width: '24px', verticalAlign: 'middle' }} /> <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Broken%20Heart.png" alt="Heartbroken" style={{ width: '24px', verticalAlign: 'middle' }} />.
                  </p>
                  <p>
                    I promise to be better and to always be there for you no matter what <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="Shield" style={{ width: '24px', verticalAlign: 'middle' }} />.
                    I will be there if you need anything or want anything <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Genie.png" alt="Genie" style={{ width: '24px', verticalAlign: 'middle' }} />.
                    I will always be here for you <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/House%20with%20Garden.png" alt="Home" style={{ width: '24px', verticalAlign: 'middle' }} />.
                    I will try to improve myself even more for us <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Chart%20Increasing.png" alt="Improve" style={{ width: '24px', verticalAlign: 'middle' }} /> <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Flexed%20Biceps.png" alt="Strong" style={{ width: '24px', verticalAlign: 'middle' }} />.
                  </p>
                  <p>
                    I loved you, I love you, and I will always love you in the future <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Hourglass%20Not%20Done.png" alt="Time" style={{ width: '24px', verticalAlign: 'middle' }} /> <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png" alt="Love" style={{ width: '24px', verticalAlign: 'middle' }} />.
                    You can't even imagine how much I love you! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Milky%20Way.png" alt="Galaxy" style={{ width: '24px', verticalAlign: 'middle' }} /> <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png" alt="Adore" style={{ width: '24px', verticalAlign: 'middle' }} />
                  </p>

                  <p style={{ textAlign: 'right', marginTop: '50px', fontWeight: 'bold' }}>
                    Forever Yours,<br />

                  </p>
                </div>
              </div>
            </div>
          )
        }

        {/* Audio FAB */}
        <div style={styles.audioFab} onClick={toggleMusic}>
          <div style={{
            fontSize: '30px',
            animation: musicPlaying ? 'spin-slow 2s linear infinite' : 'none'
          }}>
            💿
          </div>
        </div>

      </div >
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);