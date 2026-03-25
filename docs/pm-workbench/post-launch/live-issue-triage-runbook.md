# Live Issue Triage Runbook (First-wave)

## Entry points

- Issues pack: `GET /api/live-issues`
- Health: `GET /api/health`
- Data governance: `GET /api/data-governance`
- Alerting: `GET /api/alerting`

## Process (required)

1) **Record** a `LiveIssueRecord` (title, scope, severity, source, repro)
2) **Triage**: set disposition + hotfixCandidate + owner
3) **Fix** (only if blocker/high or low-risk)
4) **Validate**: add validation steps + result
5) **Update** docs:
   - known issues
   - safe operating range
   - scenario acceptance checklist if impacted

## Severity guidance

- blocker: prevents scenario A/B end-to-end
- high: breaks core page or writeback chain
- medium: degraded governance accuracy, but usable
- low: UX friction; can be deferred

