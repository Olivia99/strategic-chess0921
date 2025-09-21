'use client';

import React, { useState } from 'react';
import GameBoard from '@/components/game/GameBoard';
import { GameState, Position } from '@/lib/types/game';
import { createInitialBoard } from '@/lib/game/board';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'white',
    trophyPoints: { white: 0, black: 0 },
    selectedPiece: null,
    possibleMoves: [],
    gamePhase: 'playing',
    winner: null,
    turnCount: 1,
    players: {
      white: { hero: null },
      black: { hero: null }
    }
  });

  const handleSquareClick = (position: Position) => {
    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedPiece) {
      // If clicking on a possible move
      const isPossibleMove = gameState.possibleMoves.some(
        move => move.x === position.x && move.y === position.y
      );
      
      if (isPossibleMove) {
        // TODO: Implement actual move logic
        console.log('Move piece from', gameState.selectedPiece.position, 'to', position);
        
        // Clear selection for now
        setGameState(prev => ({
          ...prev,
          selectedPiece: null,
          possibleMoves: []
        }));
      } else {
        // Deselect if clicking elsewhere
        setGameState(prev => ({
          ...prev,
          selectedPiece: null,
          possibleMoves: []
        }));
      }
    } else if (piece && piece.player === gameState.currentPlayer) {
      // Select piece
      setGameState(prev => ({
        ...prev,
        selectedPiece: piece,
        possibleMoves: [] // TODO: Calculate actual possible moves
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
              <span className="text-gray-600">{gameState.trophyPoints.white} 🏆</span>
            </div>
            <div className="text-gray-600">Turn {gameState.turnCount}</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="font-semibold text-white">Black: </span>
              <span className="text-gray-200">{gameState.trophyPoints.black} 🏆</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <GameBoard
            board={gameState.board}
            selectedPiece={gameState.selectedPiece}
            possibleMoves={gameState.possibleMoves}
            currentPlayer={gameState.currentPlayer}
            onSquareClick={handleSquareClick}
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            🚧 Movement system coming soon! For now, you can select pieces. 🚧
          </p>
        </div>
      </div>
    </div>
  );
}