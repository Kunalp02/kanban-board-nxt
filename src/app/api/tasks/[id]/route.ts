import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Params is directly available in the route handler, no need for Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>
}

export async function PATCH(request: NextRequest, { params }: PageProps) {
  const { id } = await params;
  console.log("Task ID:", id);

  if (!id) {
    return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, description, status, dueDate } = body;

    console.log("In PATCH request:", title, description, status, dueDate);

    if (!title || !status || !dueDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description ?? '',
        status,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('Error updating task:', err);
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}
