'use client';

import React from 'react';
import { Piece, Position, Player } from '@/lib/types/game';
import { BOARD_SIZE } from '@/lib/game/board';
import PieceIcon from './PieceIcon';

interface GameBoardProps {
  board: (Piece | null)[][];
  selectedPiece: Piece | null;
  possibleMoves: Position[];
  currentPlayer: Player;
  onSquareClick: (position: Position) => void;
}

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

  const getIntersectionClassName = (position: Position): string => {
    let className = 'absolute w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 z-10';
    
    if (isSelected(position)) {
      className += ' bg-blue-400 rounded-full bg-opacity-50';
    } else if (isPossibleMove(position)) {
      className += ' bg-green-400 rounded-full bg-opacity-30 hover:bg-opacity-50';
    } else {
      className += ' hover:bg-gray-300 hover:bg-opacity-30 rounded-full';
    }

    return className;
  };

  // Convert board coordinates to pixel positions
  const getIntersectionStyle = (x: number, y: number) => {
    const cellSize = 60; // Size of each grid cell
    const offset = 30; // Half cell size to center on intersections
    
    return {
      left: `${x * cellSize + offset}px`,
      top: `${y * cellSize + offset}px`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const renderGridLines = () => {
    const cellSize = 60;
    const boardSize = cellSize * (BOARD_SIZE - 1);
    const lines = [];

    // Horizontal lines
    for (let i = 0; i < BOARD_SIZE; i++) {
      lines.push(
        <line
          key={`h-${i}`}
          x1={30}
          y1={30 + i * cellSize}
          x2={30 + boardSize}
          y2={30 + i * cellSize}
          stroke="white"
          strokeWidth="2"
        />
      );
    }

    // Vertical lines
    for (let i = 0; i < BOARD_SIZE; i++) {
      lines.push(
        <line
          key={`v-${i}`}
          x1={30 + i * cellSize}
          y1={30}
          x2={30 + i * cellSize}
          y2={30 + boardSize}
          stroke="white"
          strokeWidth="2"
        />
      );
    }

    return lines;
  };

  const boardPixelSize = 60 * (BOARD_SIZE - 1) + 60; // Total board size in pixels

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
      
      <div className="relative bg-gray-600 shadow-lg rounded-lg p-4" style={{ width: boardPixelSize, height: boardPixelSize }}>
        {/* Grid lines */}
        <svg 
          className="absolute inset-0" 
          width={boardPixelSize} 
          height={boardPixelSize}
        >
          {renderGridLines()}
        </svg>

        {/* Coordinate labels */}
        {Array.from({ length: BOARD_SIZE }, (_, i) => (
          <React.Fragment key={`coords-${i}`}>
            {/* Column labels (A-G) */}
            <div 
              className="absolute text-white font-bold text-sm"
              style={{ 
                left: `${30 + i * 60}px`, 
                top: '5px',
                transform: 'translateX(-50%)'
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
            {/* Row labels (1-7) */}
            <div 
              className="absolute text-white font-bold text-sm"
              style={{ 
                left: '5px', 
                top: `${30 + i * 60}px`,
                transform: 'translateY(-50%)'
              }}
            >
              {BOARD_SIZE - i}
            </div>
          </React.Fragment>
        ))}

        {/* Intersection points and pieces */}
        {Array.from({ length: BOARD_SIZE }, (_, y) =>
          Array.from({ length: BOARD_SIZE }, (_, x) => {
            const position: Position = { x, y };
            const piece = board[y][x];
            
            return (
              <div
                key={`${x}-${y}`}
                className={getIntersectionClassName(position)}
                style={getIntersectionStyle(x, y)}
                onClick={() => onSquareClick(position)}
              >
                {piece && (
                  <PieceIcon
                    type={piece.type}
                    player={piece.player}
                    size={45}
                    className={`${
                      piece.player === currentPlayer 
                        ? 'opacity-100' 
                        : 'opacity-75'
                    } ${isSelected(position) ? 'scale-110' : ''}`}
                  />
                )}
                
                {isPossibleMove(position) && !piece && (
                  <div className="w-4 h-4 bg-green-500 rounded-full opacity-80" />
                )}
                
                {isPossibleMove(position) && piece && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div className="text-sm text-gray-600 max-w-md text-center">
        {selectedPiece ? (
          <p>
            Selected: <strong>{selectedPiece.type}</strong> at {String.fromCharCode(65 + selectedPiece.position.x)}{BOARD_SIZE - selectedPiece.position.y}
            {possibleMoves.length > 0 && ` • ${possibleMoves.length} possible moves`}
          </p>
        ) : (
          <p>Click on a piece to select it</p>
        )}
      </div>
    </div>
  );
}