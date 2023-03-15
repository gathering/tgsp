// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const body = req.body;

  if (!session || !session.user) {
    res.status(401).json({ error: "You must be logged in." });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const user = await prisma.User.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
  });

  let data = {};

  // TODO Add validation for username
  // ^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$
  data["default_username"] =
    body["default_username"] && body["default_username"] !== ""
      ? body["default_username"]
      : null;

  // TODO Add some basic validation
  data["authorized_keys"] =
    body["authorized_keys"] && body["authorized_keys"] !== ""
      ? body["authorized_keys"]
      : null;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: data,
  });

  return res.json({
    data,
  });
}
