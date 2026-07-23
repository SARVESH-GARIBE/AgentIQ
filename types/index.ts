// ─── Auth ────────────────────────────────────────────────────────────────────

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Agents ──────────────────────────────────────────────────────────────────

export const AGENT_CATEGORIES = ['Coding', 'Writing', 'Support', 'Other'] as const;
export type AgentCategory = (typeof AGENT_CATEGORIES)[number];

export interface IAgentResponse {
  id: string;
  userId: string;
  name: string;
  category: AgentCategory;
  pricingModel: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentFormInput {
  name: string;
  category: AgentCategory;
  pricingModel: string;
  description: string;
}
