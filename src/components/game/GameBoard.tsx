'use client';

import React from 'react';
import { Piece, Position, Player } from '@/lib/types/game';
import { BOARD_SIZE, isValidPosition } from '@/lib/game/board';

interface GameBoardProps {
  board: (Piece | null)[][];
  selectedPiece: Piece | null;
  possibleMoves: Position[];
  currentPlayer: Player;
  onSquareClick: (position: Position) => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'red-commander': '⭐',
  'blue-commander': '🌟',
  'red-soldier': '♦️',
  'blue-soldier': '🔹',
  'red-guard': '🛡️',
  'blue-guard': '🛡️',
  'red-raider': '⚔️',
  'blue-raider': '⚔️',
  'red-horse': '🐎',
  'blue-horse': '🐴',
  'red-elephant': '🐘',
  'blue-elephant': '🐘',
  'red-tower': '🏰',
  'blue-tower': '🏯',
  'red-artillery': '💥',
  'blue-artillery': '💣',
};

export default function GameBoard({ 
  board, 
  selectedPiece, 
  possibleMoves, 
  currentPlayer, 
  onSquareClick 
}: GameBoardProps) {
  const isPossibleMove = (position: Position): boolean => {
    return possibleMoves.some(move => move.x === position.x && move.y === position.y);
  };

  const isSelected = (position: Position): boolean => {
    return selectedPiece !== null && 
           selectedPiece.position.x === position.x && 
           selectedPiece.position.y === position.y;
  };

  const getSquareClassName = (position: Position): string => {
    const baseClass = 'w-16 h-16 border border-gray-400 flex items-center justify-center cursor-pointer transition-all duration-200 relative';
    
    let colorClass = '';
    if ((position.x + position.y) % 2 === 0) {
      colorClass = 'bg-amber-100 hover:bg-amber-200';
    } else {
      colorClass = 'bg-amber-200 hover:bg-amber-300';
    }

    if (isSelected(position)) {
      colorClass = 'bg-blue-300 ring-2 ring-blue-500';
    } else if (isPossibleMove(position)) {
      colorClass = 'bg-green-200 hover:bg-green-300';
    }

    return `${baseClass} ${colorClass}`;
  };

  const getPieceSymbol = (piece: Piece): string => {
    const key = `${piece.player}-${piece.type}`;
    return PIECE_SYMBOLS[key] || '❓';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-700">
        Current Player: 
        <span className={`ml-2 px-3 py-1 rounded ${
          currentPlayer === 'red' 
            ? 'bg-red-200 text-red-800' 
            : 'bg-blue-200 text-blue-800'
        }`}>
          {currentPlayer === 'red' ? 'Red' : 'Blue'}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-0 border-2 border-gray-600 bg-white shadow-lg rounded-lg overflow-hidden">
        {Array.from({ length: BOARD_SIZE }, (_, y) =>
          Array.from({ length: BOARD_SIZE }, (_, x) => {
            const position: Position = { x, y };
            const piece = board[y][x];
            
            return (
              <div
                key={`${x}-${y}`}
                className={getSquareClassName(position)}
                onClick={() => onSquareClick(position)}
              >
                {piece && (
                  <span 
                    className={`text-2xl select-none ${
                      piece.player === currentPlayer 
                        ? 'opacity-100' 
                        : 'opacity-75'
                    }`}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                )}
                
                {isPossibleMove(position) && !piece && (
                  <div className="w-4 h-4 bg-green-500 rounded-full opacity-60" />
                )}
                
                {isPossibleMove(position) && piece && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                )}
                
                <div className="absolute bottom-0 left-0 text-xs text-gray-500 p-1 leading-none">
                  {String.fromCharCode(65 + x)}{7 - y}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="text-sm text-gray-600 max-w-md text-center">
        {selectedPiece ? (
          <p>
            Selected: <strong>{selectedPiece.type}</strong> at {String.fromCharCode(65 + selectedPiece.position.x)}{7 - selectedPiece.position.y}
            {possibleMoves.length > 0 && ` • ${possibleMoves.length} possible moves`}
          </p>
        ) : (
          <p>Click on a piece to select it</p>
        )}
      </div>
    </div>
  );
}