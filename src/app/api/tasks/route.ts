import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken, getUserFromTokenString } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Task } from '@/types/task';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req); 

    if (!user || typeof user !== 'object' || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { title, description, status, dueDate, assigneeId } = await req.json();

    if (!title || !status || !dueDate || !assigneeId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status, 
        dueDate: new Date(dueDate),
        createdBy: user.id,
        assigneeId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error('Task creation failed:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function GET(_req: NextRequest) {
    try {
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
  
      if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
      const user = getUserFromTokenString(token);
  
      if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  
      const tasks = await prisma.task.findMany({
        where: user.role === 'ADMIN' ? {} : { assigneeId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: {
            select: { name: true },
          },
        },
      });

      const formatted: Task[] = tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status,
        dueDate: task.dueDate.toISOString(), 
        assigneeId: task.assigneeId,
        assigneeName: task.assignee?.name ?? 'Unassigned', 
      }));
      
      
      return NextResponse.json(formatted);
  
    } catch (err) {
      console.error('Fetching tasks failed:', err);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }

