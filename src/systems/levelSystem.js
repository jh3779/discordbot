export function applyExperienceAndLevel(character, expGained) {
  let level = character.level;
  let exp = character.exp + expGained;
  let maxHp = character.max_hp;
  let attack = character.attack;
  let defense = character.defense;
  let leveledUp = 0;

  while (exp >= level * 100) {
    exp -= level * 100;
    level += 1;
    maxHp += 10;
    attack += 2;
    defense += 1;
    leveledUp += 1;
  }

  const hp = leveledUp > 0 ? maxHp : character.hp;
  return { level, exp, maxHp, attack, defense, hp, leveledUp };
}
