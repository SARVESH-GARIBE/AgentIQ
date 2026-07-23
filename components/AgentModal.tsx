'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENT_CATEGORIES, AgentFormInput, IAgentResponse } from '@/types';
import { getBusinessRules } from '@/lib/businessRules';

const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  category: z.enum(AGENT_CATEGORIES),
  pricingModel: z.string().min(1, 'Pricing model is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be under 1000 characters'),
});

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (agent: IAgentResponse) => void;
  agent?: IAgentResponse | null;
  initialData?: Partial<AgentFormInput>;
}

export default function AgentModal({ isOpen, onClose, onSuccess, agent, initialData }: AgentModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [improvedPreview, setImprovedPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AgentFormInput>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: '',
      category: 'Coding',
      pricingModel: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (agent) {
        reset({
          name: agent.name,
          category: agent.category,
          pricingModel: agent.pricingModel,
          description: agent.description,
        });
      } else {
        reset({
          name: initialData?.name || '',
          category: initialData?.category || 'Coding',
          pricingModel: initialData?.pricingModel || '',
          description: initialData?.description || '',
        });
      }
      setServerError(null);
      setImprovedPreview(null);
    }
  }, [isOpen, agent, initialData, reset]);

  const onSubmit = async (data: AgentFormInput) => {
    setServerError(null);
    try {
      const isEdit = !!agent;
      const url = isEdit ? `/api/agents/${agent.id}` : '/api/agents';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message ?? 'Operation failed.');
        return;
      }

      onSuccess(json.agent);
    } catch {
      setServerError('Network error. Please try again.');
    }
  };

  const handleGenerateDescription = async (isImprovement: boolean) => {
    const { name, category, description } = getValues();
    if (!name || !category) {
      setServerError('Please enter a name and category first to generate a description.');
      return;
    }

    setIsGeneratingDesc(true);
    setServerError(null);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          category, 
          existingDescription: isImprovement ? description : undefined 
        }),
      });

      if (!res.ok) throw new Error('Failed to generate description');

      const data = await res.json();
      
      if (isImprovement) {
        setImprovedPreview(data.description);
      } else {
        setValue('description', data.description, { shouldValidate: true, shouldDirty: true });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Error generating description');
      }
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const applyImprovedDescription = () => {
    if (improvedPreview) {
      setValue('description', improvedPreview, { shouldValidate: true, shouldDirty: true });
      setImprovedPreview(null);
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
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-light)' }}>
                {agent ? 'Edit Agent' : 'Add New Agent'}
              </h2>
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

            {serverError && (
              <div className="mb-6 p-4 rounded-md text-sm animate-fade-in" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-light)' }}>Agent Name</label>
                <input
                  type="text"
                  placeholder="e.g. CodeAssistant Pro"
                  className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                  disabled={isSubmitting}
                  {...register('name')}
                />
                {errors.name && <p className="mt-1.5 text-sm" style={{ color: '#ef4444' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-light)' }}>Category</label>
                <div className="relative">
                  <select
                    className={`auth-input ${errors.category ? 'auth-input-error' : ''} appearance-none bg-[var(--bg-primary)] w-full cursor-pointer`}
                    disabled={isSubmitting}
                    {...register('category')}
                  >
                    {AGENT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4" style={{ color: 'var(--text-muted)' }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.category && <p className="mt-1.5 text-sm" style={{ color: '#ef4444' }}>{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-light)' }}>Pricing Model</label>
                <input
                  type="text"
                  placeholder="e.g. $0.01 / 1K tokens"
                  className={`auth-input ${errors.pricingModel ? 'auth-input-error' : ''}`}
                  disabled={isSubmitting}
                  {...register('pricingModel')}
                />
                {errors.pricingModel && <p className="mt-1.5 text-sm" style={{ color: '#ef4444' }}>{errors.pricingModel.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold" style={{ color: 'var(--text-light)' }}>Description</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateDescription(false)}
                      disabled={isGeneratingDesc || isSubmitting}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md bg-[rgba(218,241,222,0.1)] text-[#DAF1DE] border border-[rgba(218,241,222,0.2)] hover:bg-[rgba(218,241,222,0.15)] transition-colors disabled:opacity-50"
                    >
                      ✨ Generate with AI
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenerateDescription(true)}
                      disabled={isGeneratingDesc || isSubmitting || !watch('description')}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-md bg-[rgba(142,182,155,0.1)] text-[#8EB69B] border border-[rgba(142,182,155,0.2)] hover:bg-[rgba(142,182,155,0.15)] transition-colors disabled:opacity-50"
                    >
                      ✨ Improve
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Describe what this agent does..."
                  rows={4}
                  className={`auth-input resize-none ${errors.description ? 'auth-input-error' : ''}`}
                  disabled={isSubmitting}
                  {...register('description')}
                />
                {errors.description && <p className="mt-1.5 text-sm" style={{ color: '#ef4444' }}>{errors.description.message}</p>}
                
                {improvedPreview && (
                  <div className="mt-3 p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[var(--accent)] animate-fade-in">
                    <span className="block text-xs font-semibold text-[var(--accent)] mb-1">Preview of Improved Description:</span>
                    <p className="text-sm text-[var(--text-light)] mb-3">{improvedPreview}</p>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setImprovedPreview(null)} className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-white">Cancel</button>
                      <button type="button" onClick={applyImprovedDescription} className="text-xs px-3 py-1.5 rounded bg-[var(--accent)] text-[#051F20] font-bold">Apply Changes</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-lg mt-6 bg-[rgba(142,182,155,0.05)] border border-[rgba(142,182,155,0.2)]">
                <h3 className="text-sm font-bold tracking-wide uppercase mb-4" style={{ color: 'var(--accent)' }}>Business Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Primary Use Case</span>
                    <span className="text-sm font-medium text-[var(--text-light)]">{getBusinessRules(watch('category') || 'Coding').useCase}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Expected Benefits</span>
                    <span className="text-sm font-medium text-[var(--text-light)]">{getBusinessRules(watch('category') || 'Coding').benefits}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Suitable Industries</span>
                    <span className="text-sm font-medium text-[var(--text-light)]">{getBusinessRules(watch('category') || 'Coding').industries}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Automation Potential</span>
                    <span className="text-sm font-medium text-[var(--text-light)]">{getBusinessRules(watch('category') || 'Coding').automation}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">Estimated Cost Category</span>
                    <span className="text-sm font-medium text-[var(--text-light)]">{getBusinessRules(watch('category') || 'Coding').costCategory}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-md transition-all hover:bg-[rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-light)] border border-[var(--border)]"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-[#051F20]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      {agent ? 'Update Agent' : 'Create Agent'}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
