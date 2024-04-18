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

interface ErrorsResponse {
  first_name?: string;
  last_name?: string;
  gender?: boolean;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const errors: ErrorsResponse = {};

  if (body.password !== body.confirm_password) {
    errors.confirm_password = "Passwords do not match";
  }

  if (await prisma.user.findUnique({ where: { email: body.email } })) {
    errors.email = "Email already used";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({
      success: false,
      message: "Validation failed",
      errors,
    }, { status: 400 });
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
  return Response.json({
    success: true,
    message: "User created successfully",
    user: userWithoutPass,
  });
}