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

//updatepost

export async function PUT(id: string, data: { title: any; description: any;  }) {
    const updatedPost = await prisma.post.update({
      where: {
       id: "cluhjxrxg00027zyc36au8bh1", 
      },
      data: {
        title: "hello",
        description: "2",
        
      }
    });
  
    return Response.json(updatedPost);
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