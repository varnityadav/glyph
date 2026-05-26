import React, { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CelestialBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 15, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 15, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX / window.innerWidth;
      const offsetY = e.clientY / window.innerHeight;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate stable star positions
  const stars = useMemo(
    () =>
      Array.from({ length: 300 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.3,
        delay: Math.random() * 8,
        duration: Math.random() * 6 + 4,
        depth: Math.random(), // for parallax-like effect
      })),
    []
  );

  // Floating nebulae/orbs — slow, calming
  const nebulae = useMemo(
    () =>
      [
        { color: 'from-violet-900/20', top: '-20%', left: '-15%', w: '70%', h: '70%', dur: 50, x: [0, 80, -40, 0], y: [0, -60, 40, 0] },
        { color: 'from-indigo-900/15', bottom: '-25%', right: '-15%', w: '60%', h: '60%', dur: 60, x: [0, -70, 50, 0], y: [0, 50, -70, 0] },
        { color: 'from-blue-900/10', top: '30%', right: '5%', w: '40%', h: '40%', dur: 45, x: [0, 40, -60, 0], y: [0, -40, 30, 0] },
        { color: 'from-fuchsia-900/10', bottom: '15%', left: '10%', w: '35%', h: '35%', dur: 55, x: [0, -50, 30, 0], y: [0, 60, -30, 0] },
        { color: 'from-amber-900/8', top: '10%', left: '40%', w: '25%', h: '25%', dur: 70, x: [0, 30, -20, 0], y: [0, -20, 40, 0] },
      ] as const,
    []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#070709]">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e]/30 via-[#070709] to-[#020205]" />

      {/* Parallax layer following cursor */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: useSpring(useMotionValue(0), { stiffness: 10, damping: 30 }),
          y: useSpring(useMotionValue(0), { stiffness: 10, damping: 30 }),
        }}
      >
        {/* Nebulae orbs - very slow, calming float */}
        {nebulae.map((n, i) => (
          <motion.div
            key={i}
            animate={{
              x: n.x,
              y: n.y,
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: n.dur,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute bg-gradient-to-br ${n.color} blur-[180px] rounded-full mix-blend-screen pointer-events-none`}
            style={{
              top: n.top,
              left: n.left,
              bottom: n.bottom,
              right: n.right,
              width: n.w,
              height: n.h,
            }}
          />
        ))}
      </motion.div>

      {/* Cursor-reactive subtle parallax layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: useSpring(useMotionValue(0), { stiffness: 5, damping: 40 }),
          y: useSpring(useMotionValue(0), { stiffness: 5, damping: 40 }),
        }}
      >
        {/* Stars with twinkle */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: star.size > 1.5
                ? 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,200,255,0.3))'
                : 'rgba(255,255,255,0.7)',
              boxShadow: star.size > 1.8 ? '0 0 4px rgba(200,200,255,0.3)' : 'none',
            }}
            animate={{
              opacity: [0.15, 0.7, 0.15],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Shooting star trail - very rare, calming */}
        <motion.div
          className="absolute w-[1px] h-[60px] bg-gradient-to-b from-white/0 via-white/20 to-white/0"
          style={{ left: '30%', top: '20%', rotate: '25deg' }}
          animate={{
            x: ['0vw', '120vw'],
            y: ['0vh', '50vh'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 8,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[1px] h-[40px] bg-gradient-to-b from-white/0 via-white/10 to-white/0"
          style={{ left: '70%', top: '10%', rotate: '-15deg' }}
          animate={{
            x: ['0vw', '-80vw'],
            y: ['0vh', '40vh'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            delay: 15,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Subtle noise overlay for depth */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
