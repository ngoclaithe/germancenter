"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  duration?: number;
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directionStyles: Record<string, { from: string; to: string }> = {
    up: {
      from: "translate3d(0, 60px, 0) scale(0.96)",
      to: "translate3d(0, 0, 0) scale(1)",
    },
    down: {
      from: "translate3d(0, -60px, 0) scale(0.96)",
      to: "translate3d(0, 0, 0) scale(1)",
    },
    left: {
      from: "translate3d(-80px, 0, 0) scale(0.96)",
      to: "translate3d(0, 0, 0) scale(1)",
    },
    right: {
      from: "translate3d(80px, 0, 0) scale(0.96)",
      to: "translate3d(0, 0, 0) scale(1)",
    },
    scale: {
      from: "scale(0.8)",
      to: "scale(1)",
    },
    fade: {
      from: "translate3d(0, 0, 0)",
      to: "translate3d(0, 0, 0)",
    },
  };

  const style = directionStyles[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? style.to : style.from,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
}: StaggerChildrenProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimateOnScroll key={index} delay={index * staggerDelay} direction={direction}>
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
}

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
}

export function CountUp({ end, suffix = "", duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
