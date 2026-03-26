import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { reviewService } from '@/server/services/review-service';
import { resolveProjectId, getProjectIdentity } from '@/lib/identity/unified-project-registry';

export default function ProjectReviewsTabPage({ params }: { params: { projectId: string } }) {
  const identity = getProjectIdentity(params.projectId);
  const canonicalId = identity?.canonicalId ?? resolveProjectId(params.projectId);
  if (!canonicalId) notFound();

  const reviewPack = reviewService.listPack({ projectId: canonicalId });

  return (
    <>
      <PageHeader
        title="Reviews & Decisions / 复盘与决策"
        description="消费复盘与决策域（reviewService）；与版本页联动。"
      />

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Recent decisions</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          {reviewPack.decisions.length === 0 ? (
            <p className="text-sm text-slate-500">暂无决策记录。</p>
          ) : (
            reviewPack.decisions.slice(0, 10).map((d) => (
              <div key={d.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{d.title}</span>
                  <span className="text-xs text-slate-500">{d.decidedAt}</span>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  决策：{d.decision}；原因：{d.reason}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Lessons learned</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          {reviewPack.lessons.length === 0 ? (
            <p className="text-sm text-slate-500">暂无经验沉淀。</p>
          ) : (
            reviewPack.lessons.slice(0, 10).map((l) => (
              <div key={l.id} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{l.title}</span>
                  <span className="text-xs text-slate-500">{l.createdAt}</span>
                </div>
                {l.lesson ? <div className="mt-2 text-xs text-slate-600">{l.lesson}</div> : null}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
