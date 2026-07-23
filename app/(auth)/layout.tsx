export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md px-4 py-12 animate-fade-up">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2.5 mb-1">
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
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
