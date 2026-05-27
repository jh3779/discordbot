const JOBS = {
  기록자: { hp: 100, attack: 10, defense: 3 },
  보부상: { hp: 110, attack: 8, defense: 4 },
  추격자: { hp: 90, attack: 13, defense: 2 }
};

export function createCharacter(db, { discordUserId, discordUsername, guildId, name, job = '기록자' }) {
  const selectedJob = JOBS[job] ?? JOBS.기록자;

  const insertUser = db.prepare(`
    INSERT INTO users (discord_user_id, discord_username)
    VALUES (?, ?)
    ON CONFLICT(discord_user_id) DO UPDATE SET discord_username = excluded.discord_username
  `);

  const getUser = db.prepare('SELECT id FROM users WHERE discord_user_id = ?');
  const getCharacter = db.prepare('SELECT * FROM characters WHERE user_id = ? AND guild_id = ?');
  const insertCharacter = db.prepare(`
    INSERT INTO characters (user_id, guild_id, name, job, hp, max_hp, attack, defense)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(discordUserId, discordUsername);
  const user = getUser.get(discordUserId);
  const existing = getCharacter.get(user.id, guildId);

  if (existing) {
    return { created: false, character: existing };
  }

  insertCharacter.run(
    user.id,
    guildId,
    name,
    job,
    selectedJob.hp,
    selectedJob.hp,
    selectedJob.attack,
    selectedJob.defense
  );

  return { created: true, character: getCharacter.get(user.id, guildId) };
}
