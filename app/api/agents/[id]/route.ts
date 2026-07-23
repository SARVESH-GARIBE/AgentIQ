import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { getAuthUser } from '@/lib/getAuthUser';
import { AGENT_CATEGORIES } from '@/types';

const updateAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  category: z.enum(AGENT_CATEGORIES),
  pricingModel: z.string().min(1, 'Pricing model is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be under 1000 characters'),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const agent = await Agent.findById(params.id);
    
    if (!agent) {
      return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
    }

    if (agent.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const agentObj = agent.toObject();
    const id = agentObj._id.toString();
    delete agentObj._id;
    delete agentObj.__v;
    return NextResponse.json({ success: true, agent: { id, ...agentObj } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const agent = await Agent.findById(params.id);
    
    if (!agent) {
      return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
    }

    if (agent.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    agent.name = parsed.data.name;
    agent.category = parsed.data.category;
    agent.pricingModel = parsed.data.pricingModel;
    agent.description = parsed.data.description;
    
    await agent.save();

    const agentObj = agent.toObject();
    const id = agentObj._id.toString();
    delete agentObj._id;
    delete agentObj.__v;
    return NextResponse.json({ success: true, agent: { id, ...agentObj } }, { status: 200 });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const agent = await Agent.findById(params.id);
    
    if (!agent) {
      return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
    }

    if (agent.userId.toString() !== user.userId) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await agent.deleteOne();

    return NextResponse.json({ success: true, message: 'Agent deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
