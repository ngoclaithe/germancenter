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
  priority?: boolean;
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

/**
 * Uploaded images (in /images/uploads/) are added dynamically after build,
 * so Next.js Image Optimization API cannot serve them in production.
 * We skip optimization for those and let Nginx serve them directly.
 */
function isUploadedImage(src: string) {
  return src.includes("/images/uploads/");
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
  priority,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const defaultFallback = fill
      ? "absolute inset-0 bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center"
      : "bg-gradient-to-br from-[#55B6F6] to-[#6EC2F7] flex items-center justify-center rounded-xl";

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
      priority={priority}
      unoptimized={isUploadedImage(src)}
      onError={() => setError(true)}
    />
  );
}
