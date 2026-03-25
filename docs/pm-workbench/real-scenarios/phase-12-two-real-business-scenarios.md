# Phase 12: Two Real Business Scenarios (E2E)

This package **selects exactly 2 scenarios** and makes them executable end-to-end with real fields, real rules, and acceptance paths.

## Scenario A — Project Weekly Sync / 日常进展更新（例会）

- **Entry**: `/input-inbox` (templates: weekly sync)
- **Roles**: 项目负责人 / PM / 开发负责人
- **Objects**: input events → confirmed events → writebacks → task activities / risk projections / manpower actuals → dashboards
- **Pages**:
  - `/input-inbox` (capture → confirm → writeback)
  - `/projects/[projectId]` (recent events + decisions + followups + alerts)
  - `/executive-dashboard` (portfolio deltas + proactive alerts)
  - `/project-progress` (snapshot compare + project scoped alerts)

### State changes (must happen)
- confirmed event becomes `written-back`
- task activity record added for progress update
- risk projection added for risk event
- manpower actual input added when applicable
- decision-note generates **DecisionLogRecord** + followup actions (if provided)

### Acceptance (pass/fail)
- **Start**: open `/input-inbox`, submit weekly sync template
- **Actions**:
  - confirm progress-update (+delta + comment)
  - confirm risk-event (severity + owner suggestion)
  - confirm decision-note with followups
- **Expected**:
  - `/projects/pm-workbench` shows updated recent events + decisions + followups
  - `/executive-dashboard` shows new alerts/recommendations if backlog/mapping gaps exist

## Scenario B — Release Readiness Review / 版本发布评审（上线准备）

- **Entry**: `/version-governance` (selected version decision) OR `/input-inbox` (release review decision-note)
- **Roles**: 发布负责人 / QA / 项目负责人 / 管理者
- **Objects**: version governance + quality gate + readiness + release window + decision log
- **Pages**:
  - `/version-governance` (quality gate + readiness + alerts + release decision panel)
  - `/projects/[projectId]` (project external readiness + mapping + release related decisions)
  - `/executive-dashboard` (release readiness watch)

### Gate rules (v0)
- **Blocked** if:
  - quality gate blocked OR external readiness blocked OR writeback coverage gaps
- **Ready** if:
  - quality gate passed AND external readiness ready AND no blocking issues

### Acceptance (pass/fail)
- **Start**: open `/version-governance`, select `version-pmw-r2`
- **Actions**:
  - record a release decision (go/no-go) with reasons and followups
  - verify alerts/recommendations reflect readiness/mapping/backlog conditions
- **Expected**:
  - decision appears in `/version-governance` (version scope) and `/projects/pm-workbench`
  - proactive alerts explain **why** readiness is blocked/watching/ready

## Demo / Reset

- Recommended: file persistence mode
- Reset: `npm run pmw:demo:reset`

