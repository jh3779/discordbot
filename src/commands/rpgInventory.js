import { getInventory } from '../systems/itemSystem.js';

export function getCharacterInventory(db, { guildId, discordUserId }) {
  const character = db.prepare(`
    SELECT c.id, c.name
    FROM characters c
    INNER JOIN users u ON u.id = c.user_id
    WHERE c.guild_id = ? AND u.discord_user_id = ?
  `).get(guildId, discordUserId);

  if (!character) {
    return { ok: false, reason: 'NO_CHARACTER' };
  }

  const items = getInventory(db, character.id);
  return { ok: true, characterName: character.name, items };
}
