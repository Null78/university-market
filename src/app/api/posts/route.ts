import prisma from "@/lib/prisma";

// get all posts
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url) // get query params like ?search=hello
    const allPosts = await prisma.post.findMany({
        where: {
            deleted_at: null,
        }
    });
  
    return Response.json({
        success: true,
        message: "",
        data: allPosts
    });
}

// create a new post
export async function POST(request: Request) {
    const body = await request.json();
    
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

    return Response.json({
        success: true,
        message: "",
        data: newPost
    });
}