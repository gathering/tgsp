// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import nodeactyl from "nodeactyl";
import prisma from "utils/prisma";
import crypto from "crypto";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

const application = new nodeactyl.NodeactylApplication(
  serverRuntimeConfig.pterodactyl.url,
  serverRuntimeConfig.pterodactyl.application_key
);

export const charsets = {
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
};

function makehostname(template) {
  let length = 5;
  let hostname = `${template.name} - `;
  let charset = charsets.LOWERCASE;
  while (length--) {
    hostname += charset[crypto.randomInt(charset.length)];
  }
  return hostname;
}

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

  const servers = await prisma.VirtualServer.aggregate({
    _sum: {
      cost: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  const game_servers = await prisma.GameServer.aggregate({
    _sum: {
      cost: true,
    },
    where: {
      userId: session.user.id,
    },
  });

  const template = await prisma.GameServerTemplate.findUniqueOrThrow({
    where: {
      id: body.template,
    },
  });

  if (
    user.credits -
      servers["_sum"]["cost"] -
      game_servers["_sum"]["cost"] -
      template.cost <
    0
  ) {
    return res.status(400).json({
      error: "No credits",
    });
  }

  const server = await prisma.GameServer.create({
    data: {
      userId: user.id,
      cost: template.cost ?? 1,
      gameServerTemplateId: template.id,
      name: makehostname(template),
    },
  });

  const ServerBuilder = nodeactyl.ServerBuilder;
  let json = {
    name: server.name,
    user: user.pterodactyl_id,
    egg: template.egg,
    docker_image: template.docker_image,
    limits: template.limits,
    startup: template.startup,
    feature_limits: template.feature_limits,
    environment: template.environment,
    allocation: template.allocation,
    deploy: template.deploy,
    start_on_completion: true,
  };

  let ptero_server = await new ServerBuilder(json)
    .createServer(application)
    .then((response) => {
      return response.attributes;
    });

  await prisma.GameServer.update({
    where: {
      id: server.id,
    },
    data: {
      pterodactyl_id: ptero_server.id,
    },
  });

  return res.json({ ...server });
}
