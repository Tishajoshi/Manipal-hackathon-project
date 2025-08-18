import React, { useEffect, useRef } from "react";

export default function Particles({ density = 0.00015, speed = 0.25, color = "rgba(255,255,255,0.5)", parallax = 12 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 }); // normalized -0.5..0.5

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const num = Math.max(40, Math.floor(canvas.width * canvas.height * density));
      particlesRef.current = Array.from({ length: num }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.4,
      }));
    };

    const step = () => {
      const particles = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        // Keep speed constant: only apply base velocity
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < 0) p.x = canvas.width; else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; else if (p.y > canvas.height) p.y = 0;

        // Non-accumulating parallax shift for drawing
        const drawX = p.x + mx * parallax;
        const drawY = p.y + my * parallax;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      animationRef.current = requestAnimationFrame(step);
    };

    resize();
    step();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [density, speed, color, parallax]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
