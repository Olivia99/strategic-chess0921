import { Position, Piece } from '../../types/game';
import { PieceMovementRule, ALL_DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Commander Movement Rules:
 * - Moves 1 space in any direction (orthogonal or diagonal)
 * - Being captured results in defeat
 */
export class CommanderMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // Check all 8 directions (orthogonal + diagonal)
    for (const direction of ALL_DIRECTIONS) {
      const newPos: Position = {
        x: piece.position.x + direction.dx,
        y: piece.position.y + direction.dy
      };
      
      // Check if move is valid
      if (MovementValidator.isBasicMoveValid(piece, piece.position, newPos, board)) {
        moves.push(newPos);
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    // Commander attacks and moves are the same
    return this.calculateMoves(piece, board).filter(pos => 
      MovementValidator.hasEnemyPiece(pos, piece.player, board)
    );
  }

  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Basic validation
    if (!MovementValidator.isBasicMoveValid(piece, from, to, board)) {
      return false;
    }
    
    // Check if it's a 1-step move in any direction
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    // Must move exactly 1 step in at least one direction, max 1 step in both
    return (dx <= 1 && dy <= 1) && (dx + dy > 0);
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Commander can capture if it can move there and there's an enemy piece
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }
}