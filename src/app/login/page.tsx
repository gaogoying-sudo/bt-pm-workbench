import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <PageContainer>
      <PageHeader title="登录" description="选择登录方式：演示模式或飞书 OAuth（需配置环境变量）。" />
      <section className="pmw-surface space-y-3 p-5">
        <p className="text-sm text-slate-700">
          默认落地：进入「我的工作台」开始主流程；需要全局视角可进入「管理驾驶舱」。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className="pmw-btn pmw-btn-primary" href="/me">
            进入我的工作台（默认）
          </Link>
          <Link className="pmw-btn" href="/projects">
            进入项目列表
          </Link>
          <Link className="pmw-btn" href="/executive-dashboard">
            进入管理驾驶舱
          </Link>
        </div>

        <a className="pmw-btn" href="/api/auth/feishu/login">
          使用飞书登录（跳转）
        </a>

        <div className="rounded-xl border border-slate-200/70 bg-blue-50/50 p-4">
          <p className="text-sm text-slate-700">环境变量（飞书模式）</p>
          <p className="mt-1 text-xs text-slate-500">
            PMW_AUTH_MODE=feishu · FEISHU_APP_ID · FEISHU_APP_SECRET · FEISHU_REDIRECT_URI
          </p>
        </div>
      </section>
    </PageContainer>
  );
}

