import { Piece, Player } from '../types/game';
import { TrophyScoring } from './scoring';

export type VictoryType = 'commander' | 'trophy' | null;

export interface VictoryResult {
  hasWon: boolean;
  winner: Player | null;
  victoryType: VictoryType;
  message: string;
}

/**
 * Victory Conditions System
 * Handles both victory conditions for Strategic Chess
 */
export class VictoryConditions {
  
  /**
   * Check all victory conditions and return result
   */
  static checkVictory(
    board: (Piece | null)[][],
    trophyPoints: { white: number; black: number },
    capturedPiece?: Piece
  ): VictoryResult {
    // Check Commander capture victory first (immediate win)
    if (capturedPiece && capturedPiece.type === 'commander') {
      const winner = capturedPiece.player === 'white' ? 'black' : 'white';
      return {
        hasWon: true,
        winner,
        victoryType: 'commander',
        message: `${winner.toUpperCase()} wins by capturing the enemy Commander!`
      };
    }

    // Check Trophy victory for both players
    const whiteTotalPoints = TrophyScoring.calculateTotalPoints(trophyPoints.white, board, 'white');
    const blackTotalPoints = TrophyScoring.calculateTotalPoints(trophyPoints.black, board, 'black');

    if (whiteTotalPoints >= 21) {
      return {
        hasWon: true,
        winner: 'white',
        victoryType: 'trophy',
        message: `WHITE wins with ${whiteTotalPoints} Trophy Points!`
      };
    }

    if (blackTotalPoints >= 21) {
      return {
        hasWon: true,
        winner: 'black',
        victoryType: 'trophy',
        message: `BLACK wins with ${blackTotalPoints} Trophy Points!`
      };
    }

    // No victory condition met
    return {
      hasWon: false,
      winner: null,
      victoryType: null,
      message: ''
    };
  }

  /**
   * Check if Commander capture would result in victory
   */
  static isCommanderCaptureVictory(capturedPiece?: Piece): boolean {
    return capturedPiece?.type === 'commander';
  }

  /**
   * Check if Trophy points would result in victory
   */
  static isTrophyVictory(trophyPoints: number): boolean {
    return TrophyScoring.hasReachedTrophyVictory(trophyPoints);
  }

  /**
   * Get victory condition descriptions for UI
   */
  static getVictoryConditionsText(): string[] {
    return [
      "🏆 Reach 21 Trophy Points",
      "⚔️ Capture the enemy Commander"
    ];
  }

  /**
   * Check if a player has any remaining Commanders on the board
   */
  static hasCommanderOnBoard(board: (Piece | null)[][], player: Player): boolean {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const piece = board[y][x];
        if (piece && piece.type === 'commander' && piece.player === player) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get detailed victory information for display
   */
  static getVictoryDetails(victoryResult: VictoryResult): {
    icon: string;
    title: string;
    description: string;
    color: string;
  } {
    if (!victoryResult.hasWon) {
      return {
        icon: '⚔️',
        title: 'Battle Continues',
        description: 'No victory condition met',
        color: 'gray'
      };
    }

    if (victoryResult.victoryType === 'commander') {
      return {
        icon: '👑',
        title: 'COMMANDER VICTORY!',
        description: 'Enemy Commander captured',
        color: 'red'
      };
    }

    return {
      icon: '🏆',
      title: 'TROPHY VICTORY!',
      description: '21 Trophy Points achieved',
      color: 'yellow'
    };
  }
}