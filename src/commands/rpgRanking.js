export function getGuildRanking(db, guildId, limit = 10) {
  return db.prepare(`
    SELECT c.name, c.level, c.exp, c.updated_at, u.discord_username
    FROM characters c
    INNER JOIN users u ON u.id = c.user_id
    WHERE c.guild_id = ?
    ORDER BY c.level DESC, c.exp DESC, c.updated_at ASC
    LIMIT ?
  `).all(guildId, limit);
}
