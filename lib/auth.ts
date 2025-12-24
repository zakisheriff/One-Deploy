
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session.user) {
                // Add user ID to session
                session.user.id = user.id;
            }
            return session;
        }
    }
};
