'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import type { IAgentResponse } from '@/types';
import { AGENT_CATEGORIES } from '@/types';
import AgentCard from '@/components/AgentCard';
import AgentModal from '@/components/AgentModal';
import AIAdvisorModal from '@/components/AIAdvisorModal';
import Counter from '@/components/Counter';
import { AgentFormInput } from '@/types';

export default function DashboardPage() {
  const [agents, setAgents] = useState<IAgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<IAgentResponse | null>(null);
  const [agentInitialData, setAgentInitialData] = useState<Partial<AgentFormInput> | undefined>();

  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortOrder, setSortOrder] = useState('Newest First');

  // Delete Confirmation state
  const [agentToDelete, setAgentToDelete] = useState<IAgentResponse | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/agents');
      if (!res.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      showToast('Error loading agents', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleOpenAddModal = () => {
    setEditingAgent(null);
    setAgentInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (agent: IAgentResponse) => {
    setEditingAgent(agent);
    setAgentInitialData(undefined);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedAgent: IAgentResponse) => {
    setIsModalOpen(false);
    if (editingAgent) {
      setAgents(agents.map(a => a.id === savedAgent.id ? savedAgent : a));
      showToast('Agent updated successfully');
    } else {
      setAgents([savedAgent, ...agents]);
      showToast('Agent created successfully');
    }
  };

  const handleDeleteRequest = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) setAgentToDelete(agent);
  };

  const confirmDelete = async () => {
    if (!agentToDelete) return;
    try {
      const res = await fetch(`/api/agents/${agentToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setAgents(agents.filter(a => a.id !== agentToDelete.id));
      showToast('Agent deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Error deleting agent. Please try again.', 'error');
    } finally {
      setAgentToDelete(null);
    }
  };

  const handleCreateAgentFromAdvisor = (data: Partial<AgentFormInput>) => {
    setIsAdvisorOpen(false);
    setEditingAgent(null);
    setAgentInitialData(data);
    setIsModalOpen(true);
  };

  const filteredAndSortedAgents = agents
    .filter(agent => {
      const matchesSearch = 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        agent.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || agent.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'Newest First') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === 'Oldest First') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortOrder === 'Name A-Z') return a.name.localeCompare(b.name);
      if (sortOrder === 'Name Z-A') return b.name.localeCompare(a.name);
      return 0;
    });

  const totalAgents = agents.length;
  const uniqueCategories = new Set(agents.map(a => a.category)).size;
  const sortedByCreated = [...agents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentlyCreated = sortedByCreated.length > 0 ? sortedByCreated[0].name : 'None';
  const sortedByUpdated = [...agents].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const lastUpdated = sortedByUpdated.length > 0 ? sortedByUpdated[0].name : 'None';

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-up">
          <div className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-3 text-sm font-medium ${
            toast.type === 'error' ? 'bg-[#c0392b] text-white' : 'bg-[#163832] text-[var(--text-light)] border border-[rgba(142,182,155,0.3)]'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {agentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-[#051F20]/80 backdrop-blur-sm transition-opacity" onClick={() => setAgentToDelete(null)} />
          <div className="relative surface-card w-full max-w-sm p-6 sm:p-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[rgba(239,68,68,0.1)] rounded-full text-[#ef4444]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-light)' }}>Confirm Deletion</h3>
            </div>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-light)' }}>{agentToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setAgentToDelete(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-md transition-all hover:bg-[rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ color: 'var(--text-light)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-md transition-all hover:bg-[#c0392b] focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
                style={{ background: '#ef4444', color: 'white', border: '1px solid #ef4444' }}
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: 'var(--text-light)' }}>
            My Agents
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Manage and monitor your AI workforce.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setIsAdvisorOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition-all hover:bg-[rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ color: 'var(--text-light)', border: '1px solid var(--border)' }}
            aria-label="AI Advisor"
          >
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Advisor
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAddModal}
            className="btn-primary hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
            aria-label="Add a new Agent"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Agent
          </motion.button>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {agents.length > 0 && !isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="surface-card p-4 rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Agents</span>
            <Counter value={totalAgents} className="text-2xl font-bold mt-1" style={{ color: 'var(--text-light)' }} />
          </div>
          <div className="surface-card p-4 rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Categories Used</span>
            <Counter value={uniqueCategories} className="text-2xl font-bold mt-1" style={{ color: 'var(--text-light)' }} />
          </div>
          <div className="surface-card p-4 rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Recently Created</span>
            <span className="text-lg font-bold mt-1 truncate" style={{ color: 'var(--text-light)' }}>{recentlyCreated}</span>
          </div>
          <div className="surface-card p-4 rounded-xl flex flex-col hover:shadow-lg transition-shadow duration-200">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Last Updated</span>
            <span className="text-lg font-bold mt-1 truncate" style={{ color: 'var(--text-light)' }}>{lastUpdated}</span>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      {agents.length > 0 && !isLoading && (
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#0B2B26]/50 p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-grow">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search agents by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="auth-input pl-10 w-full font-medium"
            />
          </div>
          <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0">
            <div className="relative min-w-[150px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="auth-input appearance-none bg-[var(--bg-primary)] w-full cursor-pointer font-medium"
              >
                <option value="All Categories">All Categories</option>
                {AGENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div className="relative min-w-[150px]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="auth-input appearance-none bg-[var(--bg-primary)] w-full cursor-pointer font-medium"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Name A-Z">Name A-Z</option>
                <option value="Name Z-A">Name Z-A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="surface-card h-[220px] animate-pulse p-6 flex flex-col">
              <div className="w-20 h-7 rounded-full mb-4 bg-[rgba(255,255,255,0.05)]"></div>
              <div className="w-3/4 h-7 rounded mb-3 bg-[rgba(255,255,255,0.05)]"></div>
              <div className="w-1/2 h-5 rounded mb-4 bg-[rgba(255,255,255,0.05)]"></div>
              <div className="w-full h-5 rounded mt-auto bg-[rgba(255,255,255,0.05)]"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="surface-card p-10 text-center border-[#c0392b] bg-[rgba(192,57,43,0.05)]">
          <p style={{ color: '#e57373' }} className="mb-6 font-medium">{error}</p>
          <button
            onClick={() => fetchAgents()}
            className="px-5 py-2.5 rounded-md transition-colors hover:bg-[rgba(255,255,255,0.05)] font-semibold"
            style={{ border: '1px solid var(--border)', color: 'var(--text-light)' }}
          >
            Try Again
          </button>
        </div>
      ) : agents.length === 0 ? (
        <div className="surface-card py-20 px-6 text-center animate-fade-in flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] shadow-inner">
            <Bot size={40} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-light)' }}>
            No AI solutions deployed yet
          </h3>
          <p className="max-w-md mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Your workspace is empty. Create your first autonomous agent to start building your AI workforce.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAddModal}
            className="btn-primary hover:scale-105 transition-transform duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
          >
            Create Your First Solution
          </motion.button>
        </div>
      ) : filteredAndSortedAgents.length === 0 ? (
        <div className="surface-card py-16 px-6 text-center animate-fade-in border border-dashed border-[rgba(255,255,255,0.1)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.03)]">
            <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-light)' }}>No matching solutions found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteRequest}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        agent={editingAgent}
        initialData={agentInitialData}
      />
      
      <AIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        onCreateAgent={handleCreateAgentFromAdvisor}
      />
    </div>
  );
}
