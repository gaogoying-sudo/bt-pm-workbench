import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <PageContainer>
      <PageHeader title="Login / 登录" description="选择登录模式：开发 mock 或飞书真实登录（需配置 env）。" />
      <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <a className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm text-white" href="/api/auth/feishu/login">
          Feishu Login URL (API)
        </a>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" href="/me">
            进入我的工作台 / Me
          </Link>
          <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" href="/projects">
            进入项目列表 / Projects
          </Link>
          <Link className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" href="/executive-dashboard">
            进入驾驶舱 / Executive
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          飞书登录实际跳转请调用接口拿到 url 后在前端重定向。当前先提供最小链路与配置骨架。
        </p>
        <p className="text-xs text-slate-500">
          配置：PMW_AUTH_MODE=feishu + FEISHU_APP_ID/FEISHU_APP_SECRET/FEISHU_REDIRECT_URI
        </p>
      </section>
    </PageContainer>
  );
}

