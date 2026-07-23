'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { IAgentResponse } from '@/types';
import { getBusinessRules } from '@/lib/businessRules';

interface AgentCardProps {
  agent: IAgentResponse;
  onEdit: (agent: IAgentResponse) => void;
  onDelete: (id: string) => void;
}

export default function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
  // Category colors mapping based on accent palette
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Coding':
        return { bg: 'rgba(142, 182, 155, 0.15)', text: '#8EB69B' };
      case 'Writing':
        return { bg: 'rgba(218, 241, 222, 0.15)', text: '#DAF1DE' };
      case 'Support':
        return { bg: 'rgba(35, 83, 71, 0.3)', text: '#8EB69B' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--text-muted)' };
    }
  };

  const catStyle = getCategoryColor(agent.category);
  const rules = getBusinessRules(agent.category);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group surface-card rounded-xl p-5 sm:p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border border-[var(--border)] hover:border-[var(--accent)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span
            className="px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full uppercase"
            style={{ background: catStyle.bg, color: catStyle.text }}
          >
            {agent.category}
          </span>
          {rules.badges.map((badge, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full uppercase"
              style={{ background: 'rgba(218, 241, 222, 0.1)', color: '#DAF1DE', border: '1px solid rgba(218, 241, 222, 0.2)' }}
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="flex gap-1 -mt-1 -mr-1">
          <button
            onClick={() => onEdit(agent)}
            className="p-2 rounded-md transition-all hover:bg-[rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label={`Edit ${agent.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(agent.id)}
            className="p-2 rounded-md transition-all hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444] focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
            style={{ color: 'var(--text-muted)' }}
            aria-label={`Delete ${agent.name}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold truncate mb-1" style={{ color: 'var(--text-light)' }}>
        {agent.name}
      </h3>
      <p className="text-sm font-medium mb-4 truncate" style={{ color: 'var(--accent)' }}>
        {agent.pricingModel}
      </p>
      
      <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--text-light)', opacity: 0.7 }}>
        {agent.description}
      </p>

      {/* Business Fields */}
      <div className="flex flex-col gap-3 mb-6 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Business Problem</span>
          <span className="text-sm text-[var(--text-light)]">{rules.problem}</span>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Expected Outcome</span>
          <span className="text-sm text-[var(--accent)] font-medium">{rules.outcome}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-[rgba(255,255,255,0.05)]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Difficulty</span>
            <span className="text-sm text-[var(--text-light)]">{rules.difficulty}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Estimated ROI</span>
            <span className="text-sm text-[var(--accent)] font-medium">{rules.roi}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Tech Stack</span>
            <span className="text-sm text-[var(--text-light)]">{rules.techStack}</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Team Size</span>
            <span className="text-sm text-[var(--text-light)]">{rules.teamSize}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-2">Recommended For</span>
        <div className="flex flex-wrap gap-2">
          {rules.recommendedFor.map((rec, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-light)]"
            >
              {rec}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href={`/dashboard/agents/${agent.id}`}
          className="text-sm font-semibold transition-colors hover:text-white flex items-center gap-1.5 group w-fit"
          style={{ color: 'var(--accent)' }}
        >
          View Details
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
