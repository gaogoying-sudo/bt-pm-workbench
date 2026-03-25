# Post-launch Maintenance Governance (Cheap vs Strong Model)

## What cheap models can do (default)
- UI copy/labels, empty states, minor layout fixes
- Add/adjust a **threshold value** with versioned rule update + docs
- Import/export mapping field tweaks (with preview/apply consistency)
- Add new playbook templates (recommendations) and simple rules
- Add data quality checks (evidence + suggested action required)

## What must add tests first
- Any change touching:
  - `src/server/services/event-writeback-service.ts`
  - snapshot compare builders
  - persistence contracts
  - metric dictionary version meanings

## What must escalate to strong model
- Cross-domain refactors (identity + input events + snapshot + metrics intertwined)
- Breaking contract changes (API response shapes, core types)
- Any “rewrite builder layer” proposals

## Maintenance templates

### Fix a page field display bug
- Locate the type contract → builder/service output → page consumption
- Add/extend field in contract, do not patch page-local maps
- Update acceptance checklist if it affects scenarios A/B

### Tune a rule threshold
- Change in one place (rule/config), document:
  - why changed
  - impact scope/pages
  - how to validate

### Fix import/export mapping issue
- Ensure preview/apply share the same schema validation
- Add warning text + a safe retry path
- Update `known-issues` if still caveated

### Fix permission boundary issue
- Prefer `AccessGuard` section-level fixes
- Document intended scope and fallback behavior

### Fix snapshot/compare anomaly
- Add a data quality check (drift/consistency)
- Ensure page shows “caveated/untrusted” marker when applicable

## “Strong model needed?” decision

Escalate when:
- change impacts 3+ domains, or
- requires redefining metric semantics, or
- risks breaking scenario A/B end-to-end acceptance paths.

