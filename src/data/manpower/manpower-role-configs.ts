import { EngineerRoleConfig } from '@/lib/types/manpower';

export const manpowerRoleConfigs: EngineerRoleConfig[] = [
  {
    id: 'role-frontend-p3',
    name: '前端工程师',
    roleType: 'frontend',
    level: 'P3',
    defaultDailyRate: 1800,
    defaultMonthlyCost: 36000,
    defaultUtilization: 0.78,
    defaultCapacity: 22,
    notes: '适合工作台、门户和中后台交互模块。'
  },
  {
    id: 'role-backend-p4',
    name: '后端工程师',
    roleType: 'backend',
    level: 'P4',
    defaultDailyRate: 2200,
    defaultMonthlyCost: 44000,
    defaultUtilization: 0.82,
    defaultCapacity: 23,
    notes: '适合服务治理、接口编排与核心域逻辑。'
  },
  {
    id: 'role-fullstack-p4',
    name: '全栈工程师',
    roleType: 'fullstack',
    level: 'P4',
    defaultDailyRate: 2400,
    defaultMonthlyCost: 48000,
    defaultUtilization: 0.8,
    defaultCapacity: 22,
    notes: '适合快速验证与跨端交付。'
  },
  {
    id: 'role-qa-p3',
    name: '测试工程师',
    roleType: 'qa',
    level: 'P3',
    defaultDailyRate: 1600,
    defaultMonthlyCost: 32000,
    defaultUtilization: 0.76,
    defaultCapacity: 21,
    notes: '覆盖测试设计、回归与发布验证。'
  },
  {
    id: 'role-pm-p4',
    name: '产品经理',
    roleType: 'product-manager',
    level: 'P4',
    defaultDailyRate: 2100,
    defaultMonthlyCost: 42000,
    defaultUtilization: 0.72,
    defaultCapacity: 20,
    notes: '承担需求拆解、优先级管理和验收口径。'
  },
  {
    id: 'role-project-manager-p4',
    name: '项目经理',
    roleType: 'project-manager',
    level: 'P4',
    defaultDailyRate: 2300,
    defaultMonthlyCost: 46000,
    defaultUtilization: 0.75,
    defaultCapacity: 21,
    notes: '负责排期、资源协调和风险跟踪。'
  },
  {
    id: 'role-designer-p3',
    name: '设计师',
    roleType: 'designer',
    level: 'P3',
    defaultDailyRate: 1700,
    defaultMonthlyCost: 34000,
    defaultUtilization: 0.74,
    defaultCapacity: 20,
    notes: '负责交互方案与视觉规范延展。'
  },
  {
    id: 'role-ai-p5',
    name: '算法 / AI 工程师',
    roleType: 'ai-engineer',
    level: 'P5',
    defaultDailyRate: 3200,
    defaultMonthlyCost: 64000,
    defaultUtilization: 0.7,
    defaultCapacity: 18,
    notes: '负责模型接入、推理链路和效果评估。'
  },
  {
    id: 'role-data-p4',
    name: '数据工程师',
    roleType: 'data-engineer',
    level: 'P4',
    defaultDailyRate: 2600,
    defaultMonthlyCost: 52000,
    defaultUtilization: 0.77,
    defaultCapacity: 21,
    notes: '负责埋点、数据加工和指标产出。'
  },
  {
    id: 'role-platform-p4',
    name: '运维 / 平台工程师',
    roleType: 'platform-engineer',
    level: 'P4',
    defaultDailyRate: 2500,
    defaultMonthlyCost: 50000,
    defaultUtilization: 0.73,
    defaultCapacity: 20,
    notes: '负责环境、发布、容量和稳定性支撑。'
  }
];
