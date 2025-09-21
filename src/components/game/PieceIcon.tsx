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
  
  // Color filter for red/blue teams
  const colorFilter = player === 'red' 
    ? 'brightness(0) saturate(100%) invert(18%) sepia(85%) saturate(2498%) hue-rotate(345deg) brightness(95%) contrast(95%)'  // Red
    : 'brightness(0) saturate(100%) invert(25%) sepia(95%) saturate(2578%) hue-rotate(215deg) brightness(95%) contrast(90%)'; // Blue

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
          filter: colorFilter,
        }}
      />
    </div>
  );
}