import { Position, Piece } from '../../types/game';
import { PieceMovementRule, ORTHOGONAL_DIRECTIONS, DIAGONAL_DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Raider Movement Rules (Guard's conversion form):
 * - Moves 1 space orthogonally (up, down, left, right)
 * - Moves any distance diagonally (like a bishop)
 * - Cannot move through other pieces on diagonal paths
 * - Can capture enemy pieces
 * - No invincibility (unlike Guard)
 */
export class RaiderMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // 1. Orthogonal moves (1 space only)
    for (const direction of ORTHOGONAL_DIRECTIONS) {
      const newPos: Position = {
        x: piece.position.x + direction.dx,
        y: piece.position.y + direction.dy
      };
      
      if (MovementValidator.isBasicMoveValid(piece, piece.position, newPos, board)) {
        moves.push(newPos);
      }
    }
    
    // 2. Diagonal moves (any distance)
    for (const direction of DIAGONAL_DIRECTIONS) {
      let distance = 1;
      while (true) {
        const newPos: Position = {
          x: piece.position.x + (direction.dx * distance),
          y: piece.position.y + (direction.dy * distance)
        };
        
        // Check bounds
        if (!MovementValidator.isWithinBounds(newPos)) {
          break;
        }
        
        const targetPiece = board[newPos.y][newPos.x];
        
        // If there's a piece at this position
        if (targetPiece) {
          // If it's an enemy piece, we can capture it
          if (targetPiece.player !== piece.player) {
            moves.push(newPos);
          }
          // Either way, we can't move further in this direction
          break;
        }
        
        // Empty square, we can move here
        moves.push(newPos);
        distance++;
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    // Raider attacks are the same as moves, but only positions with enemy pieces
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
    
    // Orthogonal move (1 space)
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      return true;
    }
    
    // Diagonal move (any distance)
    if (dx === dy && dx > 0) {
      // Check if path is clear
      return MovementValidator.isPathClear(from, to, board);
    }
    
    return false;
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Raider can capture if it can move there and there's an enemy piece
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }
}