import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(request) {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(request) {
  const body = await request.json();

  console.log(body.name, "name of category")
  
  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description,
    },
  });
  return NextResponse.json(category);
}

