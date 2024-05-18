import prisma from "@/lib/prisma";


// get a media
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const media = await prisma.media.findUnique({
        where: {
            id,
        }
    });
  
    return Response.json(media);
}

// delete media
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const deletedMedia = await prisma.media.update({
        where: {
            id,
        },
        data: {
            deleted_at: new Date(),
        }
    });

    return Response.json(deletedMedia);
}