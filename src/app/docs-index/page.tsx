import { redirect } from 'next/navigation';

/** @deprecated 文档索引入口收拢至工作台。 */
export default function LegacyDocsIndexPage() {
  redirect('/me?from=legacy-docs-index');
}
