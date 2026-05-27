export function trackMessage(db, payload) {
  const stmt = db.prepare(`
    INSERT INTO tracked_messages (
      guild_id, channel_id, message_id, author_id, delete_at, status,
      is_pinned, is_admin_message, is_bot_config_message, delete_reason
    ) VALUES (
      @guildId, @channelId, @messageId, @authorId, @deleteAt, 'pending',
      @isPinned, @isAdminMessage, @isBotConfigMessage, @deleteReason
    )
    ON CONFLICT(message_id) DO NOTHING
  `);

  stmt.run({
    guildId: payload.guildId,
    channelId: payload.channelId,
    messageId: payload.messageId,
    authorId: payload.authorId,
    deleteAt: payload.deleteAt,
    isPinned: payload.isPinned ? 1 : 0,
    isAdminMessage: payload.isAdminMessage ? 1 : 0,
    isBotConfigMessage: payload.isBotConfigMessage ? 1 : 0,
    deleteReason: payload.deleteReason ?? null
  });
}

export function listDeletableMessages(db, nowIso) {
  return db.prepare(`
    SELECT *
    FROM tracked_messages
    WHERE status = 'pending'
      AND delete_at <= ?
      AND is_pinned = 0
      AND is_admin_message = 0
      AND is_bot_config_message = 0
    ORDER BY delete_at ASC
    LIMIT 100
  `).all(nowIso);
}

export function markDeleted(db, messageId) {
  db.prepare(`
    UPDATE tracked_messages
    SET status = 'deleted', delete_reason = COALESCE(delete_reason, 'scheduled cleanup')
    WHERE message_id = ?
  `).run(messageId);
}

export function markFailed(db, messageId, failedReason) {
  db.prepare(`
    UPDATE tracked_messages
    SET status = 'failed', failed_reason = ?
    WHERE message_id = ?
  `).run(failedReason, messageId);
}
