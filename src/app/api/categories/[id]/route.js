import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(params.id) },
    include: { products: true },
  });
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const category = await prisma.category.update({
    where: { id: parseInt(params.id) },
    data: {
      name: body.name,
      description: body.description,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(request, { params }) {
  await prisma.category.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: 'Category deleted successfully' });
}

