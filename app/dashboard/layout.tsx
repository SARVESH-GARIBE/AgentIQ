import { getAuthUser } from '@/lib/getAuthUser';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-primary">
      <nav
        className="sticky top-0 z-10 w-full"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div
                  className="h-7 w-7 rounded-md flex items-center justify-center"
                  style={{ background: 'var(--accent)' }}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    style={{ color: 'var(--bg-primary)' }}
                  >
                    <path
                      d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  className="text-lg font-semibold tracking-tight"
                  style={{ color: 'var(--text-light)' }}
                >
                  AgentIQ
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {user?.email}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--text-light)' }}
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
