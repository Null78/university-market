import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";


//get media
export async function GET(request: Request) {
  const { pathname, searchParams } = new URL(request.url);
  const pathParts = pathname.split('/');
  const userId = pathParts[pathParts.length - 1];

  // Check if the user is an admin or blocked
  const user = await prisma.user.findUnique({
      where: {
          id: userId
      },
      select: {
          isAdmin: true,
          isBlocked: true
      }
  });

  if (!userId) {
      return NextResponse.json({
          success: false,
          message: 'User ID is required',
          data: null
      }, { status: 400 });
  }

  // If the user is blocked, return an error
  if (user?.isBlocked) {
      return NextResponse.json({
          success: false,
          message: 'User is blocked and cannot access media',
          data: null
      }, { status: 403 });
  }

  let allMedia;
  if (user?.isAdmin) {
      // If the user is an admin, fetch all media regardless of the userId
      allMedia = await prisma.media.findMany({
          where: {
              deleted_at: null
          }
      });
  } else {
      // If the user is not an admin, fetch media only for the specified userId
      allMedia = await prisma.media.findMany({
          where: {
              userId: userId,
              deleted_at: null
          }
      });
  }

  return NextResponse.json({
      success: true,
      message: '',
      data: allMedia
  });
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