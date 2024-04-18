import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";


//get media
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url) // 
    const allMedia = await prisma.media.findMany({
        where: {
            deleted_at: null,
        }
    });
  
    return Response.json({
        success: true,
        message: "",
        data: allMedia
    });

}

//file upload media

export const POST = async (req: {
    body: any; formData: () => any; 
}, res: any) => {
    // Parse the incoming form data
    const formData = await req.formData();
  
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
              id: formData.get("user_id"), // Access user ID from request body
            },
          },
        },
      });
      return Response.json({
        success: true,
        message: "",
        data: newMedia
    });
     
  
  
      // Return a JSON response with a success message and a 201 status code
      return NextResponse.json({ Message: "Success", status: 201,name: newMedia.name,
      path: newMedia.path,
      size: newMedia.size,
      mimetype: newMedia.mimetype});
    } catch (error) {
      // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
      console.log("Error occurred ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
      
    }
    finally {
        console.log("Execution completed.");
      }
      
  };

