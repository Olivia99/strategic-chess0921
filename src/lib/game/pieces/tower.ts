import { Position, Piece } from '../../types/game';
import { PieceMovementRule, ORTHOGONAL_DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Tower Movement Rules:
 * - Moves any distance orthogonally (horizontal/vertical)
 * - Cannot jump over other pieces
 * - Can capture enemy pieces
 */
export class TowerMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // Check all 4 orthogonal directions
    for (const direction of ORTHOGONAL_DIRECTIONS) {
      let distance = 1;
      
      while (true) {
        const newPos: Position = {
          x: piece.position.x + direction.dx * distance,
          y: piece.position.y + direction.dy * distance
        };
        
        // Stop if out of bounds
        if (!MovementValidator.isWithinBounds(newPos)) {
          break;
        }
        
        // Stop if there's a friendly piece
        if (MovementValidator.hasFriendlyPiece(newPos, piece.player, board)) {
          break;
        }
        
        // Add this position as valid move
        moves.push(newPos);
        
        // Stop if there's an enemy piece (can capture but can't continue)
        if (MovementValidator.hasEnemyPiece(newPos, piece.player, board)) {
          break;
        }
        
        distance++;
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    // Tower attacks are the same as moves, but only positions with enemy pieces
    return this.calculateMoves(piece, board).filter(pos => 
      MovementValidator.hasEnemyPiece(pos, piece.player, board)
    );
  }

  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Basic validation
    if (!MovementValidator.isBasicMoveValid(piece, from, to, board)) {
      return false;
    }
    
    // Must be orthogonal movement (either same row or same column)
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    if (dx !== 0 && dy !== 0) {
      return false; // Not orthogonal
    }
    
    // Check if path is clear
    return MovementValidator.isPathClear(from, to, board);
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Tower can capture if it can move there and there's an enemy piece
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }
}