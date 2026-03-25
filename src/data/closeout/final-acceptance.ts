import {
  DemoReadinessRecord,
  FinalAcceptanceChecklistRecord,
  ReleaseReadinessRecord,
  RoleWalkthroughRecord,
  CriticalGapRecord
} from '@/lib/types/closeout';

const now = new Date().toISOString();

export const finalAcceptanceChecklist: FinalAcceptanceChecklistRecord = {
  id: 'fac-001',
  title: 'PM-WORKBENCH Final Acceptance Checklist (High-value Closeout)',
  createdAt: now,
  criteria: [
    {
      id: 'ac-master-data',
      category: 'master-data',
      title: 'Unified project identity resolution',
      description: '项目 route/legacy/canonical/manpower ID 统一解析，不再散落 projectIdMap。',
      status: 'pass',
      evidence: ['src/lib/identity/unified-project-registry.ts'],
      owner: 'system'
    },
    {
      id: 'ac-core-pages',
      category: 'core-pages',
      title: 'Core pages runnable',
      description: '核心页面可打开，不报错；入口口径一致。',
      status: 'pass',
      evidence: ['/projects', '/projects/[projectId]', '/task-execution', '/project-progress', '/version-governance', '/executive-dashboard'],
      owner: 'system'
    },
    {
      id: 'ac-snapshot-quality',
      category: 'snapshot-quality',
      title: 'Snapshot compare + quality governance',
      description: '多时点对比可展示，质量维度独立于风险。',
      status: 'pass',
      evidence: ['/api/snapshots', '/api/quality'],
      owner: 'system'
    },
    {
      id: 'ac-input-events',
      category: 'input-events',
      title: 'Input events flow with human-in-the-loop',
      description: 'raw→draft→confirm→writeback 主链可跑，且可拒绝/可修正。',
      status: 'pass',
      evidence: ['/input-inbox', '/api/input-events/*'],
      owner: 'system'
    },
    {
      id: 'ac-identity-access',
      category: 'identity-access',
      title: 'Identity/access foundations',
      description: 'mock session + access guard 生效，且可扩展为真实登录上下文。',
      status: 'caveat',
      evidence: ['src/components/identity/current-user-provider.tsx', 'src/components/identity/access-guard.tsx'],
      owner: 'system'
    },
    {
      id: 'ac-external-collaboration',
      category: 'external-collaboration',
      title: 'Import/export + readiness',
      description: '导入预览/应用与导出 bundle 可演示；readiness 可在核心页面消费。',
      status: 'pass',
      evidence: ['/data-exchange', '/api/data-exchange/*', '/api/readiness'],
      owner: 'system'
    },
    {
      id: 'ac-persistence-env',
      category: 'persistence-env-testing-docs',
      title: 'Persistence/env/testing/docs closeout',
      description: 'file persistence 模式可用；health endpoint 可用；vitest tests 可执行；handoff 完整。',
      status: 'pass',
      evidence: ['PMW_PERSISTENCE_MODE=file', '/api/health', 'npm run test', 'docs/pm-workbench/*'],
      owner: 'system'
    }
  ]
};

export const releaseReadiness: ReleaseReadinessRecord = {
  id: 'rr-001',
  status: 'ready-with-caveats',
  summary: '基础底座封板可验收；真实飞书绑定/组织同步仍需后续按环境配置验证。',
  blockers: [],
  caveats: ['Feishu external identity binding currently fallback default without binding UI.', 'File persistence is local JSON, not DB.'],
  decidedAt: now
};

export const criticalGaps: CriticalGapRecord[] = [
  {
    id: 'gap-feishu-binding-ui',
    title: 'Feishu identity binding UI missing',
    severity: 'high',
    disposition: 'defer',
    status: 'open',
    owner: 'next iteration',
    notes: 'Current fallback keeps system runnable; next step is binding UI & org mapping.'
  }
];

export const roleWalkthroughs: RoleWalkthroughRecord[] = [
  {
    id: 'walk-exec',
    role: 'executive',
    goal: 'Portfolio review: readiness/risk/quality summary',
    steps: [
      { label: 'Executive dashboard', path: '/executive-dashboard', expected: 'See portfolio progress deltas + readiness counters.' },
      { label: 'Version governance', path: '/version-governance', expected: 'See external readiness summary & quality gate.' },
      { label: 'Data exchange', path: '/data-exchange', expected: 'Generate export bundle for management/supply.' }
    ]
  },
  {
    id: 'walk-owner',
    role: 'project-owner',
    goal: 'Project status + event writeback + export readiness',
    steps: [
      { label: 'Projects list', path: '/projects', expected: 'Find target project.' },
      { label: 'Project detail', path: '/projects/pm-workbench', expected: 'See readiness + mapping + recent events.' },
      { label: 'Input inbox', path: '/input-inbox', expected: 'Capture input → confirm → writeback.' },
      { label: 'Data exchange', path: '/data-exchange', expected: 'Import mapping or export readiness payload.' }
    ]
  },
  {
    id: 'walk-member',
    role: 'member',
    goal: 'Task execution + recent confirmed events',
    steps: [
      { label: 'Task execution', path: '/task-execution', expected: 'See tasks + recent confirmed events.' },
      { label: 'Project progress', path: '/project-progress', expected: 'See snapshot compare + quality summary.' }
    ]
  }
];

export const demoReadiness: DemoReadinessRecord = {
  id: 'demo-001',
  status: 'ready',
  demoDataMode: 'seed',
  resetSteps: ['npm run pmw:reset:data (if file persistence enabled)', 'Restart dev server', 'Open /data-exchange and run preview/apply once if you want mapping demo.'],
  notes: 'Demo uses seeded mock data + optional durable file persistence.'
};

