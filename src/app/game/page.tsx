'use client';

import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/game/GameBoard';
import { GameState, Position, HeroType, Piece, PieceType } from '@/lib/types/game';
import { createInitialBoard } from '@/lib/game/board';
import { MovementSystem } from '@/lib/game/movement';
import { TrophyScoring } from '@/lib/game/scoring';
import { VictoryConditions } from '@/lib/game/victory';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import GuardInvincibilityModal from '@/components/game/GuardInvincibilityModal';
import HeroAbilityPanel from '@/components/game/HeroAbilityPanel';
import PieceConversionDialog from '@/components/game/PieceConversionDialog';
import { HeroManager, HeroGameState } from '@/lib/heroes/heroManager';
import { PieceConversion } from '@/lib/game/conversion';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'white',
    trophyPoints: { white: 0, black: 0 },
    selectedPiece: null,
    possibleMoves: [],
    gamePhase: 'playing',
    winner: null,
    victoryType: null,
    turnCount: 1,
    players: {
      white: { hero: null },
      black: { hero: null }
    },
    conversionState: {}
  });

  const [heroGameState, setHeroGameState] = useState<HeroGameState>({
    heroes: { white: null, black: null },
    freeMarks: [],
    pins: { white: 0, black: 0 },
    bountyMarks: []
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [guardModalOpen, setGuardModalOpen] = useState(false);
  const [guardModalData, setGuardModalData] = useState<{
    position: Position;
    player: 'white' | 'black';
  } | null>(null);
  
  // Conversion dialog state
  const [conversionDialogOpen, setConversionDialogOpen] = useState(false);
  const [selectedPieceForConversion, setSelectedPieceForConversion] = useState<Piece | null>(null);

  // Initialize heroes from localStorage on component mount
  useEffect(() => {
    const selectedHeroes = localStorage.getItem('selectedHeroes');
    if (selectedHeroes) {
      try {
        const heroes: { white: HeroType | null; black: HeroType | null } = JSON.parse(selectedHeroes);
        
        const newHeroGameState = HeroManager.initializeHeroGameState(heroes.white, heroes.black);
        setHeroGameState(newHeroGameState);

        // Update game state with heroes
        setGameState(prev => ({
          ...prev,
          players: {
            white: { hero: newHeroGameState.heroes.white },
            black: { hero: newHeroGameState.heroes.black }
          }
        }));

        // Apply Alexander's passive ability (start with 3 trophies)
        if (heroes.white === 'alexander') {
          setGameState(prev => HeroManager.applyAlexanderPassive(prev, 'white'));
        }
        if (heroes.black === 'alexander') {
          setGameState(prev => HeroManager.applyAlexanderPassive(prev, 'black'));
        }

        // Clear localStorage after use
        localStorage.removeItem('selectedHeroes');
      } catch (error) {
        console.error('Failed to parse selected heroes:', error);
      }
    }
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showGuardInvincibilityInfo = (position: Position, player: 'white' | 'black') => {
    setGuardModalData({ position, player });
    setGuardModalOpen(true);
  };

  const handleUseAbility = (abilityId: string) => {
    const currentHero = heroGameState.heroes[gameState.currentPlayer];
    if (!currentHero) return;

    try {
      const updatedHero = HeroManager.activateAbility(currentHero, abilityId);
      
      setHeroGameState(prev => ({
        ...prev,
        heroes: {
          ...prev.heroes,
          [gameState.currentPlayer]: updatedHero
        }
      }));

      addToast({
        type: 'success',
        title: 'Ability Used!',
        message: `${updatedHero.activeAbilities.find(a => a.id === abilityId)?.name} activated`,
        duration: 3000
      });

      // Here you would implement the actual ability effects
      // For now, just show a placeholder
      console.log(`Used ability: ${abilityId}`);
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Cannot Use Ability',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration: 3000
      });
    }
  };

  const handleConvertPiece = (piece: Piece, targetType: PieceType) => {
    const result = PieceConversion.executePieceConversion(
      piece,
      targetType,
      gameState
    );

    if (result.success && result.newGameState) {
      setGameState(result.newGameState);

      addToast({
        type: 'success',
        title: 'Piece Converted!',
        message: `${piece.type} transformed into ${targetType}`,
        duration: 3000
      });
    } else {
      addToast({
        type: 'error',
        title: 'Conversion Failed',
        message: result.error || 'Unknown error',
        duration: 3000
      });
    }
  };

  const handleOpenConversion = (piece: Piece) => {
    setSelectedPieceForConversion(piece);
    setConversionDialogOpen(true);
  };

  const handleSquareClick = (position: Position) => {
    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedPiece) {
      // If clicking on a possible move
      const isPossibleMove = gameState.possibleMoves.some(
        move => move.x === position.x && move.y === position.y
      );
      
      if (isPossibleMove) {
        // Execute the move
        const newBoard = gameState.board.map(row => [...row]);
        const moveResult = MovementSystem.executeMove(
          newBoard,
          gameState.selectedPiece.position,
          position
        );
        
        if (moveResult.success) {
          // Update game state
          setGameState(prev => {
            // Calculate updated Trophy points
            const newTrophyPoints = { ...prev.trophyPoints };
            if (moveResult.trophyPoints && moveResult.trophyPoints > 0) {
              newTrophyPoints[prev.currentPlayer] += moveResult.trophyPoints;
            }

            // Check victory conditions (both Commander capture and Trophy)
            const victoryResult = VictoryConditions.checkVictory(
              newBoard,
              newTrophyPoints,
              moveResult.capturedPiece
            );

            const nextPlayer = victoryResult.hasWon ? prev.currentPlayer : (prev.currentPlayer === 'white' ? 'black' : 'white');
            
            // Update hero states after successful move
            if (!victoryResult.hasWon) {
              setHeroGameState(prevHero => {
                let newHeroState = { ...prevHero };

                // Apply Che's passive if piece was captured
                if (moveResult.capturedPiece) {
                  newHeroState = HeroManager.applyChePassive(
                    position,
                    prev.currentPlayer,
                    newHeroState
                  );
                }

                // Update hero abilities with new trophy counts and reduce cooldowns
                const currentHero = newHeroState.heroes[prev.currentPlayer];
                if (currentHero) {
                  const updatedHero = HeroManager.updateUnlockedAbilities(
                    HeroManager.reduceCooldowns(currentHero),
                    newTrophyPoints[prev.currentPlayer]
                  );
                  newHeroState = {
                    ...newHeroState,
                    heroes: {
                      ...newHeroState.heroes,
                      [prev.currentPlayer]: updatedHero
                    }
                  };
                }

                return newHeroState;
              });
            }
            
            return {
              ...prev,
              board: newBoard,
              selectedPiece: null,
              possibleMoves: [],
              currentPlayer: nextPlayer,
              turnCount: prev.currentPlayer === 'black' ? prev.turnCount + 1 : prev.turnCount,
              trophyPoints: newTrophyPoints,
              gamePhase: victoryResult.hasWon ? 'gameOver' : 'playing',
              winner: victoryResult.winner,
              victoryType: victoryResult.victoryType
            };
          });
          
          if (moveResult.capturedPiece) {
            console.log('Captured:', moveResult.capturedPiece.type, 'for', moveResult.trophyPoints, 'Trophy points');
            
            // Check if this was a Commander capture
            if (moveResult.capturedPiece.type === 'commander') {
              console.log('🎉 COMMANDER CAPTURED! Game Over!');
            }
          }
        } else {
          // Handle move errors with enhanced UI
          if (moveResult.error) {
            console.error('Move failed:', moveResult.error.message);
            
            if (moveResult.error.type === 'guard_invincible' && moveResult.error.details) {
              // Show Guard invincibility toast with details button
              addToast({
                type: 'warning',
                title: 'Guard is Invincible!',
                message: 'This Guard cannot be captured in its home territory.',
                duration: 0, // Don't auto-close
                action: {
                  label: 'Learn More',
                  onClick: () => {
                    if (moveResult.error?.details?.guardPosition && moveResult.error?.details?.guardPlayer) {
                      showGuardInvincibilityInfo(
                        moveResult.error.details.guardPosition,
                        moveResult.error.details.guardPlayer
                      );
                    }
                  }
                }
              });
            } else {
              // Show general error toast
              addToast({
                type: 'error',
                title: 'Invalid Move',
                message: moveResult.error.message,
                duration: 3000
              });
            }
          }
        }
      } else {
        // If clicking on another piece of same player, select it
        if (piece && piece.player === gameState.currentPlayer) {
          const possibleMoves = MovementSystem.getPossibleMoves(piece, gameState.board);
          setGameState(prev => ({
            ...prev,
            selectedPiece: piece,
            possibleMoves
          }));
        } else {
          // Deselect if clicking elsewhere
          setGameState(prev => ({
            ...prev,
            selectedPiece: null,
            possibleMoves: []
          }));
        }
      }
    } else if (piece && piece.player === gameState.currentPlayer) {
      // Select piece and calculate possible moves
      const possibleMoves = MovementSystem.getPossibleMoves(piece, gameState.board);
      setGameState(prev => ({
        ...prev,
        selectedPiece: piece,
        possibleMoves
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200 mb-2">
            ⚔️ Strategic Chess
          </h1>
          <div className="flex justify-center items-center space-x-8 text-lg">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-gray-800">White: </span>
              <span className="text-gray-600">
                {TrophyScoring.calculateTotalPoints(gameState.trophyPoints.white, gameState.board, 'white')} 🏆
              </span>
              <span className="text-xs text-gray-500 block">
                Base: {gameState.trophyPoints.white} + Bonus: {TrophyScoring.getSpecialPositionBonus(gameState.board, 'white')}
              </span>
            </div>
            <div className="text-gray-600">
              <div>Turn {gameState.turnCount}</div>
              {gameState.gamePhase === 'gameOver' && gameState.winner && (
                <div className="text-green-600 font-bold">
                  {gameState.victoryType === 'commander' ? '👑' : '🏆'} {gameState.winner.toUpperCase()} WINS! {gameState.victoryType === 'commander' ? '👑' : '🏆'}
                </div>
              )}
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="font-semibold text-white">Black: </span>
              <span className="text-gray-200">
                {TrophyScoring.calculateTotalPoints(gameState.trophyPoints.black, gameState.board, 'black')} 🏆
              </span>
              <span className="text-xs text-gray-400 block">
                Base: {gameState.trophyPoints.black} + Bonus: {TrophyScoring.getSpecialPositionBonus(gameState.board, 'black')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-6">
            {/* White Hero Panel */}
            <div className="w-64">
              <HeroAbilityPanel
                hero={heroGameState.heroes.white}
                player="white"
                trophyPoints={gameState.trophyPoints.white}
                onUseAbility={gameState.currentPlayer === 'white' ? handleUseAbility : () => {}}
              />
            </div>

            {/* Game Board */}
            <div>
              <GameBoard
                board={gameState.board}
                selectedPiece={gameState.selectedPiece}
                possibleMoves={gameState.possibleMoves}
                currentPlayer={gameState.currentPlayer}
                onSquareClick={handleSquareClick}
              />
              
              {/* Conversion Control Panel */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  🔄 Piece Conversion
                </h4>
                {gameState.selectedPiece && gameState.selectedPiece.player === gameState.currentPlayer ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Selected: {gameState.selectedPiece.type} at ({gameState.selectedPiece.position.x}, {gameState.selectedPiece.position.y})
                    </div>
                    {PieceConversion.getConversionTargets(gameState.selectedPiece.type).length > 0 ? (
                      <button
                        onClick={() => handleOpenConversion(gameState.selectedPiece!)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Convert Piece
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        This piece cannot be converted
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Select one of your pieces to convert it
                  </div>
                )}
              </div>
            </div>

            {/* Black Hero Panel */}
            <div className="w-64">
              <HeroAbilityPanel
                hero={heroGameState.heroes.black}
                player="black"
                trophyPoints={gameState.trophyPoints.black}
                onUseAbility={gameState.currentPlayer === 'black' ? handleUseAbility : () => {}}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            ✅ Dual victory conditions active! ✅
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="font-semibold text-yellow-800">🏆 Trophy Victory</p>
                <p className="text-yellow-700">Reach 21 Trophy Points</p>
                <p className="text-xs text-yellow-600 mt-1">Soldier = 1pt, Others = 2pts<br/>Special positions +1pt each</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="font-semibold text-red-800">👑 Commander Victory</p>
                <p className="text-red-700">Capture Enemy Commander</p>
                <p className="text-xs text-red-600 mt-1">Instant win condition</p>
              </div>
            </div>
            {gameState.gamePhase === 'gameOver' && gameState.winner && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">
                    {gameState.victoryType === 'commander' ? '👑' : '🏆'}
                  </span>
                  <p className="text-green-800 font-bold text-lg">
                    {gameState.winner.toUpperCase()} VICTORY!
                  </p>
                  <span className="text-2xl">
                    {gameState.victoryType === 'commander' ? '👑' : '🏆'}
                  </span>
                </div>
                <p className="text-green-700">
                  {gameState.victoryType === 'commander' 
                    ? 'Won by capturing the enemy Commander!'
                    : `Won with ${TrophyScoring.calculateTotalPoints(
                        gameState.trophyPoints[gameState.winner], 
                        gameState.board, 
                        gameState.winner
                      )} Trophy Points!`
                  }
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Victory Type: {gameState.victoryType === 'commander' ? 'Commander Capture' : 'Trophy Points'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Toast notifications */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

        {/* Guard invincibility modal */}
        {guardModalData && (
          <GuardInvincibilityModal
            isOpen={guardModalOpen}
            onClose={() => {
              setGuardModalOpen(false);
              setGuardModalData(null);
            }}
            guardPosition={guardModalData.position}
            guardPlayer={guardModalData.player}
          />
        )}

        {/* Piece conversion dialog */}
        <PieceConversionDialog
          isOpen={conversionDialogOpen}
          onClose={() => {
            setConversionDialogOpen(false);
            setSelectedPieceForConversion(null);
          }}
          piece={selectedPieceForConversion}
          onConvert={handleConvertPiece}
        />
      </div>
    </div>
  );
}