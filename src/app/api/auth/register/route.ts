import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  first_name: string;
  last_name: string;
  gender: boolean;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  if (body.password !== body.confirm_password) {
    return Response.json({
      success: false,
      message: "Password does not match",
    });
  }

  const user = await prisma.user.create({
    data: {
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      gender: body.gender,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...userWithoutPass } = user;
  return Response.json(userWithoutPass);
}