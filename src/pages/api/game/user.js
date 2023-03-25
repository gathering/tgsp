import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import nodeactyl from "nodeactyl";
import crypto from "crypto";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

const application = new nodeactyl.NodeactylApplication(
  serverRuntimeConfig.pterodactyl.url,
  serverRuntimeConfig.pterodactyl.application_key
);

export const charsets = {
  NUMBERS: "0123456789",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

function makepassword() {
  let length = 8;
  let password = "";
  let charset = charsets.NUMBERS + charsets.LOWERCASE + charsets.UPPERCASE;
  while (length--) {
    password += charset[crypto.randomInt(charset.length)];
  }
  return password;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).send({ message: "Only GET or POST requests allowed" });
    return;
  }

  if (!session || !session.user || !session.user.id) {
    res.status(401).json({ error: "You must be logged in." });
    return;
  }

  const user = await prisma.User.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
  });

  if (req.method === "GET") {
    if (!user.pterodactyl_id) {
      return res.json({ error: "User not found" });
    }
    try {
      var pterodactyl_user = await application.getUserDetails(
        user.pterodactyl_id
      );
    } catch (error) {
      return res.json({ error: "User not found" });
    } finally {
      return res.json({
        ...pterodactyl_user?.attributes,
      });
    }
  }

  if (req.method === "POST") {
    if (user.pterodactyl_id) {
      return res.json({ error: "User already exists in Pterodactyl" });
    }
    const name = user.name.split(" ");
    const password = makepassword();
    try {
      const pterodactyl_user = await application.createUser(
        user.email,
        user.username,
        name[0],
        name[name.length - 1],
        password
      );
      await prisma.User.update({
        where: {
          id: session.user.id,
        },
        data: {
          pterodactyl_id: pterodactyl_user.attributes.id,
        },
      });
      return res.json({ ...pterodactyl_user.attributes, password: password });
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
}
