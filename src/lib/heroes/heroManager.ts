import { Hero, HeroType, Player, Ability, GameState, Position, Piece } from '../types/game';
import { HEROES } from '../types/heroes';

export interface HeroGameState {
  heroes: {
    white: Hero | null;
    black: Hero | null;
  };
  freeMarks: Position[]; // For Che Guevara
  pins: {
    white: number;
    black: number;
  }; // For Napoleon
  bountyMarks: {
    position: Position;
    player: Player;
  }[]; // For Anne Bonny
}

export class HeroManager {
  /**
   * Create a Hero instance from HeroType
   */
  static createHero(heroType: HeroType): Hero {
    const heroData = HEROES[heroType];
    
    return {
      type: heroType,
      name: heroData.name,
      passiveAbility: {
        ...heroData.passiveAbility,
        currentCooldown: 0
      },
      activeAbilities: heroData.activeAbilities.map(ability => ({
        ...ability,
        currentCooldown: 0
      })),
      unlockedAbilities: [] // Abilities unlock based on Trophy points
    };
  }

  /**
   * Initialize hero game state
   */
  static initializeHeroGameState(whiteHero: HeroType | null, blackHero: HeroType | null): HeroGameState {
    return {
      heroes: {
        white: whiteHero ? this.createHero(whiteHero) : null,
        black: blackHero ? this.createHero(blackHero) : null
      },
      freeMarks: [],
      pins: { white: 0, black: 0 },
      bountyMarks: []
    };
  }

  /**
   * Update unlocked abilities based on Trophy points
   */
  static updateUnlockedAbilities(hero: Hero, trophyPoints: number): Hero {
    const unlockedAbilities = hero.activeAbilities
      .filter(ability => ability.unlockTrophies && trophyPoints >= ability.unlockTrophies)
      .map(ability => ability.id);

    return {
      ...hero,
      unlockedAbilities
    };
  }

  /**
   * Reduce cooldowns at the end of turn
   */
  static reduceCooldowns(hero: Hero): Hero {
    return {
      ...hero,
      activeAbilities: hero.activeAbilities.map(ability => ({
        ...ability,
        currentCooldown: Math.max(0, ability.currentCooldown - 1)
      }))
    };
  }

  /**
   * Activate an active ability
   */
  static activateAbility(hero: Hero, abilityId: string): Hero {
    const ability = hero.activeAbilities.find(a => a.id === abilityId);
    if (!ability) {
      throw new Error(`Ability ${abilityId} not found`);
    }

    if (ability.currentCooldown > 0) {
      throw new Error(`Ability ${abilityId} is on cooldown`);
    }

    if (!hero.unlockedAbilities.includes(abilityId)) {
      throw new Error(`Ability ${abilityId} is not unlocked`);
    }

    return {
      ...hero,
      activeAbilities: hero.activeAbilities.map(a =>
        a.id === abilityId
          ? { ...a, currentCooldown: a.cooldown }
          : a
      )
    };
  }

  /**
   * Apply Alexander's passive ability (start with 3 trophies)
   */
  static applyAlexanderPassive(gameState: GameState, player: Player): GameState {
    const hero = gameState.players[player].hero;
    if (!hero || hero.type !== 'alexander') {
      return gameState;
    }

    return {
      ...gameState,
      trophyPoints: {
        ...gameState.trophyPoints,
        [player]: gameState.trophyPoints[player] + 3
      }
    };
  }

  /**
   * Apply Genghis Khan's passive ability (Horse/Elephant gains extra trophy and attacks on passing)
   */
  static applyGenghisPassive(
    capturedPiece: Piece,
    attackingPiece: Piece,
    player: Player,
    heroGameState: HeroGameState
  ): number {
    const hero = heroGameState.heroes[player];
    if (!hero || hero.type !== 'genghis') {
      return 0;
    }

    // Extra trophy for Horse/Elephant attacks
    if (attackingPiece.type === 'horse' || attackingPiece.type === 'elephant') {
      return 1;
    }

    return 0;
  }

  /**
   * Apply Napoleon's passive ability (gain pins on checkmate)
   */
  static applyNapoleonPassive(player: Player, heroGameState: HeroGameState): HeroGameState {
    const hero = heroGameState.heroes[player];
    if (!hero || hero.type !== 'napoleon') {
      return heroGameState;
    }

    return {
      ...heroGameState,
      pins: {
        ...heroGameState.pins,
        [player]: heroGameState.pins[player] + 1
      }
    };
  }

  /**
   * Apply Che Guevara's passive ability (place free marks)
   */
  static applyChePassive(
    defeatPosition: Position,
    player: Player,
    heroGameState: HeroGameState
  ): HeroGameState {
    const hero = heroGameState.heroes[player];
    if (!hero || hero.type !== 'che') {
      return heroGameState;
    }

    let newFreeMarks = [...heroGameState.freeMarks];
    
    // Add new free mark
    newFreeMarks.push(defeatPosition);
    
    // Keep maximum 4 free marks (replace oldest if needed)
    if (newFreeMarks.length > 4) {
      newFreeMarks = newFreeMarks.slice(-4);
    }

    return {
      ...heroGameState,
      freeMarks: newFreeMarks
    };
  }

  /**
   * Check if a piece can be affected by Washington's passive (President form)
   */
  static canUseWashingtonPresidentMove(
    piece: Piece,
    presidentPosition: Position
  ): boolean {
    // Pieces can move if they are 1 block away from President
    const dx = Math.abs(piece.position.x - presidentPosition.x);
    const dy = Math.abs(piece.position.y - presidentPosition.y);
    
    return (dx <= 1 && dy <= 1) && (dx + dy > 0); // Adjacent including diagonal
  }

  /**
   * Check if a position has a free mark (for Che abilities)
   */
  static hasFreeMarkAt(position: Position, heroGameState: HeroGameState): boolean {
    return heroGameState.freeMarks.some(mark => 
      mark.x === position.x && mark.y === position.y
    );
  }

  /**
   * Reduce cooldown when stepping on free mark (Che's passive)
   */
  static stepOnFreeMark(player: Player, heroGameState: HeroGameState): Hero | null {
    const hero = heroGameState.heroes[player];
    if (!hero) return null;

    // Player can choose to reduce 1 CD of any ability
    const abilitiesOnCooldown = hero.activeAbilities.filter(a => a.currentCooldown > 0);
    
    if (abilitiesOnCooldown.length === 0) return hero;

    // For now, automatically reduce the ability with highest cooldown
    // In a real implementation, this would be a player choice
    const abilityToReduce = abilitiesOnCooldown.reduce((prev, current) => 
      prev.currentCooldown > current.currentCooldown ? prev : current
    );

    return {
      ...hero,
      activeAbilities: hero.activeAbilities.map(a =>
        a.id === abilityToReduce.id
          ? { ...a, currentCooldown: Math.max(0, a.currentCooldown - 1) }
          : a
      )
    };
  }

  /**
   * Get available abilities for a player
   */
  static getAvailableAbilities(hero: Hero): Ability[] {
    return hero.activeAbilities.filter(ability =>
      hero.unlockedAbilities.includes(ability.id) && ability.currentCooldown === 0
    );
  }

  /**
   * Check if hero has specific ability unlocked and ready
   */
  static canActivateAbility(hero: Hero, abilityId: string): boolean {
    const ability = hero.activeAbilities.find(a => a.id === abilityId);
    return !!(
      ability &&
      hero.unlockedAbilities.includes(abilityId) &&
      ability.currentCooldown === 0
    );
  }
}