const DEFAULT_ITEMS = [
  { itemCode: 'potion_small', name: '회복약', type: 'consumable', effectType: 'heal', effectValue: 30, description: 'HP 30 회복' },
  { itemCode: 'old_parts', name: '낡은 부품', type: 'material', effectType: null, effectValue: 0, description: '제작 재료' },
  { itemCode: 'broken_badge', name: '오류난 마패', type: 'quest', effectType: null, effectValue: 0, description: '특수 이벤트 해금용' },
  { itemCode: 'old_sabre', name: '낡은 환도', type: 'equipment', effectType: 'attack', effectValue: 3, description: '공격력 +3' }
];

export function seedItems(db) {
  const insert = db.prepare(`
    INSERT INTO items (item_code, name, type, effect_type, effect_value, description)
    VALUES (@itemCode, @name, @type, @effectType, @effectValue, @description)
    ON CONFLICT(item_code) DO UPDATE SET
      name = excluded.name,
      type = excluded.type,
      effect_type = excluded.effect_type,
      effect_value = excluded.effect_value,
      description = excluded.description
  `);

  const tx = db.transaction(() => {
    for (const item of DEFAULT_ITEMS) insert.run(item);
  });
  tx();
}

export function addItemToCharacter(db, characterId, itemCode, quantity = 1) {
  const getItem = db.prepare('SELECT id FROM items WHERE item_code = ?');
  const item = getItem.get(itemCode);
  if (!item) throw new Error(`Unknown item code: ${itemCode}`);

  db.prepare(`
    INSERT INTO user_items (character_id, item_id, quantity)
    VALUES (?, ?, ?)
    ON CONFLICT(character_id, item_id)
    DO UPDATE SET quantity = user_items.quantity + excluded.quantity
  `).run(characterId, item.id, quantity);
}

export function getInventory(db, characterId) {
  return db.prepare(`
    SELECT i.item_code, i.name, i.type, ui.quantity
    FROM user_items ui
    INNER JOIN items i ON i.id = ui.item_id
    WHERE ui.character_id = ? AND ui.quantity > 0
    ORDER BY i.type ASC, i.name ASC
  `).all(characterId);
}
