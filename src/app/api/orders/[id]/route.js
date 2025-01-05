import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(params.id) },
    include: { orderItems: true },
  });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const order = await prisma.order.update({
    where: { id: parseInt(params.id) },
    data: {
      status: body.status,
      totalAmount: body.totalAmount,
      orderItems: {
        upsert: body.orderItems.map(item => ({
          where: { id: item.id || 0 },
          update: { quantity: item.quantity, price: item.price },
          create: { productId: item.productId, quantity: item.quantity, price: item.price },
        })),
      },
    },
    include: { orderItems: true },
  });
  return NextResponse.json(order);
}

