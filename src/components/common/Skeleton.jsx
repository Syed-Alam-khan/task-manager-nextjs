'use client';

import React from 'react';

export default function Skeleton({
  className = '',
  width,
  height,
  circle = false,
  count = 1,
}) {
  const elements = Array.from({ length: count });

  return (
    <>
      {elements.map((_, index) => (
        <div
          key={index}
          style={{ width, height }}
          className={`bg-slate-200 dark:bg-slate-800 animate-pulse ${
            circle ? 'rounded-full' : 'rounded-xl'
          } ${className}`}
        />
      ))}
    </>
  );
}
