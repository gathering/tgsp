// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    res.status(401).json({ error: "You must be logged in." });
    return;
  }

  const user = await prisma.User.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const servers = await prisma.VirtualServer.aggregate({
    _sum: {
      cost: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  user.credits = user.credits - servers["_sum"]["cost"];

  return res.json({
    user,
  });
}
