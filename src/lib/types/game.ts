export type PieceType = 
  | 'commander' 
  | 'soldier' 
  | 'guard' 
  | 'raider' 
  | 'horse' 
  | 'elephant' 
  | 'tower' 
  | 'artillery';

export type Player = 'white' | 'black';

export type Position = {
  x: number;
  y: number;
};

export type Piece = {
  id: string;
  type: PieceType;
  player: Player;
  position: Position;
  hasMoved: boolean;
};

export type HeroType = 
  | 'alexander' 
  | 'genghis' 
  | 'napoleon' 
  | 'washington' 
  | 'anne' 
  | 'che';

export type AbilityType = 'passive' | 'active';

export type Ability = {
  id: string;
  name: string;
  type: AbilityType;
  cooldown: number;
  currentCooldown: number;
  description: string;
  unlockTrophies?: number;
};

export type Hero = {
  type: HeroType;
  name: string;
  passiveAbility: Ability;
  activeAbilities: Ability[];
  unlockedAbilities: string[];
};

export type VictoryType = 'commander' | 'trophy' | null;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ConversionState = {};

export type GameState = {
  board: (Piece | null)[][];
  currentPlayer: Player;
  trophyPoints: {
    white: number;
    black: number;
  };
  selectedPiece: Piece | null;
  possibleMoves: Position[];
  gamePhase: 'setup' | 'heroSelection' | 'playing' | 'gameOver';
  winner: Player | null;
  victoryType: VictoryType;
  turnCount: number;
  players: {
    white: {
      hero: Hero | null;
    };
    black: {
      hero: Hero | null;
    };
  };
  conversionState: ConversionState;
};

export type GameAction = 
  | { type: 'SELECT_PIECE'; payload: { piece: Piece } }
  | { type: 'MOVE_PIECE'; payload: { from: Position; to: Position } }
  | { type: 'SELECT_HERO'; payload: { player: Player; hero: HeroType } }
  | { type: 'USE_ABILITY'; payload: { abilityId: string; targetPosition?: Position } }
  | { type: 'CONVERT_PIECE'; payload: { pieceId: string; newType: PieceType } }
  | { type: 'END_TURN' }
  | { type: 'RESET_GAME' };

export type MoveResult = {
  success: boolean;
  capturedPiece?: Piece;
  trophyPointsGained: number;
  isCheckmate: boolean;
  error?: string;
};