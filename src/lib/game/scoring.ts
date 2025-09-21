import { Piece, PieceType, Player, Position } from '../types/game';

/**
 * Trophy Points Scoring System
 * Based on CLADU.md specifications
 */
export class TrophyScoring {
  
  /**
   * Get Trophy points awarded for capturing a piece
   */
  static getCapturePoints(capturedPiece: Piece): number {
    const basePoints = this.getBasePiecePoints(capturedPiece.type);
    
    // Special bonus for Elephant pieces (when they exist)
    if (capturedPiece.type === 'elephant') {
      return basePoints + 1; // +1 bonus for Elephant
    }
    
    return basePoints;
  }

  /**
   * Base Trophy points for each piece type
   */
  static getBasePiecePoints(pieceType: PieceType): number {
    switch (pieceType) {
      case 'soldier':
        return 1;
      case 'commander':
      case 'guard':
      case 'horse':
      case 'tower':
        return 2;
      case 'elephant':
        return 2; // Base 2 + bonus 1 = 3 total when captured
      case 'raider':
      case 'artillery':
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Check if a position is a special control point (4B, 4D, 4F)
   */
  static isSpecialPosition(position: Position): boolean {
    const specialPositions = [
      { x: 1, y: 3 }, // 4B
      { x: 3, y: 3 }, // 4D  
      { x: 5, y: 3 }  // 4F
    ];
    
    return specialPositions.some(pos => 
      pos.x === position.x && pos.y === position.y
    );
  }

  /**
   * Get bonus points for controlling special positions
   * This would be calculated at end of turn
   */
  static getSpecialPositionBonus(
    board: (Piece | null)[][],
    player: Player
  ): number {
    let bonus = 0;
    const specialPositions = [
      { x: 1, y: 3 }, // 4B
      { x: 3, y: 3 }, // 4D
      { x: 5, y: 3 }  // 4F
    ];

    for (const pos of specialPositions) {
      const piece = board[pos.y][pos.x];
      if (piece && piece.player === player) {
        bonus += 1; // +1 point per controlled special position
      }
    }

    return bonus;
  }

  /**
   * Check if a player has reached the Trophy victory condition
   */
  static hasReachedTrophyVictory(trophyPoints: number): boolean {
    return trophyPoints >= 21;
  }

  /**
   * Calculate total Trophy points for a player
   */
  static calculateTotalPoints(
    baseTrophyPoints: number,
    board: (Piece | null)[][],
    player: Player
  ): number {
    const specialBonus = this.getSpecialPositionBonus(board, player);
    return baseTrophyPoints + specialBonus;
  }

  /**
   * Get scoring summary for display
   */
  static getScoringInfo(pieceType: PieceType): string {
    const points = this.getBasePiecePoints(pieceType);
    if (pieceType === 'elephant') {
      return `${points} + 1 bonus = ${points + 1} Trophy Points`;
    }
    return `${points} Trophy Point${points > 1 ? 's' : ''}`;
  }
}