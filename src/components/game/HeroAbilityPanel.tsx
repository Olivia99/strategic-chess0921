'use client';

import React, { useState } from 'react';
import { Hero, Player } from '@/lib/types/game';
import { HeroManager } from '@/lib/heroes/heroManager';

interface HeroAbilityPanelProps {
  hero: Hero | null;
  player: Player;
  trophyPoints: number;
  onUseAbility: (abilityId: string) => void;
}

const HeroAbilityPanel: React.FC<HeroAbilityPanelProps> = ({
  hero,
  player,
  trophyPoints,
  onUseAbility
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!hero) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">No hero selected</p>
      </div>
    );
  }

  const updatedHero = HeroManager.updateUnlockedAbilities(hero, trophyPoints);
  const availableAbilities = HeroManager.getAvailableAbilities(updatedHero);

  const getHeroIcon = (heroType: string): string => {
    const icons: Record<string, string> = {
      alexander: '🏛️',
      genghis: '🏹',
      napoleon: '🇫🇷',
      washington: '🦅',
      anne: '🏴‍☠️',
      che: '⭐'
    };
    return icons[heroType] || '👑';
  };

  const getPlayerColor = (player: Player) => {
    return player === 'white' 
      ? 'bg-blue-50 border-blue-200 text-blue-800'
      : 'bg-gray-800 border-gray-600 text-gray-100';
  };

  const getCardBackground = (player: Player) => {
    return player === 'white'
      ? 'bg-white bg-opacity-50'
      : 'bg-gray-700 bg-opacity-80';
  };

  const getButtonStyle = (player: Player) => {
    return player === 'white'
      ? 'bg-white bg-opacity-50 hover:bg-opacity-75 text-blue-800'
      : 'bg-gray-600 bg-opacity-80 hover:bg-opacity-100 text-gray-100';
  };

  const getAbilityCardStyle = (player: Player, isUnlocked: boolean, isAvailable: boolean) => {
    if (player === 'white') {
      // White player uses bright colors
      if (isUnlocked) {
        return isAvailable 
          ? 'bg-green-100 border border-green-300 cursor-pointer hover:bg-green-200 text-green-800' 
          : 'bg-yellow-100 border border-yellow-300 text-yellow-800';
      } else {
        return 'bg-gray-200 border border-gray-300 opacity-60 text-gray-600';
      }
    } else {
      // Black player uses darker colors
      if (isUnlocked) {
        return isAvailable 
          ? 'bg-green-900 border border-green-600 cursor-pointer hover:bg-green-800 text-green-200' 
          : 'bg-yellow-900 border border-yellow-600 text-yellow-200';
      } else {
        return 'bg-gray-600 border border-gray-500 opacity-60 text-gray-300';
      }
    }
  };

  return (
    <div className={`rounded-lg p-4 border-2 ${getPlayerColor(player)}`}>
      {/* Hero Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getHeroIcon(hero.type)}</span>
          <div>
            <h3 className="font-bold text-sm">{hero.name}</h3>
            <p className="text-xs opacity-75">{player.toUpperCase()} Player</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`text-xs px-2 py-1 rounded transition-colors ${getButtonStyle(player)}`}
        >
          {showDetails ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Passive Ability */}
      <div className="mb-3">
        <div className={`${getCardBackground(player)} rounded p-2`}>
          <h4 className="text-xs font-semibold mb-1">
            🔹 {hero.passiveAbility.name}
          </h4>
          {showDetails && (
            <p className="text-xs opacity-75">
              {hero.passiveAbility.description}
            </p>
          )}
        </div>
      </div>

      {/* Active Abilities */}
      <div>
        <h4 className="text-xs font-semibold mb-2">⚡ Active Abilities</h4>
        <div className="space-y-2">
          {updatedHero.activeAbilities.map((ability) => {
            const isUnlocked = updatedHero.unlockedAbilities.includes(ability.id);
            const isAvailable = isUnlocked && ability.currentCooldown === 0;
            const isOnCooldown = ability.currentCooldown > 0;
            
            return (
              <div
                key={ability.id}
                className={`p-2 rounded text-xs transition-all ${getAbilityCardStyle(player, isUnlocked, isAvailable)}`}
                onClick={() => isAvailable && onUseAbility(ability.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{ability.name}</span>
                  <div className="flex space-x-1">
                    {!isUnlocked && (
                      <span className="bg-yellow-500 text-white px-1 rounded text-xs">
                        {ability.unlockTrophies}🏆
                      </span>
                    )}
                    {isOnCooldown && (
                      <span className="bg-red-500 text-white px-1 rounded text-xs">
                        CD: {ability.currentCooldown}
                      </span>
                    )}
                    {isAvailable && (
                      <span className="bg-green-500 text-white px-1 rounded text-xs">
                        READY
                      </span>
                    )}
                  </div>
                </div>
                
                {showDetails && (
                  <p className="opacity-75 mt-1">
                    {ability.description}
                  </p>
                )}
                
                {!showDetails && (
                  <div className="text-xs opacity-60">
                    {isUnlocked 
                      ? isOnCooldown 
                        ? `Cooldown: ${ability.currentCooldown} turns`
                        : 'Click to use'
                      : `Unlocks at ${ability.unlockTrophies} trophies`
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ability Count Summary */}
      <div className="mt-3 text-xs text-center opacity-75">
        {availableAbilities.length} of {updatedHero.unlockedAbilities.length} abilities ready
      </div>
    </div>
  );
};

export default HeroAbilityPanel;