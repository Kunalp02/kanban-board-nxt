import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }){
  const { id } = await params;
  console.log(id);
  if (!id) {
    return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, description, status, dueDate } = body;
    console.log("in patch req" + title, description, status, dueDate );
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
