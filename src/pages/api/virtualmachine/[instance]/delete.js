// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

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

  const server = await prisma.VirtualServer.findUniqueOrThrow({
    where: { id: parseInt(req.query.instance) },
    select: {
      id: true,
      userId: true,
      orcId: true,
    },
  });

  if (server.userId !== user.id) {
    return res.status(403).send({ message: "Not allowed to access this VM" });
  }

  try {
    const response = await axios({
      method: "DELETE",
      url: `${serverRuntimeConfig.orc.url}/instance/${server.orcId}`,
      headers: {
        Authorization: `Token ${serverRuntimeConfig.orc.token}`,
      },
    });
    await prisma.VirtualServer.delete({
      where: {
        id: server.id,
      },
    });
    return res.json({
      status: response.data?.status,
    });
  } catch (e) {
    console.log(e.response?.data);
    return res
      .status(500)
      .send({ error: "Failed to delete", message: "Something went wrong" });
  }
}
