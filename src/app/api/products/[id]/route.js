import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


export async function GET(request, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const product = await prisma.product.update({
    where: { id: parseInt(params.id) },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      stockQuantity: body.stockQuantity,
      categoryId: body.categoryId,
      images: body.images,
      availableSizes: body.availableSizes,
      hasSizes: body.hasSizes,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  await prisma.product.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: 'Product deleted successfully' });
}

