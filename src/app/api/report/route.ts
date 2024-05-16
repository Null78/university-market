import prisma from "@/lib/prisma";


//get report
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url) 
    const allReports = await prisma.report.findMany({
      where: {
      type:{}
    }
    , include:{reported:true,
      reporter:true
    }, 
});
  
    return Response.json({
        success: true,
        message: "these all reports",
        data: allReports
    });
}

//create a new report
export async function POST(request: Request) {
    const body = await request.json();
    const user = await prisma.user.findUnique({
      where: {
          id: body.user_id,
      }
  });

  if (user?.isBlocked) {
      throw new Error('User is blocked');
  }
    const newReport = await prisma.report.create({
      data: {
        reporter: {
          connect: { id: body.reporter_id }
        },
        reported: { 
          connect: { id: body.reported_id }
        }, type: body.type,
      }
    });
  
    return Response.json({
      success: true,
      message: "create report succesfuly",
      data: newReport
    });
  }


