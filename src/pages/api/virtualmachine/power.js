// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import crypto from "crypto";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const body = req.body;

  // Action
  // reboot
  // power-on
  // power-off

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
}
