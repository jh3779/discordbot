function toIso(ts) {
  return new Date(ts).toISOString();
}

export function checkAndSetCooldown(db, characterId, commandName, nowMs, ttlMs) {
  const begin = db.prepare('BEGIN IMMEDIATE');
  const commit = db.prepare('COMMIT');
  const rollback = db.prepare('ROLLBACK');

  const getRow = db.prepare(`
    SELECT available_at
    FROM cooldowns
    WHERE character_id = ? AND command_name = ?
  `);

  const upsert = db.prepare(`
    INSERT INTO cooldowns (character_id, command_name, available_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(character_id, command_name)
    DO UPDATE SET available_at = excluded.available_at, updated_at = CURRENT_TIMESTAMP
  `);

  begin.run();
  try {
    const row = getRow.get(characterId, commandName);
    const nowIso = toIso(nowMs);

    if (row?.available_at && row.available_at > nowIso) {
      commit.run();
      return { ok: false, availableAt: row.available_at };
    }

    const availableAt = toIso(nowMs + ttlMs);
    upsert.run(characterId, commandName, availableAt);
    commit.run();
    return { ok: true, availableAt };
  } catch (error) {
    rollback.run();
    throw error;
  }
}
