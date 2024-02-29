import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface LoginRequest {
    email: string;
    password: string;
}

export async function POST(params: Request) {
    const body: LoginRequest = await params.json();

    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        }
    });

    if (user && (await bcrypt.compare(body.password, user.password))) {
        const { password, ...userWithoutPass } = user;
        const accessToken = signJwtAccessToken(userWithoutPass);
        const result = {
            ...userWithoutPass,
            accessToken,
        };
        return Response.json(result);
    } else return Response.json(null);
}