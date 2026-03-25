# Role-based Demo Path (PM-WORKBENCH)

## Role 1: Executive / 管理者

1. `/executive-dashboard` — portfolio view, readiness + risk/quality
2. `/version-governance` — release readiness + quality gate
3. `/data-exchange` — export bundle for management/supply consumers

## Role 2: Project owner / 项目负责人

1. `/projects` → `/projects/pm-workbench` — project detail (internal + external readiness)
2. `/input-inbox` — capture input → confirm → writeback
3. `/project-progress` — snapshot compare + quality summary
4. `/data-exchange` — import preview/apply mapping + export readiness

## Role 3: Member / 普通成员

1. `/task-execution` — task status + recent events
2. `/input-inbox` — submit activity/progress update (human confirmed)

## Role 4: Observer / 观察者（placeholder）

1. `/projects` — read-only browsing
2. `/projects/pm-workbench` — readiness + known gaps (no write actions)

