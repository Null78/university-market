import prisma from "@/lib/prisma";




// get a post
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const post = await prisma.post.findUnique({
        where: {
            id,
        }
    });
  
    return Response.json(post);
}


//update post
export async function PUT(request: Request) {
    const body = await request.json();
    const postId = body.id;
    const userId = body.userId;

    // Step 1: Check if the user ID is valid
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        return new Response(JSON.stringify({ success: false, message: 'Page not found' }), { status: 404 });
    }

    // Step 2: Check if the user is an admin
    if (user.isAdmin) {
        // Admin can update the post and change the status
        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title: body.title,
                description: body.description,
                level: body.level,
                location: body.location,
                status: body.status
            }
        });

        return Response.json({ success: true, data: updatedPost });
    } else {
        // Step 3: Check if the user is a normal user
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                user: true
            }
        });

        if (!post) {
            return new Response(JSON.stringify({ success: false, message: 'Post not found' }), { status: 404 });
        }

        if (post.userId !== userId) {
            return new Response(JSON.stringify({ success: false, message: 'You do not have permission to update this post' }), { status: 403 });
        }

        // Normal user can update the post, except the status
        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title: body.title,
                description: body.description,
                level: body.level,
                location: body.location
            }
        });

        return Response.json({ success: true, data: updatedPost });
    }
}
    
  
// delete post

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
    ) {
    const id = params.id
    const deletedPost = await prisma.post.update({
    where: {
    id,
    },
    data: {
    deleted_at: new Date(),
    }
    });
    return Response.json(deletedPost);
    }
















// export async function DELETE(
//     req: Request,
//     { params, userId }: { params: { id: string }, userId?: string } // userId is now a parameter
//   ) {
//     if (!userId) {
//       return { success: false, message: 'User ID is required for deletion.' };
//     }
  
//     const id = params.id;
  
//     // Check if the user is the author of the post
//     const post = await prisma.post.findUnique({
//       where: {
//         id,
//       },
//       select: {
//         userId: true,
//       },
//     });
  
//     if (!post || post.userId !== userId) {
//       return { success: false, message: 'You are not authorized to delete this post.' };
//     }
  
//     // User can delete their own posts
//     const deletedPost = await prisma.post.update({
//       where: {
//         id,
//       },
//       data: {
//         deleted_at: new Date(),
//       },
//     });
  
//     return { success: true, data: deletedPost };
//   }
  