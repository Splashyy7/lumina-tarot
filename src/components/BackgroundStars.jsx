import React, { useEffect, useRef } from 'react';

export const BackgroundStars = React.memo(({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let isPaused = false;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Pre-render offscreen nebula sprites with active theme colors
    const createNebulaSprite = (color) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 128;
      offCanvas.height = 128;
      const offCtx = offCanvas.getContext('2d');
      const grad = offCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, 128, 128);
      return offCanvas;
    };

    const nebula1Color = theme?.nebulaColors?.[0] || 'rgba(88, 28, 135, 0.14)';
    const nebula2Color = theme?.nebulaColors?.[1] || 'rgba(217, 119, 6, 0.08)';

    const sprite1 = createNebulaSprite(nebula1Color);
    const sprite2 = createNebulaSprite(nebula2Color);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const primaryStar = theme?.starColors?.primary || '#FDE68A';
    const secondaryStar = theme?.starColors?.secondary || '#C4B5FD';

    // 100 Twinkling Celestial Stars
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      isPrimary: Math.random() > 0.35,
    }));

    // 5 Smooth Drifting Cosmic Nebulas
    const nebulas = Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 200 + 120,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      sprite: Math.random() > 0.5 ? sprite1 : sprite2,
    }));

    let lastTime = performance.now();

    const render = (currentTime) => {
      if (isPaused) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Nebulas
      for (let i = 0; i < nebulas.length; i++) {
        const nebula = nebulas[i];
        nebula.x += nebula.vx * delta * 60;
        nebula.y += nebula.vy * delta * 60;

        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
        if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;

        const size = nebula.radius * 2;
        ctx.drawImage(nebula.sprite, nebula.x - nebula.radius, nebula.y - nebula.radius, size, size);
      }

      // 2. Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.alphaSpeed * delta * 60;
        if (star.alpha <= 0.15 || star.alpha >= 0.95) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        ctx.fillStyle = star.isPrimary ? primaryStar : secondaryStar;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.8 }}
    />
  );
});
