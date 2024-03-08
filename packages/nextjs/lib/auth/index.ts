import { User } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { RandomWordOptions, generateSlug } from "random-word-slugs";
import { SiweMessage } from "siwe";
import prisma from "~~/services/prisma";

const usernameSlugOptions: RandomWordOptions<3> = {
  format: "camel",
  partsOfSpeech: ["adjective", "noun", "adjective"],
  categories: {
    adjective: ["color", "appearance"],
    noun: ["animals"],
  },
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.address = token.sub;
      session.user.name = token.sub;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        let user: User;
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL ?? "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });

          if (result.success) {
            const existingUser = await prisma.user.findFirst({
              where: { id: siwe.address },
            });

            if (!existingUser) {
              user = await prisma.user.create({
                data: {
                  id: siwe.address,
                  username: generateSlug(3, usernameSlugOptions),
                },
              });
            } else {
              user = existingUser;
            }
            return {
              id: user.id,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};
