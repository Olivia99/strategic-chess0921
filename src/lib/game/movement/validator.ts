import { Position, Piece, Player } from '../../types/game';
import { BOARD_SIZE } from '../board';

export class MovementValidator {
  /**
   * Check if a position is within the 7x7 board
   */
  static isWithinBounds(position: Position): boolean {
    return position.x >= 0 && position.x < BOARD_SIZE && 
           position.y >= 0 && position.y < BOARD_SIZE;
  }

  /**
   * Check if a position is empty on the board
   */
  static isEmpty(position: Position, board: (Piece | null)[][]): boolean {
    if (!this.isWithinBounds(position)) return false;
    return board[position.y][position.x] === null;
  }

  /**
   * Get the piece at a specific position
   */
  static getPieceAt(position: Position, board: (Piece | null)[][]): Piece | null {
    if (!this.isWithinBounds(position)) return null;
    return board[position.y][position.x];
  }

  /**
   * Check if a position has an enemy piece
   */
  static hasEnemyPiece(position: Position, player: Player, board: (Piece | null)[][]): boolean {
    const piece = this.getPieceAt(position, board);
    return piece !== null && piece.player !== player;
  }

  /**
   * Check if a position has a friendly piece
   */
  static hasFriendlyPiece(position: Position, player: Player, board: (Piece | null)[][]): boolean {
    const piece = this.getPieceAt(position, board);
    return piece !== null && piece.player === player;
  }

  /**
   * Check if a path from one position to another is clear (no pieces blocking)
   */
  static isPathClear(from: Position, to: Position, board: (Piece | null)[][]): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Calculate step direction
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
    
    // Check each position along the path (excluding start and end)
    let currentX = from.x + stepX;
    let currentY = from.y + stepY;
    
    while (currentX !== to.x || currentY !== to.y) {
      if (!this.isEmpty({ x: currentX, y: currentY }, board)) {
        return false; // Path is blocked
      }
      currentX += stepX;
      currentY += stepY;
    }
    
    return true;
  }

  /**
   * Check if a move is valid for any piece (basic validation)
   */
  static isBasicMoveValid(
    piece: Piece, 
    from: Position, 
    to: Position, 
    board: (Piece | null)[][]
  ): boolean {
    // Can't move to same position
    if (from.x === to.x && from.y === to.y) return false;
    
    // Target must be within bounds
    if (!this.isWithinBounds(to)) return false;
    
    // Can't move to a square occupied by friendly piece
    if (this.hasFriendlyPiece(to, piece.player, board)) return false;
    
    return true;
  }

  /**
   * Check if a position is in the player's home rows
   */
  static isInHomeRows(position: Position, player: Player): boolean {
    if (player === 'white') {
      return position.y >= 4; // Rows 5, 6, 7 (0-indexed: 4, 5, 6)
    } else {
      return position.y <= 2; // Rows 1, 2, 3 (0-indexed: 0, 1, 2)
    }
  }

  /**
   * Check if a position is in the middle row (row 4, 0-indexed: y=3)
   */
  static isInMiddleRow(position: Position): boolean {
    return position.y === 3;
  }

  /**
   * Get the forward direction for a player
   */
  static getForwardDirection(player: Player): number {
    return player === 'white' ? -1 : 1; // White moves up (decreasing y), Black moves down (increasing y)
  }
}