import { checkAndSetCooldown } from '../systems/cooldownSystem.js';
import { resolveExplore } from '../systems/exploreSystem.js';
import { applyExperienceAndLevel } from '../systems/levelSystem.js';
import { addItemToCharacter } from '../systems/itemSystem.js';

const COOLDOWN_MS = 5 * 60 * 1000;

export function exploreOnce(db, { guildId, discordUserId, nowMs = Date.now(), rand = Math.random }) {
  const getCharacter = db.prepare(`
    SELECT c.*
    FROM characters c
    JOIN users u ON u.id = c.user_id
    WHERE c.guild_id = ? AND u.discord_user_id = ?
  `);

  const character = getCharacter.get(guildId, discordUserId);
  if (!character) return { ok: false, reason: 'NO_CHARACTER' };

  const cooldown = checkAndSetCooldown(db, character.id, 'rpg_explore', nowMs, COOLDOWN_MS);
  if (!cooldown.ok) return { ok: false, reason: 'COOLDOWN', availableAt: cooldown.availableAt };

  const event = resolveExplore(character, rand);
  const tx = db.transaction(() => {
    if (event.type === 'battle') {
      const b = event.battle;
      const gainedExp = b.rewards.exp;
      const gainedGold = b.rewards.gold;
      const lv = applyExperienceAndLevel(character, gainedExp);
      const finalHp = Math.max(1, b.playerHp);

      db.prepare(`UPDATE characters SET hp = ?, level = ?, exp = ?, max_hp = ?, attack = ?, defense = ?, gold = gold + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .run(finalHp, lv.level, lv.exp, lv.maxHp, lv.attack, lv.defense, gainedGold, character.id);

      db.prepare(`INSERT INTO battle_logs (character_id, monster_name, result, exp_reward, gold_reward) VALUES (?, ?, ?, ?, ?)`) 
        .run(character.id, b.monster.name, b.result, gainedExp, gainedGold);

      if (b.result === 'win' && b.dropItemCode) {
        addItemToCharacter(db, character.id, b.dropItemCode, 1);
      }

      return { type: 'battle', battle: b, level: lv };
    }

    if (event.type === 'gold') {
      db.prepare('UPDATE characters SET gold = gold + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(event.gold, character.id);
      return event;
    }

    if (event.type === 'heal') {
      const nextHp = Math.min(character.max_hp, character.hp + event.heal);
      db.prepare('UPDATE characters SET hp = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(nextHp, character.id);
      return { ...event, hpAfter: nextHp };
    }

    if (event.type === 'special') {
      const lv = applyExperienceAndLevel(character, event.exp);
      db.prepare('UPDATE characters SET hp = ?, level = ?, exp = ?, max_hp = ?, attack = ?, defense = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(lv.hp, lv.level, lv.exp, lv.maxHp, lv.attack, lv.defense, character.id);
      return { ...event, level: lv };
    }

    if (event.type === 'item') {
      addItemToCharacter(db, character.id, event.itemCode, event.quantity);
      db.prepare('UPDATE characters SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(character.id);
      return event;
    }

    return event;
  });

  const result = tx();
  return { ok: true, event: result };
}
