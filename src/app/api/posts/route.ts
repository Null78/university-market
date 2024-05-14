import prisma from "@/lib/prisma";

// get all posts
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url) // get query params like ?search=hello
    const userId = searchParams.get('user_id');
    let allPosts;
    // user is logged in
    if (userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        // user is admin
        if (user?.isAdmin) {
            allPosts = await prisma.post.findMany();
        } else {
            // user is not admin
            allPosts = await prisma.post.findMany({
                where: {
                    deleted_at: null,
                    userId: userId,
                }
            });
        }
    } else {
        // user is not logged in
        allPosts = await prisma.post.findMany({
            where: {
                deleted_at: null,
                status: 'APPROVED',
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

    return Response.json({
        success: true,
        message: "",
        data: newPost
    });
}