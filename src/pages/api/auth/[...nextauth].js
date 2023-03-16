import NextAuth from "next-auth";
import getConfig from "next/config";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "utils/prisma";

const { serverRuntimeConfig } = getConfig();

export const authOptions = {
  secret: serverRuntimeConfig.nextauth_secret,
  adapter: PrismaAdapter(prisma),
  debug: false,
  providers: [
    {
      id: serverRuntimeConfig.nextauth.client_nameid,
      name: serverRuntimeConfig.nextauth.client_name,
      type: "oauth",
      clientId: serverRuntimeConfig.nextauth.client_id,
      clientSecret: serverRuntimeConfig.nextauth.client_secret,
      authorization: {
        url: serverRuntimeConfig.nextauth.client_authorization_url,
        params: {
          grant_type: "authorization-code",
          response_type: "code",
          scope: "identity email",
        },
      },
      token: serverRuntimeConfig.nextauth.client_token_url,
      userinfo: serverRuntimeConfig.nextauth.client_userinfo_url,
      profile(profile) {
        return {
          id: profile?.uuid,
          name: profile?.display_name,
          email: profile?.email,
          username: profile?.username,
          role: profile?.role["value"],
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    jwt({ token, account, user }) {
      if (user) {
        token.id = user?.id;
        token.role = user?.role;
        token.username = user?.username;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token?.id;
      session.user.role = token?.role;
      session.user.username = token?.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);
