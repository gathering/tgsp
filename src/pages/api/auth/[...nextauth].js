import NextAuth from "next-auth";
import getConfig from "next/config";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "utils/prismadb";

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
  },
  callbacks: {
    jwt({ token, account, user }) {
      if (user) {
        token.role = user?.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
