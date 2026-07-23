export function getBusinessRules(category: string) {
  switch (category) {
    case 'Coding':
      return {
        problem: 'Slow development cycles and high bug rates.',
        outcome: 'Reduce development time by 40% and improve code quality.',
        difficulty: 'Medium',
        roi: 'High',
        techStack: 'OpenAI, GitHub Copilot, Node.js',
        teamSize: '2-3 Developers',
        useCase: 'Automated Code Generation and Review',
        benefits: 'Faster time to market, reduced technical debt.',
        industries: 'Software, IT, Fintech',
        automation: 'High',
        costCategory: '$$',
        badges: ['Productivity', 'Automation'],
        recommendedFor: ['Startups', 'SMEs', 'Enterprises']
      };
    case 'Writing':
      return {
        problem: 'Inconsistent content quality and slow production.',
        outcome: 'Scale content generation by 5x while maintaining brand voice.',
        difficulty: 'Easy',
        roi: 'Medium',
        techStack: 'LangChain, OpenAI, Next.js',
        teamSize: '1 Content Strategist, 1 Developer',
        useCase: 'Drafting articles, marketing copy, and reports',
        benefits: 'Consistent messaging, higher engagement, SEO scaling.',
        industries: 'Marketing, Media, E-commerce',
        automation: 'Very High',
        costCategory: '$',
        badges: ['Productivity', 'Cost Saving'],
        recommendedFor: ['Startups', 'SMEs']
      };
    case 'Support':
      return {
        problem: 'Slow customer support response and high ticket volume.',
        outcome: 'Reduce support workload by 60% and improve CSAT.',
        difficulty: 'Easy',
        roi: 'High',
        techStack: 'OpenAI, Pinecone, Node.js',
        teamSize: '2 Developers',
        useCase: '24/7 Automated Customer Inquiry Resolution',
        benefits: 'Instant responses, reduced churn, 24/7 availability.',
        industries: 'E-commerce, SaaS, Telecom',
        automation: 'High',
        costCategory: '$$',
        badges: ['Customer Experience', 'Cost Saving'],
        recommendedFor: ['SMEs', 'Enterprises']
      };
    default:
      return {
        problem: 'Inefficient manual operations and high operational costs.',
        outcome: 'Streamline workflows and increase operational efficiency.',
        difficulty: 'Medium',
        roi: 'Medium',
        techStack: 'Python, LangChain, React',
        teamSize: '2 Developers',
        useCase: 'General Workflow Automation',
        benefits: 'Frees up human capital for strategic tasks.',
        industries: 'Various',
        automation: 'Medium',
        costCategory: '$$',
        badges: ['High Impact', 'Productivity'],
        recommendedFor: ['Startups', 'SMEs', 'Enterprises']
      };
  }
}
