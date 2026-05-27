export const MONSTERS = [
  { key: 'robot_guard', name: '오류 포졸 로봇', tier: 'normal', hp: 35, attack: 7, defense: 1, exp: 14, goldMin: 8, goldMax: 12, dropItemCode: 'old_parts', dropRate: 0.35 },
  { key: 'scout_drone', name: '망가진 정찰 드론', tier: 'normal', hp: 25, attack: 9, defense: 0, exp: 12, goldMin: 6, goldMax: 10, dropItemCode: 'old_parts', dropRate: 0.2 },
  { key: 'record_watcher', name: '금지 기록 감시자', tier: 'rare', hp: 55, attack: 12, defense: 3, exp: 28, goldMin: 15, goldMax: 25, dropItemCode: 'broken_badge', dropRate: 0.25 },
  { key: 'ruin_warrior', name: '폐허의 무관', tier: 'boss', hp: 90, attack: 16, defense: 5, exp: 60, goldMin: 40, goldMax: 70, dropItemCode: 'old_sabre', dropRate: 0.5 }
];

export function pickMonster(rand = Math.random) {
  const roll = rand();
  if (roll < 0.55) return MONSTERS[0];
  if (roll < 0.85) return MONSTERS[1];
  if (roll < 0.97) return MONSTERS[2];
  return MONSTERS[3];
}
