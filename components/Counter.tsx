'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface CounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Counter({ value, className, style }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 0.4,
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return motionValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
      }
    });
  }, [motionValue]);

  return <span ref={ref} className={className} style={style}>0</span>;
}
