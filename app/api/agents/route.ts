import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { getAuthUser } from '@/lib/getAuthUser';
import { AGENT_CATEGORIES } from '@/types';

const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  category: z.enum(AGENT_CATEGORIES),
  pricingModel: z.string().min(1, 'Pricing model is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be under 1000 characters'),
});

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const agents = await Agent.find({ userId: user.userId }).sort({ createdAt: -1 });
    
    // Map _id to id for the frontend
    const mappedAgents = agents.map(a => {
      const agentObj = a.toObject();
      const id = agentObj._id.toString();
      delete agentObj._id;
      delete agentObj.__v;
      return { id, ...agentObj };
    });

    return NextResponse.json({ success: true, agents: mappedAgents }, { status: 200 });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const agent = await Agent.create({
      ...parsed.data,
      userId: user.userId,
    });

    const agentObj = agent.toObject();
    const id = agentObj._id.toString();
    delete agentObj._id;
    delete agentObj.__v;
    
    return NextResponse.json({ success: true, agent: { id, ...agentObj } }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
