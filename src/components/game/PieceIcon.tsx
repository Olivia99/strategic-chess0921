'use client';

import React from 'react';
import Image from 'next/image';
import { PieceType, Player } from '@/lib/types/game';

interface PieceIconProps {
  type: PieceType;
  player: Player;
  size?: number;
  className?: string;
}

const PIECE_FILES: Record<PieceType, string> = {
  commander: '/Commender.svg',
  soldier: '/Soldier.svg',
  guard: '/Guard.svg',
  raider: '/Raider.svg',
  horse: '/Horse.svg',
  elephant: '/Elephant.svg',
  tower: '/Tower.svg',
  artillery: '/Artillery.svg',
};

export default function PieceIcon({ type, player, size = 40, className = '' }: PieceIconProps) {
  const iconSrc = PIECE_FILES[type];
  
  if (player === 'black') {
    // For black pieces, use a solid background color overlay
    return (
      <div 
        className={`relative ${className}`}
        style={{ width: size, height: size }}
      >
        <div 
          className="absolute inset-0 rounded"
          style={{ 
            backgroundColor: 'rgba(49, 49, 49, 1)',
            mask: `url(${iconSrc}) center/contain no-repeat`,
            WebkitMask: `url(${iconSrc}) center/contain no-repeat`
          }}
        />
      </div>
    );
  }

  // For white pieces, use filter
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconSrc}
        alt={`${player} ${type}`}
        width={size}
        height={size}
        className="transition-all duration-200"
        style={{
          filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'
        }}
      />
    </div>
  );
}