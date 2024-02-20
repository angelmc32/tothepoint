import { NextResponse } from "next/server";
import prisma from "~~/services/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.gmPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ posts, message: "Post was created successfully", success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch posts", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
