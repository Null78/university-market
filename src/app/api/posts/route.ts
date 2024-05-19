import prisma from "@/lib/prisma";
import {getToken} from 'next-auth/jwt';
import { NextRequest } from "next/server";

// get all posts
export async function GET(request: NextRequest) {
    const token = await getToken({ req: request })
    const userId = token?.sub;
    const { searchParams } = new URL(request.url) // get query params like ?search=hello
    let allPosts;
    // user is logged in
    if (userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        // user is admin
        if (user?.isAdmin) {
            allPosts = await prisma.post.findMany({
                include: {
                    postMedia: {
                        include: {
                            media: true
                        }
                    }
                }
            });
        } else {
            // user is not admin
            allPosts = await prisma.post.findMany({
                where: {
                    deleted_at: null,
                    userId: userId,
                },
                include: {
                    postMedia: {
                        include: {
                            media: true
                        }
                    }
                }
            });
        }
    } else {
        // user is not logged in
        allPosts = await prisma.post.findMany({
            where: {
                deleted_at: null,
                status: 'APPROVED',
            },
            include: {
                postMedia: {
                    include: {
                        media: true
                    }
                }
            }
        });
    }
    
    return Response.json({
        success: true,
        message: "",
        data: allPosts
    });
}

// create a new post
export async function POST(request: Request) {
    const body = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            id: body.user_id,
        }
    });

    if (user?.isBlocked) {
        throw new Error('User is blocked');
    }

    const newPost = await prisma.post.create({
        data: {
            title: body.title,
            description: body.description,
            level: body.level,
            location: body.location,
            status: 'PENDING',
            user: {
                connect: {
                    id: body.user_id
                }
            }
        }
    });

    for (const media_id of body.media) {
        await prisma.postMedia.create({
            data: {
                post: {
                    connect: {
                        id: newPost.id
                    }
                },
                media: {
                    connect: {
                        id: media_id
                    }
                }
            }
        });
    }


    return Response.json({
        success: true,
        message: "",
        data: newPost
    });
}