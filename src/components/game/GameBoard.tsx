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
    let className = 'absolute w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-200 z-10';
    
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
    const cellSize = 80;           // Grid cell size
    const containerPadding = 16;   // Container p-4 = 16px
    const svgSize = boardPixelSize - 32; // SVG size after removing padding
    const boardSize = cellSize * (BOARD_SIZE - 1); // 480px
    const gridMargin = (svgSize - boardSize) / 2; // 24px margin in SVG
    
    return {
      left: `${containerPadding + gridMargin + x * cellSize}px`,
      top: `${containerPadding + gridMargin + y * cellSize}px`, 
      transform: 'translate(-50%, -50%)'
    };
  };

  const renderGridLines = () => {
    const cellSize = 80;
    const boardSize = cellSize * (BOARD_SIZE - 1); // 480px
    const svgSize = boardPixelSize - 32; // 528px  
    const gridMargin = (svgSize - boardSize) / 2; // 24px
    const lines = [];

    // Horizontal lines
    for (let i = 0; i < BOARD_SIZE; i++) {
      lines.push(
        <line
          key={`h-${i}`}
          x1={gridMargin}
          y1={gridMargin + i * cellSize}
          x2={gridMargin + boardSize}
          y2={gridMargin + i * cellSize}
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
          x1={gridMargin + i * cellSize}
          y1={gridMargin}
          x2={gridMargin + i * cellSize}
          y2={gridMargin + boardSize}
          stroke="white"
          strokeWidth="2"
        />
      );
    }

    return lines;
  };

  const boardPixelSize = 80 * (BOARD_SIZE - 1) + 80; // Total board size in pixels

  // Special positions (golden diamond markers in center row)
  // 4B = x:1, y:3, 4D = x:3, y:3, 4F = x:5, y:3
  const specialPositions = [
    { x: 1, y: 3 }, // 4B
    { x: 3, y: 3 }, // 4D
    { x: 5, y: 3 }  // 4F
  ];


  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-700">
        Current Player: 
        <span className={`ml-2 px-3 py-1 rounded ${
          currentPlayer === 'white' 
            ? 'bg-gray-200 text-gray-800' 
            : 'bg-gray-800 text-white'
        }`}>
          {currentPlayer === 'white' ? 'White' : 'Black'}
        </span>
      </div>
      
      <div className="relative bg-gray-600 shadow-lg rounded-lg p-4" style={{ width: boardPixelSize, height: boardPixelSize }}>
        {/* Grid lines */}
        <svg 
          className="absolute" 
          style={{ 
            left: '16px', 
            top: '16px', 
            width: `${boardPixelSize - 32}px`, 
            height: `${boardPixelSize - 32}px` 
          }}
          width={boardPixelSize - 32} 
          height={boardPixelSize - 32}
        >
          {renderGridLines()}
        </svg>

        {/* Special position markers */}
        {specialPositions.map((pos, index) => {
          const cellSize = 80;
          const containerPadding = 16;
          const svgSize = boardPixelSize - 32;
          const boardSize = cellSize * (BOARD_SIZE - 1);
          const gridMargin = (svgSize - boardSize) / 2;
          
          // Calculate exact center position without nested transforms
          const centerX = containerPadding + gridMargin + pos.x * cellSize;
          const centerY = containerPadding + gridMargin + pos.y * cellSize;
          
          return (
            <div
              key={`special-${index}`}
              className="absolute w-6 h-6 border-2 bg-transparent"
              style={{ 
                left: `${centerX - 12}px`, // 12px = half of w-6 (24px)
                top: `${centerY - 12}px`,  // 12px = half of h-6 (24px)
                transform: 'rotate(45deg)',
                borderColor: '#EAB308',
                zIndex: 5
              }}
            />
          );
        })}

        {/* Coordinate labels */}
        {Array.from({ length: BOARD_SIZE }, (_, i) => (
          <React.Fragment key={`coords-${i}`}>
            {/* Column labels (A-G) */}
            <div 
              className="absolute text-white font-bold text-sm"
              style={{ 
                left: `${16 + 24 + i * 80}px`, 
                top: '2px',
                transform: 'translateX(-50%)'
              }}
            >
              {String.fromCharCode(65 + i)}
            </div>
            {/* Row labels (1-7) */}
            <div 
              className="absolute text-white font-bold text-sm"
              style={{ 
                left: '2px', 
                top: `${16 + 24 + i * 80}px`,
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
                    size={50}
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