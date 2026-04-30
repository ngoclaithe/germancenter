"use client";

import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SafeImage({
  src,
  alt,
  fill,
  sizes,
  width,
  height,
  className,
  fallbackClassName,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const defaultFallback = fill
      ? "absolute inset-0 bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center"
      : "bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center rounded-xl";

    return (
      <div
        className={fallbackClassName || defaultFallback}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-white font-bold text-2xl drop-shadow-lg">
          {getInitials(alt)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}
