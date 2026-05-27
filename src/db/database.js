import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { seedItems } from '../systems/itemSystem.js';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'data', 'bot.sqlite');
const SCHEMA_PATH = path.resolve(process.cwd(), 'src', 'db', 'schema.sql');

export function createDatabase(dbPath = DEFAULT_DB_PATH) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  seedItems(db);
  return db;
}
