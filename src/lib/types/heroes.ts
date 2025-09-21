import { HeroType, Ability } from './game';

export const HEROES: Record<HeroType, {
  name: string;
  passiveAbility: Omit<Ability, 'currentCooldown'>;
  activeAbilities: Omit<Ability, 'currentCooldown'>[];
}> = {
  alexander: {
    name: 'Alexander the Great',
    passiveAbility: {
      id: 'king_of_macedonia',
      name: 'King of Macedonia',
      type: 'passive',
      cooldown: 0,
      description: 'Start game with 3 Trophies'
    },
    activeAbilities: [
      {
        id: 'companion_cavalry',
        name: 'Companion Cavalry',
        type: 'active',
        cooldown: 4,
        description: 'Commander can make a Horse/Elephant move at a turn',
        unlockTrophies: 4
      },
      {
        id: 'phalanx',
        name: 'Phalanx',
        type: 'active',
        cooldown: 5,
        description: 'Upgrade a Soldier after moving it: move/attack any block forward; move 1 block backward; move sideways 1 block on neutral or home 3 rows',
        unlockTrophies: 7
      },
      {
        id: 'hammer_and_anvil',
        name: 'Hammer and Anvil',
        type: 'active',
        cooldown: 4,
        description: 'Move a piece from the home 1st row to an empty spot on the row of your most upfront piece',
        unlockTrophies: 10
      }
    ]
  },
  genghis: {
    name: 'Genghis Khan',
    passiveAbility: {
      id: 'horsemanship',
      name: 'Horsemanship',
      type: 'passive',
      cooldown: 0,
      description: 'Horse/Elephant attacks a piece on passing; Horse/Elephant gains 1 extra Trophy on attack'
    },
    activeAbilities: [
      {
        id: 'herdering',
        name: 'Herdering',
        type: 'active',
        cooldown: 5,
        description: 'Soldier can convert to Horse after an attack',
        unlockTrophies: 4
      },
      {
        id: 'nomady',
        name: 'Nomady',
        type: 'active',
        cooldown: 4,
        description: 'Horse/Elephant can convert and then move at the same turn; this move prevents attacking on passing',
        unlockTrophies: 7
      },
      {
        id: 'crouching',
        name: 'Crouching',
        type: 'active',
        cooldown: 6,
        description: 'Commander can turn hidden after a move for 1 turn; King can not attack while being hidden',
        unlockTrophies: 10
      }
    ]
  },
  napoleon: {
    name: 'Napoleon Bonaparte',
    passiveAbility: {
      id: 'battle_of_waterloo',
      name: 'Battle of Waterloo',
      type: 'passive',
      cooldown: 0,
      description: 'Gain a Pin every time you are checkmated; Respawn a defeated piece (Soldier: 3 Pins; All others: 5 Pins) at an empty spot on a home 3 rows for a move'
    },
    activeAbilities: [
      {
        id: 'forced_march',
        name: 'Forced March',
        type: 'active',
        cooldown: 3,
        description: 'Soldier can move and attack with 1 extra block forward on its first move',
        unlockTrophies: 4
      },
      {
        id: 'gribeauval_canon',
        name: 'Gribeauval Canon',
        type: 'active',
        cooldown: 4,
        description: 'Artillery can move any block diagonally; Artillery gains 1 extra Trophy on a diagonal attack',
        unlockTrophies: 7
      },
      {
        id: 'old_guard',
        name: 'Old Guard',
        type: 'active',
        cooldown: 5,
        description: 'Upgrade a Guard after moving it: gain invincibility when it\'s 1 block away from its Commander',
        unlockTrophies: 10
      }
    ]
  },
  washington: {
    name: 'George Washington',
    passiveAbility: {
      id: 'founding_father',
      name: 'Founding Father',
      type: 'passive',
      cooldown: 0,
      description: 'Commander can convert to President and reverse for a step: as Commander: gain 1 extra Trophy on attack; as President: move any number of pieces 1 block away from President at a turn; President does not move'
    },
    activeAbilities: [
      {
        id: 'battle_of_trenton',
        name: 'Battle of Trenton',
        type: 'active',
        cooldown: 4,
        description: 'Raider can move any block sideways at the opposite bottom 2 rows',
        unlockTrophies: 4
      },
      {
        id: 'battle_of_monmouth',
        name: 'Battle of Monmouth',
        type: 'active',
        cooldown: 4,
        description: 'Move a piece to an empty spot 1 block away from Commander/President, if it is not on the home 2 rows',
        unlockTrophies: 7
      },
      {
        id: 'valley_forge',
        name: 'Valley Forge Winter Encampment',
        type: 'active',
        cooldown: 6,
        description: 'Upgrade a non-Commander piece after moving it to the home 1st row: move in both forms',
        unlockTrophies: 10
      }
    ]
  },
  anne: {
    name: 'Anne Bonny',
    passiveAbility: {
      id: 'seamanship',
      name: 'Seamanship',
      type: 'passive',
      cooldown: 0,
      description: 'Your Tower/Artillery is Ship: Ship can only move along grid by itself; it boards a non-Commander/Ship piece on its moving path. A boarded ship can attack in the way of Tower, or sacrifice the boarded piece to attack along grid in the way of Artillery, keeping Ship at same position'
    },
    activeAbilities: [
      {
        id: 'mary_read',
        name: 'Mary Read',
        type: 'active',
        cooldown: 5,
        description: 'Commander can swap position with a Guard/Raider',
        unlockTrophies: 4
      },
      {
        id: 'piracy',
        name: 'Piracy',
        type: 'active',
        cooldown: 6,
        description: 'Remove 1 Trophy from opponent after an attack',
        unlockTrophies: 7
      },
      {
        id: 'bounty',
        name: 'Bounty',
        type: 'active',
        cooldown: 5,
        description: 'After making a move, mark an opposite piece that offers 1 extra Trophy at defeat',
        unlockTrophies: 10
      }
    ]
  },
  che: {
    name: 'Che Guevara',
    passiveAbility: {
      id: 'revolutionist',
      name: 'Revolutionist',
      type: 'passive',
      cooldown: 0,
      description: 'Place a Free Mark on spot where an opposite piece is defeated; maximum 4 Free Marks on map - replace an existing Free Mark when placing a new Free Mark. When an opposite piece step onto a Free Mark, you can choose to reduce 1 CD'
    },
    activeAbilities: [
      {
        id: 'guerrilla_warfare',
        name: 'Guerrilla Warfare',
        type: 'active',
        cooldown: 4,
        description: 'Move Soldier to its previous spot after making an attack',
        unlockTrophies: 4
      },
      {
        id: 'motorcycle_diaries',
        name: 'The Motorcycle Diaries',
        type: 'active',
        cooldown: 5,
        description: 'Soldier/Guard/Raider can move along grid to a Free Mark, attacking pieces on path',
        unlockTrophies: 7
      },
      {
        id: 'internationalism',
        name: 'Internationalism',
        type: 'active',
        cooldown: 5,
        description: 'Commander can move and attack to a Free Mark on map',
        unlockTrophies: 10
      }
    ]
  }
};