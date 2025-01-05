import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";



export async function GET(request) {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const categoryId = searchParams.get('categoryId');

//   let products;
//   if (categoryId) {
//     products = await prisma.product.findMany({
//       where: { categoryId: parseInt(categoryId) },
//     });
//   } else {
//     products = await prisma.product.findMany();
//   }
//   return NextResponse.json(products);
// }

export async function POST(request) {
  const body = await request.json();
  console.log(body, "received");

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      categoryId: body.categoryId,
      images: body.images,
      availableSizes: body.sizes,
      hasSizes: body.hasSizes,
    },
  });
  return NextResponse.json(product);
}

