import { Position, Piece } from '../../types/game';

export interface MoveResult {
  isValid: boolean;
  capturedPiece?: Piece;
  error?: string;
}

export interface AttackResult {
  canAttack: boolean;
  targetPiece?: Piece;
}

export interface MovementRange {
  moves: Position[];
  attacks: Position[];
}

export interface PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[];
  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[];
  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean;
  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean;
}

export interface MovementDirection {
  dx: number;
  dy: number;
}

// Common movement directions
export const DIRECTIONS = {
  // Orthogonal (straight lines)
  NORTH: { dx: 0, dy: -1 },
  SOUTH: { dx: 0, dy: 1 },
  EAST: { dx: 1, dy: 0 },
  WEST: { dx: -1, dy: 0 },
  
  // Diagonal
  NORTHEAST: { dx: 1, dy: -1 },
  NORTHWEST: { dx: -1, dy: -1 },
  SOUTHEAST: { dx: 1, dy: 1 },
  SOUTHWEST: { dx: -1, dy: 1 },
  
  // Horse L-shapes
  HORSE_MOVES: [
    { dx: 2, dy: 1 }, { dx: 2, dy: -1 },
    { dx: -2, dy: 1 }, { dx: -2, dy: -1 },
    { dx: 1, dy: 2 }, { dx: 1, dy: -2 },
    { dx: -1, dy: 2 }, { dx: -1, dy: -2 }
  ]
} as const;

export const ORTHOGONAL_DIRECTIONS = [
  DIRECTIONS.NORTH, DIRECTIONS.SOUTH, DIRECTIONS.EAST, DIRECTIONS.WEST
];

export const DIAGONAL_DIRECTIONS = [
  DIRECTIONS.NORTHEAST, DIRECTIONS.NORTHWEST, 
  DIRECTIONS.SOUTHEAST, DIRECTIONS.SOUTHWEST
];

export const ALL_DIRECTIONS = [
  ...ORTHOGONAL_DIRECTIONS, 
  ...DIAGONAL_DIRECTIONS
];