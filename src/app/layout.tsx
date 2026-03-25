import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CurrentUserProvider } from '@/components/identity/current-user-provider';

export const metadata: Metadata = {
  title: 'BT PM Workbench',
  description: 'Internal project governance workbench'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <CurrentUserProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
              <Topbar />
              {children}
            </div>
          </div>
        </CurrentUserProvider>
      </body>
    </html>
  );
}
