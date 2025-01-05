import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request) {
  const orders = await prisma.order.findMany({
    include: { orderItems: true },
  });
  return NextResponse.json(orders);
}

export async function POST(request) {
  const body = await request.json();
  const order = await prisma.order.create({
    data: {
      userId: body.userId,
      totalAmount: body.totalAmount,
      status: body.status,
      orderItems: {
        create: body.orderItems,
      },
    },
    include: { orderItems: true },
  });
  return NextResponse.json(order);
}

