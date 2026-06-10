import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    let frameId;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      layerRef.current?.classList.add('custom-cursor-layer--visible');
    };

    const handleLeave = () => {
      layerRef.current?.classList.remove('custom-cursor-layer--visible');
    };

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div className="custom-cursor-layer" ref={layerRef} aria-hidden="true">
      <div className="custom-cursor" ref={cursorRef}>
        <img className="custom-cursor__image" src="/media/cursor-theme.png" alt="" />
      </div>
    </div>
  );
}
