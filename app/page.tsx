'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-[var(--border)] bg-[#051F20]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <BrainCircuit size={20} className="text-[#051F20]" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text-light)]">AgentIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-[var(--text-light)] hover:text-[var(--accent)] transition-colors">
              Log In
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#051F20] hover:bg-[#a3c7af] transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center pt-20 pb-16 px-6 text-center">
        <div className="inline-block mb-6 px-3 py-1.5 rounded-full border border-[rgba(142,182,155,0.3)] bg-[rgba(142,182,155,0.1)] text-[var(--accent)] text-xs font-semibold tracking-wide uppercase animate-fade-up" style={{ animationDelay: '0ms' }}>
          Business Solutions Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-light)] max-w-4xl mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          Solve Real Business Problems <br className="hidden md:block"/> With AI.
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: '200ms' }}>
          This platform helps organizations organize, evaluate, and manage AI solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up w-full sm:w-auto" style={{ animationDelay: '300ms' }}>
          <Link href="/register" className="btn-primary w-full sm:w-auto px-8 py-3 text-base">
            Deploy Your First Solution
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/dashboard" className="px-8 py-3 text-base font-semibold rounded-md transition-all hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-light)] border border-[var(--border)] w-full sm:w-auto flex items-center justify-center">
            Open Dashboard
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-24 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="surface-card surface-card-hover p-8 text-left h-full">
            <div className="w-12 h-12 rounded-lg bg-[rgba(142,182,155,0.1)] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-light)] mb-3">Custom Deployment</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Deploy tailored agents for coding, writing, or customer support with just a few clicks. No complex configuration required.</p>
          </div>
          <div className="surface-card surface-card-hover p-8 text-left h-full">
            <div className="w-12 h-12 rounded-lg bg-[rgba(142,182,155,0.1)] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-light)] mb-3">Real-time Analytics</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Monitor your agents&apos; performance, token usage, and pricing models directly from the interactive dashboard.</p>
          </div>
          <div className="surface-card surface-card-hover p-8 text-left h-full">
            <div className="w-12 h-12 rounded-lg bg-[rgba(142,182,155,0.1)] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-light)] mb-3">Enterprise Security</h3>
            <p className="text-[var(--text-muted)] leading-relaxed">Bank-grade encryption, secure authentication, and robust access controls keep your AI infrastructure completely protected.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-[var(--text-muted)] text-sm">
        <p>&copy; {new Date().getFullYear()} AgentIQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
