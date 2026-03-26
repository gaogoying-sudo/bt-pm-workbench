import { redirect } from 'next/navigation';

/** @deprecated 候选引用入口收拢至我的工作台。 */
export default function LegacyReferencesPage() {
  redirect('/me?from=legacy-references');
}
