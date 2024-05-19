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
        },
        include: {
            postMedia: {
                include: {
                    media: true
                }
            },
            user: true,
        }
    });
  
    return Response.json(post);
}

//updatepost
export async function PUT(request: Request) {
    const body = await request.json();

      const updatedPost = await prisma.post.update({
        where: {
          id: body.id,
        },
        data: {
          title: body.title,
          description: body.description,
          level: body.level,
          location: body.location,
          status: 'PENDING',
        },
      });

      return Response.json({updatedPost});
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