import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~~/lib/auth";
import prisma from "~~/services/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const attestations = await prisma.attestation.findMany({ orderBy: { createdAt: "desc" }, include: { post: true } });
    return NextResponse.json({ attestations, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch attestations", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const {
    attestationId,
    txId,
    chain,
    schemaId,
    attester,
    recipient,
    emotion,
    impact,
    attesterRole,
    category,
    postId,
    connectedAddress,
  } = data;

  if (
    !txId ||
    !chain ||
    !schemaId ||
    !attester ||
    !recipient ||
    !emotion ||
    !impact ||
    !attesterRole ||
    !category ||
    !postId ||
    !connectedAddress
  ) {
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
        { error: "Not authenticated, please login", success: false },
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

    // const attestation = await prisma.attestation.create({
    //   data: {
    //     id: txId,
    //     txId,
    //     chain,
    //     schemaId,
    //     attester,
    //     recipient,
    //     emotion,
    //     impact,
    //     attesterRole,
    //     category,
    //     postId,
    //   },
    // });

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        attestations: {
          create: [
            {
              id: attestationId,
              txId,
              chain,
              schemaId,
              attester,
              recipient,
              emotion,
              impact,
              attesterRole,
              category,
            },
          ],
        },
        attesters: {
          push: attester,
        },
      },
      include: {
        attestations: true,
      },
    });

    return NextResponse.json({ updatedPost, message: "Attestation was created successfully", success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500, statusText: "Error in the server, check the console" },
    );
  }
}
