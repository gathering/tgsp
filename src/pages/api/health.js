import prisma from "utils/prisma";

export default async function handler(req, res) {
  await prisma.User.findFirst();
  res.status(200).json({ status: "ok" });
}
