import { withAuth } from "next-auth/middleware";

const ROLES_ALLOWED_TO_AUTH = ["crew", "participant"];

export default withAuth({
  callbacks: {
    authorized: ({ token }) =>
      token?.role !== undefined && ROLES_ALLOWED_TO_AUTH.includes(token.role),
  },
});
