import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";


//get media
export async function GET(request: Request) {
  // Check if the Authorization header is present
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  try {
    let allMedia: any[];

    // User is logged in
    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      // User is admin
      if (user?.isAdmin) {
        allMedia = await prisma.media.findMany({
          where: {
            deleted_at: null,
          },
        });
      } else {
        // User is not admin
        allMedia = await prisma.media.findMany({
          where: {
            deleted_at: null,
            userId: userId,
          },
        });
      }
    } else {
      // User is not logged in
      const posts = await prisma.post.findMany({
        where: {
          status: 'APPROVED',
        },
        select: {
          id: true,
        },
      });

      const approvedPostIds = posts.map((post) => post.id);

      allMedia = await prisma.media.findMany({
        where: {
          deleted_at: null,
          
        },
      });
    }

    return Response.json({
      success: true,
      message: "",
      data: allMedia,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching media' }),
      { status: 500 }
    );
  }
}


//file upload media

export const POST = async (req: {
  body: any; formData: () => any; 
}, res: any) => {
  // Parse the incoming form data
  const formData = await req.formData();

  // Get the user ID from the form data
  const userId = formData.get("user_id");

  // Check if the user is blocked
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.isBlocked) {
    // If the user is blocked, return a JSON response with an error and a 403 status code
    return NextResponse.json({ error: "User is blocked." }, { status: 403 });
  }

  // Get the file from the form data
  const file = formData.get("file");

  // Check if a file is received
  if (!file) {
    // If no file is received, return a JSON response with an error and a 400 status code
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Replace spaces in the file name with underscores
  const filename = file.name.replaceAll(" ", "_");
  console.log(filename);

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(
      path.join(process.cwd(), "public/assets/" + filename),
      buffer
    );
    
    const newMedia = await prisma.media.create({
      data: {
        name: file.name,
        path: `/assets/${filename}`,
        size: file.size,
        mimetype: file.type,
        user: {
          connect: {
            id: userId, // Use the user ID from the request body
          },
        },
      },
    });
    return Response.json({
      success: true,
      message: "",
      data: newMedia
    });
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};