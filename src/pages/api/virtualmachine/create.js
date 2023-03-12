// Return the user making the call
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import crypto from "crypto";
import axios from "axios";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export const charsets = {
  NUMBERS: "0123456789",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

function makehostname() {
  // Todo Check that the hostname is unique
  let length = 5;
  let hostname = "vm-";
  let charset = charsets.LOWERCASE;
  while (length--) {
    hostname += charset[crypto.randomInt(charset.length)];
  }
  return hostname;
}

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

  const template = await prisma.VirtualServerTemplate.findUniqueOrThrow({
    where: {
      id: body.vm_template,
    },
  });

  const size = template.sizes.find((x) => x.id === body.vm_size);

  if (user.credits - servers["_sum"]["cost"] - size.cost <= 0) {
    return res.status(400).json({
      error: "No credits",
    });
  }

  const server = await prisma.VirtualServer.create({
    data: {
      userId: user.id,
      virtualServerTemplateId: body.vm_template,
      virtualServerSize: body.vm_size,
      name: makehostname(),
      username: "tg",
      password: makepassword(),
      cost: size.cost ?? 1,
    },
  });

  const userdata = [
    `useradd -s /usr/bin/bash -m -p $(openssl passwd -1 ${server.password}) ${server.username}`,
    `usermod -aG sudo ${server.username}`,
    "sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config",
    `echo '${server.username} ALL=(ALL) NOPASSWD: ALL' | EDITOR='tee -a' visudo`,
    `passwd --expire ${server.username}`,
    "systemctl restart sshd",
    "curl https://gist.githubusercontent.com/olemathias/ec008ef79aaae669beb298dfd99e644f/raw/a6ae39068aec0c41ce45faef8936140d9434db82/gistfile1.txt > /etc/motd",
  ];

  try {
    const response = await axios({
      method: "POST",
      url: `${serverRuntimeConfig.orc.url}/instance/`,
      headers: {
        Authorization: `Token ${serverRuntimeConfig.orc.token}`,
      },
      data: {
        platform: template.platformId,
        network: template.networkId,
        template: template.orcTemplateId,
        name: server.name,
        memory: size.memory,
        cpu_cores: size.vcpu,
        os_disk: size.disk ?? "60",
        userdata: userdata,
        tags: [
          { key: "owner", value: user.email },
          { key: "tgsp", value: "true" },
          { key: "tgsp_id", value: server.id },
        ],
      },
    });
    await prisma.VirtualServer.update({
      where: {
        id: server.id,
      },
      data: {
        orcId: response.data?.id,
      },
    });
    return res.json({
      id: server.id,
      orc: response.data?.id,
      status: response.data?.status,
    });
  } catch (e) {
    console.log(e.response?.data);
    console.log({
      platform: template.platformId,
      network: template.networkId,
      image: template.orcTemplateId,
      name: server.name,
      memory: size.memory,
      cpu_cores: size.vcpu,
      os_disk: "60",
      tags: [
        { key: "owner", value: user.email },
        { key: "tgsp", value: "true" },
        { key: "tgsp_id", value: server.id },
      ],
    });
    return res.status(500).json({
      error: "Failed to provision",
    });
  }
}
