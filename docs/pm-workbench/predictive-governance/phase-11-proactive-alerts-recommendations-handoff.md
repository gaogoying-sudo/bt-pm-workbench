# Phase 11: Proactive Alerts / Forecasts / Recommendations Handoff

This phase upgrades PM-WORKBENCH from **passive dashboards** to a **proactive governance assistant** (rule-based, explainable).

## What’s included (v0)

### Alert domain
- Types: `src/lib/types/alerting.ts`
- Rules: `src/data/alerting/alert-rules.ts`
- API: `GET /api/alerting?scope=portfolio|project|version&scopeId=...`
- Triage: `POST /api/alerting/triage` supports `ack|dismiss|snooze|resolve`

### Recommendations
- Types: `src/lib/types/recommendations.ts`
- Playbooks: `src/data/alerting/playbooks.ts`
- API: `GET /api/recommendations?scope=...`
- Triage: `POST /api/recommendations/triage` supports `ack|dismiss|snooze|start|done`

### Builders (signals/forecast)
Implemented in `src/server/services/alerting-service.ts`:
- progress delta trend (baseline vs current)
- input confirmation backlog lead indicator + backlog forecast
- quality readiness forecast (portfolio)
- external mapping gap alerts (readiness + bindings)

## Where it shows up (core pages)

- `/executive-dashboard`: portfolio alerts + recommendations
- `/projects/[projectId]`: project scoped alerts + recommendations
- `/project-progress`: selected project alerts
- `/version-governance`: selected version alerts

## Explanation model (Why)

Every alert/recommendation carries:
- `why`: human-readable explanation
- `evidence[]`: metric/snapshot/quality/readiness/event references
- rule code + rule version (via `AlertRuleRecord`)

## Known limitations (intentional)

- v0 rules are deterministic and simple (no ML, no LLM).
- persistence is local store; triage state is stored per alert/recommendation id.
- alert IDs are stable per scope + snapshotDate (v0), but not a full trigger history engine.

## Safe extension guide (for cheap models)

### Add a new alert rule
1. Define rule in `src/data/alerting/alert-rules.ts` (code + version + rationale)
2. Implement computation in `src/server/services/alerting-service.ts`
3. Ensure `why` + `evidence[]` are present
4. Add a playbook mapping if actionable

### Add a recommendation template
1. Add playbook in `src/data/alerting/playbooks.ts`
2. Ensure it links to an alert type via `linkedRuleCode` and carries evidence

### Don’t do
- Don’t compute alerts inside pages
- Don’t create “shadow metrics”; always reference `/api/metrics` codes
- Don’t introduce autonomous execution

