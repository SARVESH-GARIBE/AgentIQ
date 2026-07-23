'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentFormInput } from '@/types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agentData: Partial<AgentFormInput>) => void;
}

interface AdvisorRecommendation {
  name: string;
  category: string;
  pricingModel: string;
  description: string;
  whySuitable: string;
  expectedBenefits: string;
  techStack: string;
  difficulty: string;
  roi: string;
}

export default function AIAdvisorModal({ isOpen, onClose, onCreateAgent }: AIAdvisorModalProps) {
  const [industry, setIndustry] = useState('');
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing your request...');
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AdvisorRecommendation | null>(null);

  useEffect(() => {
    if (isLoading) {
      const texts = [
        'Analyzing your request...',
        'Understanding your business...',
        'Finding the best AI solution...',
        'Preparing recommendation...',
      ];
      let i = 0;
      setLoadingText(texts[0]);
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!industry.trim() || !problem.trim()) {
      setError('Please provide both industry and problem description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, problem }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate recommendation. Please check your API key.');
      }

      const data = await res.json();
      setRecommendation(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = () => {
    if (recommendation) {
      onCreateAgent({
        name: recommendation.name,
        category: recommendation.category as AgentFormInput['category'],
        pricingModel: recommendation.pricingModel || '$0.01 / 1K tokens',
        description: recommendation.description,
      });
      setRecommendation(null);
      setIndustry('');
      setProblem('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0 bg-[#051F20]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative surface-card w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl border border-[var(--border)]"
            role="dialog"
            aria-modal="true"
          >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-light)]">
              AI Business Advisor
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md text-sm animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-light)]">Business / Industry</label>
            <input
              type="text"
              placeholder="e.g. E-commerce, Healthcare, SaaS"
              className="auth-input"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={isLoading || !!recommendation}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-light)]">Describe your business problem</label>
            <textarea
              placeholder="e.g. We receive hundreds of repetitive customer support emails every day and only have a small support team."
              rows={4}
              className="auth-input resize-none"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={isLoading || !!recommendation}
            />
          </div>

          {!recommendation && (
            <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.05)] flex justify-end gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-4 w-4 text-[#051F20]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingText}
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-semibold whitespace-nowrap"
                      >
                        {loadingText}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Generate Recommendation
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="mt-8 animate-fade-up">
            <h3 className="text-lg font-bold text-[var(--text-light)] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommended AI Solution
            </h3>
            
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] space-y-4">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Solution Name</span>
                <span className="text-base font-bold text-[var(--accent)]">{recommendation.name}</span>
                <span className="ml-3 px-2 py-0.5 text-xs font-semibold rounded bg-[rgba(255,255,255,0.1)] text-[var(--text-light)]">{recommendation.category}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Why Suitable</span>
                <span className="text-sm text-[var(--text-light)]">{recommendation.whySuitable}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Expected Benefits</span>
                <span className="text-sm text-[var(--text-light)]">{recommendation.expectedBenefits}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Tech Stack</span>
                  <span className="text-sm text-[var(--text-light)]">{recommendation.techStack}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Difficulty</span>
                  <span className="text-sm text-[var(--text-light)]">{recommendation.difficulty}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Estimated ROI</span>
                  <span className="text-sm font-semibold text-[var(--accent)]">{recommendation.roi}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setRecommendation(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-md transition-all hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-light)] border border-[var(--border)]"
              >
                Start Over
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCreateAgent}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
              >
                Create Agent
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </div>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
