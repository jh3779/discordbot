const TIER_MULTIPLIER = { normal: 1.0, rare: 1.25, boss: 1.6 };

function clampMinOne(value) {
  return Math.max(1, Math.floor(value));
}

function scaleMonster(monster, playerLevel) {
  const levelBand = Math.max(0, Math.floor((playerLevel - 1) / 5));
  const levelMultiplier = 1 + levelBand * 0.15;
  const tierMultiplier = TIER_MULTIPLIER[monster.tier] ?? 1;
  const m = levelMultiplier * tierMultiplier;

  return {
    ...monster,
    hp: Math.max(1, Math.floor(monster.hp * m)),
    attack: Math.max(1, Math.floor(monster.attack * m)),
    defense: Math.max(0, Math.floor(monster.defense * m)),
    exp: Math.max(1, Math.floor(monster.exp * (1 + (m - 1) * 0.7))),
    goldMin: Math.max(1, Math.floor(monster.goldMin * (1 + (m - 1) * 0.5))),
    goldMax: Math.max(1, Math.floor(monster.goldMax * (1 + (m - 1) * 0.5)))
  };
}

export function runAutoBattle(player, baseMonster, rand = Math.random) {
  const monster = scaleMonster(baseMonster, player.level);
  let playerHp = player.hp;
  let monsterHp = monster.hp;
  const logs = [];

  for (let turn = 1; turn <= 20; turn += 1) {
    const playerDamage = clampMinOne(player.attack - monster.defense);
    monsterHp -= playerDamage;
    logs.push(`${turn}턴 ${player.name}의 공격 ${playerDamage} 피해`);
    if (monsterHp <= 0) {
      const gold = monster.goldMin + Math.floor(rand() * (monster.goldMax - monster.goldMin + 1));
      const dropItemCode = monster.dropItemCode && rand() < (monster.dropRate ?? 0) ? monster.dropItemCode : null;
      return { result: 'win', turns: turn, playerHp, monster: { ...monster, hp: monsterHp }, logs, rewards: { exp: monster.exp, gold }, dropItemCode };
    }

    const monsterDamage = clampMinOne(monster.attack - player.defense);
    playerHp -= monsterDamage;
    logs.push(`${turn}턴 ${monster.name}의 반격 ${monsterDamage} 피해`);
    if (playerHp <= 0) {
      return { result: 'lose', turns: turn, playerHp: 1, monster: { ...monster, hp: monsterHp }, logs, rewards: { exp: 0, gold: 0 }, dropItemCode: null };
    }
  }

  return { result: 'draw', turns: 20, playerHp, monster: { ...monster, hp: monsterHp }, logs, rewards: { exp: 0, gold: 0 }, dropItemCode: null };
}
