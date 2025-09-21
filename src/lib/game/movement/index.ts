import { PieceType, Piece, Position, Player } from '../../types/game';
import { PieceMovementRule } from './types';
import { CommanderMovement } from '../pieces/commander';
import { TowerMovement } from '../pieces/tower';
import { SoldierMovement } from '../pieces/soldier';
import { HorseMovement } from '../pieces/horse';
import { GuardMovement } from '../pieces/guard';
import { RaiderMovement } from '../pieces/raider';
import { ElephantMovement } from '../pieces/elephant';
import { ArtilleryMovement } from '../pieces/artillery';
import { TrophyScoring } from '../scoring';

export type MoveErrorType = 
  | 'invalid_move'
  | 'no_piece'
  | 'guard_invincible'
  | 'general_error';

export interface MoveError {
  type: MoveErrorType;
  message: string;
  details?: {
    guardPosition?: Position;
    guardPlayer?: Player;
    pieceType?: PieceType;
  };
}

/**
 * Movement System Manager
 * Handles all piece movement logic for the Strategic Chess game
 */
export class MovementSystem {
  private static movementRules: Map<PieceType, PieceMovementRule> = new Map([
    ['commander', new CommanderMovement()],
    ['tower', new TowerMovement()],
    ['soldier', new SoldierMovement()],
    ['horse', new HorseMovement()],
    ['guard', new GuardMovement()],
    ['raider', new RaiderMovement()],
    ['elephant', new ElephantMovement()],
    ['artillery', new ArtilleryMovement()]
  ]);

  /**
   * Get all possible moves for a piece
   */
  static getPossibleMoves(piece: Piece, board: (Piece | null)[][]): Position[] {
    const rule = this.movementRules.get(piece.type);
    if (!rule) {
      throw new Error(`No movement rule found for piece type: ${piece.type}`);
    }
    return rule.calculateMoves(piece, board);
  }

  /**
   * Get all possible attacks for a piece
   */
  static getPossibleAttacks(piece: Piece, board: (Piece | null)[][]): Position[] {
    const rule = this.movementRules.get(piece.type);
    if (!rule) {
      throw new Error(`No movement rule found for piece type: ${piece.type}`);
    }
    return rule.calculateAttacks(piece, board);
  }

  /**
   * Check if a move is valid for a piece
   */
  static isValidMove(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): boolean {
    const rule = this.movementRules.get(piece.type);
    if (!rule) {
      throw new Error(`No movement rule found for piece type: ${piece.type}`);
    }
    return rule.isValidMove(piece, from, to, board);
  }

  /**
   * Check if a piece can capture at a target position
   */
  static canCapture(piece: Piece, target: Position, board: (Piece | null)[][]): boolean {
    const rule = this.movementRules.get(piece.type);
    if (!rule) {
      throw new Error(`No movement rule found for piece type: ${piece.type}`);
    }
    return rule.canCapture(piece, target, board);
  }

  /**
   * Execute a move on the board
   */
  static executeMove(
    board: (Piece | null)[][],
    from: Position,
    to: Position
  ): {
    success: boolean;
    capturedPiece?: Piece;
    trophyPoints?: number;
    error?: MoveError;
  } {
    const piece = board[from.y][from.x];
    
    if (!piece) {
      return { 
        success: false, 
        error: {
          type: 'no_piece',
          message: 'No piece at source position'
        }
      };
    }

    if (!this.isValidMove(piece, from, to, board)) {
      return { 
        success: false, 
        error: {
          type: 'invalid_move',
          message: 'Invalid move for this piece type'
        }
      };
    }

    // Check for capture and calculate Trophy points
    const capturedPiece = board[to.y][to.x];
    let trophyPoints = 0;
    
    if (capturedPiece) {
      // Check if Guard is invincible before allowing capture
      if (capturedPiece.type === 'guard' && !this.canBeCaptured(capturedPiece)) {
        return { 
          success: false, 
          error: {
            type: 'guard_invincible',
            message: 'Cannot capture invincible Guard in home rows',
            details: {
              guardPosition: capturedPiece.position,
              guardPlayer: capturedPiece.player,
              pieceType: capturedPiece.type
            }
          }
        };
      }
      
      trophyPoints = TrophyScoring.getCapturePoints(capturedPiece);
    }

    // Execute the move
    board[to.y][to.x] = { ...piece, position: to };
    board[from.y][from.x] = null;

    return {
      success: true,
      capturedPiece: capturedPiece || undefined,
      trophyPoints
    };
  }

  /**
   * Check if a piece can be captured (considering special rules like Guard invincibility)
   */
  static canBeCaptured(piece: Piece): boolean {
    // Guards are invincible in home rows
    if (piece.type === 'guard') {
      const guardRule = this.movementRules.get('guard') as GuardMovement;
      return !guardRule.isInvincible(piece);
    }
    
    return true;
  }
}