import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "~~/lib/auth";
import prisma from "~~/services/prisma";
import supabase from "~~/services/supabase";

const supabaseApiUrl = process.env.SUPABASE_API_URL ?? "";
const cdnUrl = `${supabaseApiUrl}/storage/v1/object/public/videos/`;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        attestations: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ posts, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch posts", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const title: string = data.get("title") as unknown as string;
  const description: string = data.get("description") as unknown as string;
  const connectedAddress: string = data.get("connectedAddress") as unknown as string;

  if (!file || !title || !description || !connectedAddress) {
    return NextResponse.json(
      { error: "Missing variables in request", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }

  try {
    // TODO: add typing to extract session.address
    // (extend Session type to include desired property)
    const session = await getServerSession(authOptions);
    const sessionAddress = session?.user?.name;

    if (!session || !sessionAddress) {
      return NextResponse.json(
        {
          error: "Not authenticated, please login",
          success: false,
        },
        { status: 403, statusText: "Not authenticated, please login" },
      );
    }
    if (sessionAddress !== connectedAddress) {
      return NextResponse.json(
        {
          error: "Connected address is not authorized, please reauthenticate (logout, then login again)",
          success: false,
        },
        { status: 403, statusText: "Not authorized" },
      );
    }

    const { data: videoData, error } = await supabase.storage
      .from("videos")
      .upload(uuidv4() + path.extname(file.name), file);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An error occurred while uploading to Supabase", success: false },
        { status: 500, statusText: "Error in the server, check the console" },
      );
    } else {
      const post = await prisma.post.create({
        data: {
          title,
          content: description,
          mediaUrl: cdnUrl + videoData?.path,
          author: sessionAddress,
        },
      });
      return NextResponse.json({ post, message: "Post was created successfully", success: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
