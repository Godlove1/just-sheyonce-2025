import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const body = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Instead of creating a JWT, we'll just return some user data
  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
}
