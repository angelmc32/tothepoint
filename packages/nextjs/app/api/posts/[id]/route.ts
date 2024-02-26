import { NextRequest, NextResponse } from "next/server";
import prisma from "~~/services/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const post = await prisma.post.findFirst({
      where: { id: id },
      include: {
        attestations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ post, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch posts", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data,
    });
    return NextResponse.json({ post: updatedPost, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch posts", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
