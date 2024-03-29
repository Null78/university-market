import prisma from "@/lib/prisma";

// get a post
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    // const id = params.id
    // const post = await prisma.post.findUnique({
    //     where: {
    //         id,
    //     }
    // });
  
    // return Response.json(post);
}

// update post
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    // const id = params.id
    // const body = await req.json();
    //
    // const updatedPost = await prisma.post.update({
    //     where: {
    //         id,
    //     },
    //     data: {
    //         title: body.title,
    //         content: body.content,
    //     }
    // });
  
    // return Response.json(updatedPost);
}

// delete post
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    // const id = params.id
    // const deletedPost = await prisma.post.update({
    //     where: {
    //         id,
    //     },
    //     data: {
    //         deletedAt: new Date(),
    //     }
    // });
  
    // return Response.json(deletedPost);
}