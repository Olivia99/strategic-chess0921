import { Position, Piece } from '../../types/game';
import { PieceMovementRule, DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Horse Movement Rules:
 * - Moves in L-shape: 2 squares in one direction, 1 square perpendicular
 * - Can jump over other pieces
 * - Can capture enemy pieces at the destination
 */
export class HorseMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // Check all 8 possible L-shaped moves
    for (const horseMove of DIRECTIONS.HORSE_MOVES) {
      const newPos: Position = {
        x: piece.position.x + horseMove.dx,
        y: piece.position.y + horseMove.dy
      };
      
      // Check if move is valid (Horse can jump over pieces, so no path checking needed)
      if (MovementValidator.isBasicMoveValid(piece, piece.position, newPos, board)) {
        moves.push(newPos);
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    // Horse attacks are the same as moves, but only positions with enemy pieces
    return this.calculateMoves(piece, board).filter(pos => 
      MovementValidator.hasEnemyPiece(pos, piece.player, board)
    );
  }

  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Basic validation
    if (!MovementValidator.isBasicMoveValid(piece, from, to, board)) {
      return false;
    }
    
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    // Must be L-shaped: (2,1) or (1,2)
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Horse can capture if it can move there and there's an enemy piece
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }
}