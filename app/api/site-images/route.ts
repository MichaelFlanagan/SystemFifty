import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    let siteImages = await prisma.siteImages.findFirst();

    // Create default if doesn't exist
    if (!siteImages) {
      siteImages = await prisma.siteImages.create({
        data: {
          historyUrl: null,
          historyTitle: "History",
          lineGraphUrl: null,
          lineGraphTitle: "Line Graph",
          roiUrl: null,
          roiTitle: "ROI",
        },
      });
    }

    return NextResponse.json(siteImages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch site images" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get or create the site images record
    let siteImages = await prisma.siteImages.findFirst();

    if (!siteImages) {
      siteImages = await prisma.siteImages.create({
        data: {
          historyUrl: body.historyUrl,
          historyTitle: body.historyTitle ?? "History",
          lineGraphUrl: body.lineGraphUrl,
          lineGraphTitle: body.lineGraphTitle ?? "Line Graph",
          roiUrl: body.roiUrl,
          roiTitle: body.roiTitle ?? "ROI",
        },
      });
    } else {
      siteImages = await prisma.siteImages.update({
        where: { id: siteImages.id },
        data: {
          historyUrl: body.historyUrl ?? siteImages.historyUrl,
          historyTitle: body.historyTitle ?? siteImages.historyTitle,
          lineGraphUrl: body.lineGraphUrl ?? siteImages.lineGraphUrl,
          lineGraphTitle: body.lineGraphTitle ?? siteImages.lineGraphTitle,
          roiUrl: body.roiUrl ?? siteImages.roiUrl,
          roiTitle: body.roiTitle ?? siteImages.roiTitle,
        },
      });
    }

    return NextResponse.json(siteImages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update site images" },
      { status: 500 }
    );
  }
}
