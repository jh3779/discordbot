PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_user_id TEXT NOT NULL,
  discord_username TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(discord_user_id)
);

CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  guild_id TEXT NOT NULL,
  name TEXT NOT NULL,
  job TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  attack INTEGER DEFAULT 10,
  defense INTEGER DEFAULT 3,
  gold INTEGER DEFAULT 0,
  current_area TEXT DEFAULT '폐허가 된 육조거리',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  UNIQUE(user_id, guild_id)
);


CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  effect_type TEXT,
  effect_value INTEGER DEFAULT 0,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  equipped INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(character_id) REFERENCES characters(id),
  FOREIGN KEY(item_id) REFERENCES items(id),
  UNIQUE(character_id, item_id)
);

CREATE TABLE IF NOT EXISTS cooldowns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL,
  command_name TEXT NOT NULL,
  available_at DATETIME NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(character_id) REFERENCES characters(id),
  UNIQUE(character_id, command_name)
);

CREATE TABLE IF NOT EXISTS battle_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character_id INTEGER NOT NULL,
  monster_name TEXT NOT NULL,
  result TEXT NOT NULL,
  exp_reward INTEGER DEFAULT 0,
  gold_reward INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(character_id) REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS auto_delete_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  delete_after_minutes INTEGER NOT NULL,
  enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(guild_id, channel_id)
);

CREATE TABLE IF NOT EXISTS tracked_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  delete_at DATETIME NOT NULL,
  status TEXT DEFAULT 'pending',
  is_pinned INTEGER DEFAULT 0,
  is_admin_message INTEGER DEFAULT 0,
  is_bot_config_message INTEGER DEFAULT 0,
  delete_reason TEXT,
  failed_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id)
);
