import { Position, Piece } from '../../types/game';
import { PieceMovementRule } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Soldier Movement Rules:
 * - Moves forward 1 space
 * - Attacks diagonally forward 1 space
 * - Special: Can move sideways 1 space when in the middle row (row 4)
 */
export class SoldierMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const forward = MovementValidator.getForwardDirection(piece.player);
    
    // 1. Forward movement (non-capturing)
    const forwardPos: Position = {
      x: piece.position.x,
      y: piece.position.y + forward
    };
    
    if (MovementValidator.isWithinBounds(forwardPos) && 
        MovementValidator.isEmpty(forwardPos, board)) {
      moves.push(forwardPos);
    }
    
    // 2. Diagonal attacks
    const diagonalAttacks = [
      { x: piece.position.x - 1, y: piece.position.y + forward },
      { x: piece.position.x + 1, y: piece.position.y + forward }
    ];
    
    for (const attackPos of diagonalAttacks) {
      if (MovementValidator.isWithinBounds(attackPos) &&
          MovementValidator.hasEnemyPiece(attackPos, piece.player, board)) {
        moves.push(attackPos);
      }
    }
    
    // 3. Special sideways movement in middle row
    if (MovementValidator.isInMiddleRow(piece.position)) {
      const sidewaysMoves = [
        { x: piece.position.x - 1, y: piece.position.y },
        { x: piece.position.x + 1, y: piece.position.y }
      ];
      
      for (const sidePos of sidewaysMoves) {
        if (MovementValidator.isBasicMoveValid(piece, piece.position, sidePos, board)) {
          moves.push(sidePos);
        }
      }
    }
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    const attacks: Position[] = [];
    const forward = MovementValidator.getForwardDirection(piece.player);
    
    // Diagonal attacks
    const diagonalAttacks = [
      { x: piece.position.x - 1, y: piece.position.y + forward },
      { x: piece.position.x + 1, y: piece.position.y + forward }
    ];
    
    for (const attackPos of diagonalAttacks) {
      if (MovementValidator.isWithinBounds(attackPos) &&
          MovementValidator.hasEnemyPiece(attackPos, piece.player, board)) {
        attacks.push(attackPos);
      }
    }
    
    // Sideways attacks in middle row
    if (MovementValidator.isInMiddleRow(piece.position)) {
      const sidewaysAttacks = [
        { x: piece.position.x - 1, y: piece.position.y },
        { x: piece.position.x + 1, y: piece.position.y }
      ];
      
      for (const attackPos of sidewaysAttacks) {
        if (MovementValidator.isWithinBounds(attackPos) &&
            MovementValidator.hasEnemyPiece(attackPos, piece.player, board)) {
          attacks.push(attackPos);
        }
      }
    }
    
    return attacks;
  }

  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Basic validation
    if (!MovementValidator.isBasicMoveValid(piece, from, to, board)) {
      return false;
    }
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const forward = MovementValidator.getForwardDirection(piece.player);
    
    // Forward movement (non-capturing)
    if (dx === 0 && dy === forward) {
      return MovementValidator.isEmpty(to, board);
    }
    
    // Diagonal attack
    if (Math.abs(dx) === 1 && dy === forward) {
      return MovementValidator.hasEnemyPiece(to, piece.player, board);
    }
    
    // Sideways movement in middle row
    if (MovementValidator.isInMiddleRow(from) && Math.abs(dx) === 1 && dy === 0) {
      return true; // Either capture or move
    }
    
    return false;
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    if (!MovementValidator.hasEnemyPiece(target, piece.player, board)) {
      return false;
    }
    
    const dx = target.x - piece.position.x;
    const dy = target.y - piece.position.y;
    const forward = MovementValidator.getForwardDirection(piece.player);
    
    // Diagonal capture
    if (Math.abs(dx) === 1 && dy === forward) {
      return true;
    }
    
    // Sideways capture in middle row
    if (MovementValidator.isInMiddleRow(piece.position) && 
        Math.abs(dx) === 1 && dy === 0) {
      return true;
    }
    
    return false;
  }
}