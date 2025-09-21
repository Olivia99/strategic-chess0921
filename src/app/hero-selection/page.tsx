'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroType, Player } from '@/lib/types/game';
import { HEROES } from '@/lib/types/heroes';
import HeroCard from '@/components/hero/HeroCard';

type GameMode = 'multiplayer' | 'practice';

export default function HeroSelectionPage() {
  const router = useRouter();
  const [selectedHeroes, setSelectedHeroes] = useState<{
    white: HeroType | null;
    black: HeroType | null;
  }>({
    white: null,
    black: null
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player>('white');
  const [gameMode, setGameMode] = useState<GameMode>('multiplayer');

  const handleHeroSelect = (heroType: HeroType) => {
    setSelectedHeroes(prev => ({
      ...prev,
      [currentPlayer]: heroType
    }));

    if (currentPlayer === 'white') {
      setCurrentPlayer('black');
    } else {
      // Both players have selected heroes, start the game
      startGame();
    }
  };

  const startGame = () => {
    // Store hero selections in localStorage for the game
    localStorage.setItem('selectedHeroes', JSON.stringify(selectedHeroes));
    router.push('/game');
  };

  const resetSelection = () => {
    setSelectedHeroes({ white: null, black: null });
    setCurrentPlayer('white');
  };

  const getPlayerDisplayText = () => {
    if (gameMode === 'practice') {
      return currentPlayer === 'white' 
        ? '为白方选择英雄'
        : '为黑方选择英雄';
    } else {
      return `${currentPlayer === 'white' ? 'White' : 'Black'} Player is choosing their hero...`;
    }
  };

  const handleModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    // Reset selections when switching modes
    resetSelection();
  };

  const heroTypes = Object.keys(HEROES) as HeroType[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200 mb-2">
            👑 Choose Your Hero
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Select a legendary commander to lead your forces
          </p>
          
          {/* Game Mode Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
              <button
                onClick={() => handleModeChange('multiplayer')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  gameMode === 'multiplayer'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                }`}
              >
                👥 双人模式
              </button>
              <button
                onClick={() => handleModeChange('practice')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  gameMode === 'practice'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                }`}
              >
                🎯 单人练习
              </button>
            </div>
          </div>
          
          {/* Mode Description */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {gameMode === 'multiplayer' 
                ? '两个玩家轮流选择各自的英雄'
                : '一个玩家为双方选择英雄进行练习'
              }
            </p>
          </div>
        </div>

        {/* Selection Progress */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-8">
            <div className={`p-4 rounded-lg ${selectedHeroes.white ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'} border-2`}>
              <h3 className="font-semibold text-gray-800">
                {gameMode === 'practice' ? '白方英雄' : 'White Player'}
              </h3>
              {selectedHeroes.white ? (
                <p className="text-blue-700 font-medium">{HEROES[selectedHeroes.white].name}</p>
              ) : (
                <p className="text-gray-600">
                  {gameMode === 'practice' ? '未选择...' : 'Waiting for selection...'}
                </p>
              )}
            </div>

            <div className="text-2xl">⚔️</div>

            <div className={`p-4 rounded-lg ${selectedHeroes.black ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 border-gray-300'} border-2`}>
              <h3 className="font-semibold">
                {gameMode === 'practice' ? '黑方英雄' : 'Black Player'}
              </h3>
              {selectedHeroes.black ? (
                <p className="text-gray-300 font-medium">{HEROES[selectedHeroes.black].name}</p>
              ) : (
                <p className="text-gray-600">
                  {gameMode === 'practice' ? '未选择...' : 'Waiting for selection...'}
                </p>
              )}
            </div>
          </div>

          {/* Current Turn Indicator */}
          <div className="text-center mt-4">
            <p className="text-lg">
              <span className={`font-bold ${currentPlayer === 'white' ? 'text-blue-600' : 'text-gray-800'}`}>
                {getPlayerDisplayText()}
              </span>
            </p>
          </div>
        </div>

        {/* Hero Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {heroTypes.map((heroType) => {
            const isSelected = selectedHeroes.white === heroType || selectedHeroes.black === heroType;
            const isDisabled = isSelected;

            return (
              <HeroCard
                key={heroType}
                heroType={heroType}
                isSelected={false}
                isDisabled={isDisabled}
                onSelect={() => !isDisabled && handleHeroSelect(heroType)}
                showDetails={true}
              />
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetSelection}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={!selectedHeroes.white && !selectedHeroes.black}
          >
            Reset Selection
          </button>
          
          {selectedHeroes.white && selectedHeroes.black && (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Start Game! ⚔️
            </button>
          )}
        </div>

        {/* Game Rules Reminder */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">📜 Hero System Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
            <div>
              <h4 className="font-medium mb-2">🔹 Passive Abilities</h4>
              <p>Each hero has a unique passive ability that&apos;s always active during the game.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ Active Abilities</h4>
              <p>Heroes unlock 3 active abilities at 4, 7, and 10 Trophy Points with cooldown periods.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎯 Strategic Depth</h4>
              <p>Each hero offers different playstyles and strategic options.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏆 Trophy Unlocks</h4>
              <p>Gain Trophy Points by capturing pieces and controlling special positions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}