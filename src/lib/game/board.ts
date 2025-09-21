import { Piece, PieceType, Player, Position } from '../types/game';

export const BOARD_SIZE = 7;

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  // Red pieces (bottom)
  const redPieces: { type: PieceType; x: number; y: number }[] = [
    // Back row
    { type: 'tower', x: 0, y: 6 },
    { type: 'horse', x: 1, y: 6 },
    { type: 'elephant', x: 2, y: 6 },
    { type: 'commander', x: 3, y: 6 },
    { type: 'elephant', x: 4, y: 6 },
    { type: 'horse', x: 5, y: 6 },
    { type: 'tower', x: 6, y: 6 },
    
    // Second row
    { type: 'guard', x: 1, y: 5 },
    { type: 'artillery', x: 2, y: 5 },
    { type: 'raider', x: 3, y: 5 },
    { type: 'artillery', x: 4, y: 5 },
    { type: 'guard', x: 5, y: 5 },
    
    // Soldiers
    { type: 'soldier', x: 0, y: 4 },
    { type: 'soldier', x: 1, y: 4 },
    { type: 'soldier', x: 2, y: 4 },
    { type: 'soldier', x: 3, y: 4 },
    { type: 'soldier', x: 4, y: 4 },
    { type: 'soldier', x: 5, y: 4 },
    { type: 'soldier', x: 6, y: 4 },
  ];

  // Blue pieces (top)
  const bluePieces: { type: PieceType; x: number; y: number }[] = [
    // Back row
    { type: 'tower', x: 0, y: 0 },
    { type: 'horse', x: 1, y: 0 },
    { type: 'elephant', x: 2, y: 0 },
    { type: 'commander', x: 3, y: 0 },
    { type: 'elephant', x: 4, y: 0 },
    { type: 'horse', x: 5, y: 0 },
    { type: 'tower', x: 6, y: 0 },
    
    // Second row
    { type: 'guard', x: 1, y: 1 },
    { type: 'artillery', x: 2, y: 1 },
    { type: 'raider', x: 3, y: 1 },
    { type: 'artillery', x: 4, y: 1 },
    { type: 'guard', x: 5, y: 1 },
    
    // Soldiers
    { type: 'soldier', x: 0, y: 2 },
    { type: 'soldier', x: 1, y: 2 },
    { type: 'soldier', x: 2, y: 2 },
    { type: 'soldier', x: 3, y: 2 },
    { type: 'soldier', x: 4, y: 2 },
    { type: 'soldier', x: 5, y: 2 },
    { type: 'soldier', x: 6, y: 2 },
  ];

  // Place red pieces
  redPieces.forEach((pieceData, index) => {
    board[pieceData.y][pieceData.x] = {
      id: `red-${index}`,
      type: pieceData.type,
      player: 'red',
      position: { x: pieceData.x, y: pieceData.y },
      hasMoved: false
    };
  });

  // Place blue pieces
  bluePieces.forEach((pieceData, index) => {
    board[pieceData.y][pieceData.x] = {
      id: `blue-${index}`,
      type: pieceData.type,
      player: 'blue',
      position: { x: pieceData.x, y: pieceData.y },
      hasMoved: false
    };
  });

  return board;
}

export function isValidPosition(position: Position): boolean {
  return position.x >= 0 && position.x < BOARD_SIZE && 
         position.y >= 0 && position.y < BOARD_SIZE;
}

export function getPieceAt(board: (Piece | null)[][], position: Position): Piece | null {
  if (!isValidPosition(position)) return null;
  return board[position.y][position.x];
}

export function setPieceAt(board: (Piece | null)[][], position: Position, piece: Piece | null): void {
  if (isValidPosition(position)) {
    board[position.y][position.x] = piece;
  }
}

export function getDistance(from: Position, to: Position): number {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

export function isPositionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getPlayerHomeRows(player: Player): number[] {
  return player === 'red' ? [4, 5, 6] : [0, 1, 2];
}

export function isInHomeRows(position: Position, player: Player): boolean {
  const homeRows = getPlayerHomeRows(player);
  return homeRows.includes(position.y);
}