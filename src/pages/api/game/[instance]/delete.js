// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import getConfig from "next/config";
import nodeactyl from "nodeactyl";

const { serverRuntimeConfig } = getConfig();

const application = new nodeactyl.NodeactylApplication(
  serverRuntimeConfig.pterodactyl.url,
  serverRuntimeConfig.pterodactyl.application_key
);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ error: "You must be logged in." });
    return;
  }

  if (req.method !== "DELETE") {
    res.status(405).send({ message: "Only DELETE requests allowed" });
    return;
  }

  const user = await prisma.User.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
  });

  const server = await prisma.GameServer.findUniqueOrThrow({
    where: { id: parseInt(req.query.instance) },
    select: {
      id: true,
      userId: true,
      pterodactyl_id: true,
    },
  });

  if (server.userId !== user.id) {
    return res
      .status(403)
      .send({ message: "Not allowed to access this Game server" });
  }

  try {
    const response = await application.deleteServer(server.pterodactyl_id);
    await prisma.GameServer.delete({
      where: {
        id: server.id,
      },
    });
    return res.json({
      status: response.data?.status,
    });
  } catch (e) {
    console.log(e);
    console.log(e.response?.data);
    return res
      .status(500)
      .send({ error: "Failed to delete", message: "Something went wrong" });
  }
}
