"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Create a custom event emitter
export const StarEvents = {
  animateToCenter: () => {
    document.dispatchEvent(new Event("ANIMATE_STARS_TO_CENTER"));
  },
  resetStars: () => {
    document.dispatchEvent(new Event("RESET_STARS"));
  },
};

export default function Stars() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = Math.floor((width * height) / 10000);

      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          brightness: Math.random() * 0.5 + 0.5,
          originalX: 0,
          originalY: 0,
          isMoving: false,
          group: Math.floor(Math.random() * 5), // Assign to one of 5 groups
        });
      }
    };

    const animateToCenter = () => {
      const centerX = width / 2;
      const centerY = height / 2;

      particlesRef.current.forEach((particle) => {
        particle.isMoving = true;

        const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
        const distance = Math.sqrt(
          Math.pow(particle.x - centerX, 2) + Math.pow(particle.y - centerY, 2)
        );

        const groupDelay = particle.group * 0.1; // Slightly faster group delay

        // Single, smooth animation to center with spiral
        gsap.to(particle, {
          duration: 1.2,
          x: centerX,
          y: centerY,
          size: 0,
          brightness: 0,
          ease: "power2.inOut",
          delay: groupDelay,
          onStart: () => {
            // Increase size and brightness at start of movement
            gsap.to(particle, {
              duration: 0.3,
              size: particle.size * 2,
              brightness: 1,
              ease: "power2.out",
            });
          },
          onUpdate: function () {
            // Add spiral motion during the animation
            const progress = this.progress();
            const spiralAngle = angle + progress * Math.PI * 4;
            const spiralRadius = distance * (1 - progress);

            particle.x = centerX + Math.cos(spiralAngle) * spiralRadius;
            particle.y = centerY + Math.sin(spiralAngle) * spiralRadius;
          },
        });
      });

      // Clear particles after animation
      setTimeout(() => {
        particlesRef.current = [];
        document.dispatchEvent(new Event("STARS_ANIMATION_COMPLETE"));
      }, 1500);
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        if (!particle.isMoving) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }

        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance && !particle.isMoving) {
          const force = (maxDistance - distance) / maxDistance;
          particle.x -= dx * force * 0.05;
          particle.y -= dy * force * 0.05;
        }

        // Draw star with current brightness
        const opacity = particle.brightness;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    const resetStars = () => {
      // Clear existing particles
      particlesRef.current = [];

      // Reinitialize particles
      initParticles();
    };

    // Initialize
    setCanvasSize();
    initParticles();
    animate();

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    document.addEventListener("ANIMATE_STARS_TO_CENTER", animateToCenter);
    document.addEventListener("RESET_STARS", resetStars);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("ANIMATE_STARS_TO_CENTER", animateToCenter);
      document.removeEventListener("RESET_STARS", resetStars);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full bg-gray-900 -z-0"
    />
  );
}
