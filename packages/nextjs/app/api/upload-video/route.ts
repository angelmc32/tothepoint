import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import prisma from "~~/services/prisma";
import supabase from "~~/services/supabase";

export const dynamic = "force-dynamic";

const supabaseApiUrl = process.env.SUPABASE_API_URL ?? "";
const cdnUrl = `${supabaseApiUrl}/storage/v1/object/public/videos/`;

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const title: string = data.get("title") as unknown as string;
  const description: string = data.get("description") as unknown as string;
  try {
    if (!file || !title || !description) {
      return NextResponse.json(
        { error: "Missing variables in request", success: false },
        { status: 500, statusText: "Error in the server, check the console" },
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
      const post = await prisma.gmPost.create({
        data: {
          title,
          content: description,
          mediaUrl: cdnUrl + videoData?.path,
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
