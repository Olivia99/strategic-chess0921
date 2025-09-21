import { Piece, PieceType, Player, Position } from '../types/game';

export const BOARD_SIZE = 7;

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  // White pieces (bottom - white pieces in image)
  const whitePieces: { type: PieceType; x: number; y: number }[] = [
    // Back row (y=6) - Tower, Horse, Guard, Commander, Guard, Horse, Tower
    { type: 'tower', x: 0, y: 6 },
    { type: 'horse', x: 1, y: 6 },
    { type: 'guard', x: 2, y: 6 },
    { type: 'commander', x: 3, y: 6 },
    { type: 'guard', x: 4, y: 6 },
    { type: 'horse', x: 5, y: 6 },
    { type: 'tower', x: 6, y: 6 },
    
    // Soldier row (y=5) - All soldiers
    { type: 'soldier', x: 0, y: 5 },
    { type: 'soldier', x: 1, y: 5 },
    { type: 'soldier', x: 2, y: 5 },
    { type: 'soldier', x: 3, y: 5 },
    { type: 'soldier', x: 4, y: 5 },
    { type: 'soldier', x: 5, y: 5 },
    { type: 'soldier', x: 6, y: 5 },
  ];

  // Black pieces (top - black pieces in image)
  const blackPieces: { type: PieceType; x: number; y: number }[] = [
    // Back row (y=0) - Tower, Horse, Guard, Commander, Guard, Horse, Tower
    { type: 'tower', x: 0, y: 0 },
    { type: 'horse', x: 1, y: 0 },
    { type: 'guard', x: 2, y: 0 },
    { type: 'commander', x: 3, y: 0 },
    { type: 'guard', x: 4, y: 0 },
    { type: 'horse', x: 5, y: 0 },
    { type: 'tower', x: 6, y: 0 },
    
    // Soldier row (y=1) - All soldiers
    { type: 'soldier', x: 0, y: 1 },
    { type: 'soldier', x: 1, y: 1 },
    { type: 'soldier', x: 2, y: 1 },
    { type: 'soldier', x: 3, y: 1 },
    { type: 'soldier', x: 4, y: 1 },
    { type: 'soldier', x: 5, y: 1 },
    { type: 'soldier', x: 6, y: 1 },
  ];

  // Place white pieces
  whitePieces.forEach((pieceData, index) => {
    board[pieceData.y][pieceData.x] = {
      id: `white-${index}`,
      type: pieceData.type,
      player: 'white',
      position: { x: pieceData.x, y: pieceData.y },
      hasMoved: false
    };
  });

  // Place black pieces
  blackPieces.forEach((pieceData, index) => {
    board[pieceData.y][pieceData.x] = {
      id: `black-${index}`,
      type: pieceData.type,
      player: 'black',
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
  return player === 'white' ? [4, 5, 6] : [0, 1, 2];
}

export function isInHomeRows(position: Position, player: Player): boolean {
  const homeRows = getPlayerHomeRows(player);
  return homeRows.includes(position.y);
}