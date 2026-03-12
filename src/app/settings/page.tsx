import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';

const governanceRules = [
  '这是全新项目，不默认继承旧项目上下文。',
  '引用旧成果必须进入候选引用清单并显式批准。',
  '版本链从 PM-WORKBENCH 项目代号下独立起算。',
  '文档以总索引 -> 主控文档 -> 专题文档顺序读取。',
  '状态定义与优先级定义统一由治理文档维护。'
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings / Governance" description="项目治理原则与系统说明。" />
      <article className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">治理原则</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {governanceRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <h3 className="mt-5 font-medium">系统版本</h3>
        <p className="text-sm text-slate-700">PM-WORKBENCH v0.1.0（Mock Data Mode）</p>
        <h3 className="mt-5 font-medium">后续扩展计划</h3>
        <p className="text-sm text-slate-700">预留 API 适配层、真实数据源、细粒度权限、协作流转。</p>
      </article>
    </PageContainer>
  );
}
