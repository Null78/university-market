import prisma from "@/lib/prisma";




// get a report
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const report = await prisma.post.findUnique({
        where: {
            id,
        }
    });
  
    return Response.json(report);
}



