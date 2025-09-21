import { Position, Piece } from '../../types/game';
import { PieceMovementRule, ORTHOGONAL_DIRECTIONS } from '../movement/types';
import { MovementValidator } from '../movement/validator';

/**
 * Artillery Movement Rules (Tower's conversion form):
 * - Moves orthogonally (up, down, left, right) any distance
 * - Can perform "jump attacks": attack over pieces to hit targets behind them
 * - Regular moves cannot jump over pieces
 * - Jump attacks require exactly one piece to jump over
 */
export class ArtilleryMovement implements PieceMovementRule {
  calculateMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    
    // Regular orthogonal moves (like Tower)
    for (const direction of ORTHOGONAL_DIRECTIONS) {
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
          // If it's an enemy piece, we can capture it (regular capture)
          if (targetPiece.player !== piece.player) {
            moves.push(newPos);
          }
          // Can't move further in this direction
          break;
        }
        
        // Empty square, we can move here
        moves.push(newPos);
        distance++;
      }
    }
    
    // Add jump attack positions
    moves.push(...this.calculateJumpAttacks(piece, board));
    
    return moves;
  }

  calculateAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    const attacks: Position[] = [];
    
    // Regular attacks (from normal moves)
    const regularMoves = this.calculateMoves(piece, board);
    attacks.push(...regularMoves.filter(pos => 
      MovementValidator.hasEnemyPiece(pos, piece.player, board)
    ));
    
    return attacks;
  }

  /**
   * Calculate positions that can be attacked by jumping over pieces
   */
  calculateJumpAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    const jumpAttacks: Position[] = [];
    
    for (const direction of ORTHOGONAL_DIRECTIONS) {
      let distance = 1;
      let foundObstacle = false;
      
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
        
        if (!foundObstacle) {
          // Looking for the first obstacle to jump over
          if (targetPiece) {
            foundObstacle = true;
          }
        } else {
          // Found an obstacle, now looking for valid targets behind it
          if (targetPiece) {
            // If it's an enemy piece, we can jump-attack it
            if (targetPiece.player !== piece.player) {
              jumpAttacks.push(newPos);
            }
            // Stop searching in this direction after first target behind obstacle
            break;
          }
          // Continue searching for a target behind the obstacle
        }
        
        distance++;
        
        // Don't search too far
        if (distance > 7) break;
      }
    }
    
    return jumpAttacks;
  }

  isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Basic validation
    if (!MovementValidator.isBasicMoveValid(piece, from, to, board)) {
      return false;
    }
    
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    // Must be orthogonal move
    if (!((dx > 0 && dy === 0) || (dx === 0 && dy > 0))) {
      return false;
    }
    
    // Check if it's a regular move (path must be clear)
    if (MovementValidator.isPathClear(from, to, board)) {
      return true;
    }
    
    // Check if it's a valid jump attack
    return this.isValidJumpAttack(piece, from, to, board);
  }

  private isValidJumpAttack(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    // Must be attacking an enemy piece
    const targetPiece = board[to.y][to.x];
    if (!targetPiece || targetPiece.player === piece.player) {
      return false;
    }
    
    // Check if there's exactly one piece to jump over
    const stepX = Math.sign(to.x - from.x);
    const stepY = Math.sign(to.y - from.y);
    
    let distance = 1;
    let obstacleCount = 0;
    
    while (true) {
      const checkPos: Position = {
        x: from.x + (stepX * distance),
        y: from.y + (stepY * distance)
      };
      
      // Reached target
      if (checkPos.x === to.x && checkPos.y === to.y) {
        break;
      }
      
      if (board[checkPos.y][checkPos.x] !== null) {
        obstacleCount++;
      }
      
      distance++;
    }
    
    // Must have exactly one obstacle to jump over
    return obstacleCount === 1;
  }

  canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    // Artillery can capture via regular move or jump attack
    return this.isValidMove(piece, piece.position, target, board) &&
           MovementValidator.hasEnemyPiece(target, piece.player, board);
  }
}