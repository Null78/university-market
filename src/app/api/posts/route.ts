import prisma from "@/lib/prisma";

// get all posts
export async function GET(request: Request) {
    // const { searchParams } = new URL(request.url) // get query params like ?search=hello
    // const allPosts = await prisma.post.findMany({
    //     where: {
    //         deletedAt: null,
    //     }
    // });
  
    // return Response.json(allPosts);
}

// create a new post
export async function POST(request: Request) {
    // const body = await request.json();
    //
    // const newPost = await prisma.post.create({
    //     data: {
    //         title: body.title,
    //         content: body.content,
    //     }
    // });
  
    // return Response.json(newPost);
}