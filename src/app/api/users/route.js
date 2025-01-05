import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';



export async function POST(request) {
  const body = await request.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      passwordHash: hashedPassword,
    },
  });
  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
}


