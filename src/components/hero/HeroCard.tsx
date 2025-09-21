'use client';

import React, { useState } from 'react';
import { HeroType } from '@/lib/types/game';
import { HEROES } from '@/lib/types/heroes';

interface HeroCardProps {
  heroType: HeroType;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  showDetails?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({
  heroType,
  isSelected,
  isDisabled,
  onSelect,
  showDetails = false
}) => {
  const [showAbilities, setShowAbilities] = useState(false);
  const hero = HEROES[heroType];

  const getHeroIcon = (heroType: HeroType): string => {
    const icons = {
      alexander: '🏛️',
      genghis: '🏹',
      napoleon: '🇫🇷',
      washington: '🦅',
      anne: '🏴‍☠️',
      che: '⭐'
    };
    return icons[heroType];
  };

  const getHeroEra = (heroType: HeroType): string => {
    const eras = {
      alexander: 'Ancient Greece (356-323 BC)',
      genghis: 'Mongol Empire (1162-1227)',
      napoleon: 'French Empire (1769-1821)',
      washington: 'American Revolution (1732-1799)',
      anne: 'Golden Age of Piracy (1697-1782)',
      che: 'Cuban Revolution (1928-1967)'
    };
    return eras[heroType];
  };

  const getHeroDescription = (heroType: HeroType): string => {
    const descriptions = {
      alexander: 'Conqueror of the ancient world, master of cavalry and phalanx tactics.',
      genghis: 'Greatest nomadic conqueror in history, master of horseback warfare.',
      napoleon: 'Emperor of France, revolutionary military tactician and artillery expert.',
      washington: 'Founding Father of America, master of guerrilla warfare and leadership.',
      anne: 'Legendary pirate queen, terror of the Caribbean seas.',
      che: 'Revolutionary icon, master of guerrilla warfare and popular uprising.'
    };
    return descriptions[heroType];
  };

  const cardClass = `
    relative bg-white rounded-lg shadow-lg border-2 transition-all duration-300 cursor-pointer
    ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}
  `;

  return (
    <div className={cardClass} onClick={!isDisabled ? onSelect : undefined}>
      {isDisabled && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
          TAKEN
        </div>
      )}

      <div className="p-6">
        {/* Hero Header */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{getHeroIcon(heroType)}</div>
          <h3 className="text-xl font-bold text-gray-800">{hero.name}</h3>
          <p className="text-sm text-gray-600">{getHeroEra(heroType)}</p>
        </div>

        {/* Hero Description */}
        <p className="text-sm text-gray-700 text-center mb-4">
          {getHeroDescription(heroType)}
        </p>

        {/* Passive Ability */}
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">
              🔹 {hero.passiveAbility.name}
            </h4>
            <p className="text-xs text-blue-700">
              {hero.passiveAbility.description}
            </p>
          </div>
        </div>

        {/* Active Abilities Preview */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-gray-800">⚡ Active Abilities</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAbilities(!showAbilities);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showAbilities ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {showAbilities ? (
            <div className="space-y-2">
              {hero.activeAbilities.map((ability) => (
                <div key={ability.id} className="bg-gray-50 border border-gray-200 rounded p-2">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-xs font-medium text-gray-800">
                      {ability.name}
                    </h5>
                    <div className="flex space-x-1 text-xs">
                      <span className="bg-yellow-100 text-yellow-800 px-1 rounded">
                        {ability.unlockTrophies}🏆
                      </span>
                      <span className="bg-red-100 text-red-800 px-1 rounded">
                        CD:{ability.cooldown}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {ability.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-600">
              {hero.activeAbilities.length} abilities unlock at{' '}
              {hero.activeAbilities.map(a => a.unlockTrophies).join(', ')} Trophy Points
            </div>
          )}
        </div>

        {/* Selection Button */}
        {showDetails && (
          <button
            onClick={onSelect}
            disabled={isDisabled}
            className={`
              w-full py-2 px-4 rounded-lg font-medium transition-colors
              ${isDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isDisabled ? 'Already Selected' : 'Choose This Hero'}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroCard;