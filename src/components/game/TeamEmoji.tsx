'use client';

import Image from 'next/image';

interface Props {
  team: 'team_a' | 'team_b';
  size?: number;
  className?: string;
}

export default function TeamEmoji({ team, size = 32, className }: Props) {
  const src = team === 'team_a' ? '/emoji/dragon.png' : '/emoji/tiger.png';
  const alt = team === 'team_a' ? '청룡' : '백호';
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      unoptimized
      priority
    />
  );
}
