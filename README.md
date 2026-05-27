# Discord Text RPG AutoDelete Bot (v0.1 MVP)

## High-risk-first implementation started

This repository now includes the first implementation pass for the highest-risk systems:

1. **Data consistency**: unique character per `(user, guild)`.
2. **Concurrency safety**: transactional cooldown guard with `BEGIN IMMEDIATE`.
3. **Auto-delete policy safety**: exclusion metadata (`pinned/admin/config`) in tracked messages.
4. **Ranking determinism**: fixed sort by `level DESC, exp DESC, updated_at ASC`.

## Implemented files

- `src/db/schema.sql`
- `src/db/database.js`
- `src/systems/cooldownSystem.js`
- `src/systems/autoDeleteSystem.js`
- `src/commands/rpgStart.js`
- `src/commands/rpgRanking.js`

## Next steps

- Add `rpgExplore` command transaction that combines cooldown, battle/reward, and persistence.
- Add battle scaling and reward balancing table.
- Wire Discord slash commands and scheduler runtime.


## 프로젝트 운영 문서
- 작업 보고서: `docs/WORK_REPORT.md`
- 전체 작업 지시서/진행도 체크: `docs/WORK_INSTRUCTION.md`
