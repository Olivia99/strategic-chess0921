import { Position, Piece } from '../../types/game';
import { PieceMovementRule, ALL_DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Elephant Movement Rules (Horse's conversion form):
 * - Moves 2 spaces in any direction (orthogonal or diagonal)
 * - Cannot jump over pieces (unlike Horse)
 * - Can capture enemy pieces
 * - Bonus: Capturing with Elephant grants +1 Trophy Point
 */
export class ElephantMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // Check all 8 directions, moving exactly 2 spaces
    for (const direction of ALL_DIRECTIONS) {
      const newPos: Position = {
        x: piece.position.x + (direction.dx * 2),
        y: piece.position.y + (direction.dy * 2)
      };
      
      // Check bounds
      if (!MovementValidator.isWithinBounds(newPos)) {
        continue;
      }
      
      // Check if path is clear (must pass through intermediate square)
      const intermediatePos: Position = {
        x: piece.position.x + direction.dx,
        y: piece.position.y + direction.dy
      };
      
      // Path must be clear (no piece in the way)
      if (board[intermediatePos.y][intermediatePos.x] !== null) {
        continue;
      }
      
      // Check if destination is valid
      if (MovementValidator.isBasicMoveValid(piece, piece.position, newPos, board)) {
        moves.push(newPos);
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    // Elephant attacks are the same as moves, but only positions with enemy pieces
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
    
    // Must move exactly 2 spaces in any direction
    if (!((dx === 2 && dy === 0) || (dx === 0 && dy === 2) || (dx === 2 && dy === 2))) {
      return false;
    }
    
    // Check if path is clear
    const stepX = Math.sign(to.x - from.x);
    const stepY = Math.sign(to.y - from.y);
    const intermediatePos: Position = {
      x: from.x + stepX,
      y: from.y + stepY
    };
    
    // Intermediate square must be empty
    return board[intermediatePos.y][intermediatePos.x] === null;
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Elephant can capture if it can move there and there's an enemy piece
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }

  /**
   * Elephant captures grant +1 bonus Trophy Point
   */
  getCaptureBonus(): number {
    return 1;
  }
}