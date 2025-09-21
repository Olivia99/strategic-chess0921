import { Piece, PieceType, GameState } from '../types/game';

export type ConversionPair = {
  from: PieceType;
  to: PieceType;
};

/**
 * Piece conversion pairs - pieces that can transform into each other
 */
export const CONVERSION_PAIRS: ConversionPair[] = [
  { from: 'guard', to: 'raider' },
  { from: 'raider', to: 'guard' },
  { from: 'horse', to: 'elephant' },
  { from: 'elephant', to: 'horse' },
  { from: 'tower', to: 'artillery' },
  { from: 'artillery', to: 'tower' },
];

/**
 * Conversion rules (simplified)
 */
export interface ConversionRule {
  description: string;
}

export const CONVERSION_RULES: Record<string, ConversionRule> = {
  'guard->raider': {
    description: 'Transform Guard into Raider: Gain diagonal movement, lose invincibility'
  },
  'raider->guard': {
    description: 'Transform Raider into Guard: Gain invincibility in home rows, lose diagonal movement'
  },
  'horse->elephant': {
    description: 'Transform Horse into Elephant: Gain +1 capture bonus, lose jumping ability'
  },
  'elephant->horse': {
    description: 'Transform Elephant into Horse: Gain jumping ability, lose capture bonus'
  },
  'tower->artillery': {
    description: 'Transform Tower into Artillery: Gain jump attacks, same movement'
  },
  'artillery->tower': {
    description: 'Transform Artillery into Tower: Lose jump attacks, same movement'
  },
};


export class PieceConversion {
  /**
   * Check if a piece can be converted
   */
  static canConvert(
    piece: Piece, 
    targetType: PieceType
  ): { canConvert: boolean; reason?: string } {
    // Check if this conversion pair exists
    const conversionKey = `${piece.type}->${targetType}`;
    const rule = CONVERSION_RULES[conversionKey];
    
    if (!rule) {
      return { canConvert: false, reason: 'Invalid conversion pair' };
    }
    
    return { canConvert: true };
  }

  /**
   * Get available conversion targets for a piece
   */
  static getConversionTargets(pieceType: PieceType): PieceType[] {
    return CONVERSION_PAIRS
      .filter(pair => pair.from === pieceType)
      .map(pair => pair.to);
  }

  /**
   * Get all pieces that can be converted by a player
   */
  static getConvertiblePieces(
    board: (Piece | null)[][],
    player: 'white' | 'black'
  ): Piece[] {
    const convertiblePieces: Piece[] = [];
    
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const piece = board[y][x];
        if (piece && piece.player === player) {
          const targets = this.getConversionTargets(piece.type);
          
          // If piece has conversion targets, it's convertible
          if (targets.length > 0) {
            convertiblePieces.push(piece);
          }
        }
      }
    }
    
    return convertiblePieces;
  }

  /**
   * Execute a piece conversion
   */
  static executePieceConversion(
    piece: Piece,
    targetType: PieceType,
    gameState: GameState
  ): { 
    success: boolean; 
    newGameState?: GameState;
    error?: string;
  } {
    // Validate conversion
    const validation = this.canConvert(piece, targetType);
    if (!validation.canConvert) {
      return { success: false, error: validation.reason };
    }
    
    // Create new piece with converted type
    const convertedPiece: Piece = {
      ...piece,
      type: targetType
    };
    
    // Update board
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[piece.position.y][piece.position.x] = convertedPiece;
    
    // Switch to next player (conversion ends turn)
    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    const nextTurnCount = gameState.currentPlayer === 'black' ? gameState.turnCount + 1 : gameState.turnCount;
    
    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: nextPlayer,
      turnCount: nextTurnCount,
      selectedPiece: null,
      possibleMoves: []
    };
    
    return {
      success: true,
      newGameState
    };
  }

}