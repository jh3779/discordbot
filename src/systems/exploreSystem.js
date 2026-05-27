import { pickMonster } from '../data/monsters.js';
import { runAutoBattle } from './battleSystem.js';

export function resolveExplore(character, rand = Math.random) {
  const roll = rand();
  if (roll < 0.5) {
    const monster = pickMonster(rand);
    return { type: 'battle', battle: runAutoBattle(character, monster, rand) };
  }
  if (roll < 0.7) return { type: 'gold', gold: 10 + Math.floor(rand() * 21) };
  if (roll < 0.85) return { type: 'item', itemCode: 'potion_small', itemName: '회복약', quantity: 1 };
  if (roll < 0.95) return { type: 'heal', heal: 15 + Math.floor(rand() * 16) };
  return { type: 'special', exp: 30 };
}
