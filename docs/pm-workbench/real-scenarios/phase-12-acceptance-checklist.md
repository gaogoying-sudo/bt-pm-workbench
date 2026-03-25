# Phase 12 Acceptance Checklist (Scenario-based)

Prereq: run dev server, optionally file persistence.

## Scenario A — Weekly Sync

- [ ] Open `/input-inbox`
- [ ] Select template `场景A：进展例会` and click `Capture → Draft`
- [ ] In queue, confirm:
  - progress-update (projectId `pm-workbench`, progressDelta +10%)
  - risk-event (severity high)
  - decision-note (decisionType weekly-sync, followups optional)
- [ ] Verify:
  - `/projects/pm-workbench` shows recent confirmed events
  - `/projects/pm-workbench` shows decisions/followups
  - `/executive-dashboard` shows proactive alerts panel populated (if backlog/mapping gap exists)

## Scenario B — Release Review

- [ ] Open `/version-governance`, select `version-pmw-r2`
- [ ] Click `Record GO/NO-GO/DEFER` → confirms go to `/input-inbox`
- [ ] In `/input-inbox`, confirm decision-note:
  - decisionType `release-review`
  - linkedVersionId `version-pmw-r2`
  - releaseDecision `go|no-go|defer`
- [ ] Verify:
  - `/version-governance` “Recent decisions (version)” shows the decision
  - `/version-governance` alerts panel shows version scoped alerts (if any)
  - `/executive-dashboard` still builds and no core pages crash

## Reset

- `npm run pmw:demo:reset`

