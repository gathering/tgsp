import { useState } from "react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import prisma from "utils/prisma";
import { useRouter } from "next/router";
import Link from "next/link";
import CreateVmDialog from "components/createvmdialog";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const templates = await prisma.VirtualServerTemplate.findMany();
  const servers = await prisma.VirtualServer.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      virtualServerSize: true,
      virtualServerTemplate: true,
    },
  });

  const game_servers = await prisma.GameServer.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      gameServerTemplate: true,
    },
  });

  return {
    props: { templates, servers, game_servers },
  };
}

export default function Index({ user, templates, servers, game_servers }) {
  const router = useRouter();
  const [openVmDialog, setOpenVmDialog] = useState(false);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="/linux.jpg"
              alt="virtual server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Virtual Server
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unlock the power of Linux with our virtual machine hosting
                service!
              </Typography>
            </CardContent>
            {publicRuntimeConfig?.vm_enabled === "true" && (
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    setOpenVmDialog(true);
                  }}
                >
                  Launch new
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
        {/* <Grid item md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="/game.jpg"
              alt="game server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Game Servers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preconfigured game servers ready for use!
              </Typography>
            </CardContent>
            {publicRuntimeConfig?.game_enabled === "true" && (
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    router.push("/game");
                  }}
                >
                  See available games
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid> */}
      </Grid>
      {servers.length >= 1 && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Typography variant="h4" sx={{ marginLeft: 1, marginTop: 1 }}>
            My Virtual Servers
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <Button
                      href={`/vm/${row.id}`}
                      LinkComponent={Link} // NextJS Link
                    >
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell>{row.virtualServerTemplate.name}</TableCell>
                  <TableCell>{row.virtualServerSize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {game_servers.length >= 1 && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Typography variant="h4" sx={{ marginLeft: 1, marginTop: 1 }}>
            My Game Servers
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {game_servers.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <Button
                      href={`/game/server/${row.id}`}
                      LinkComponent={Link} // NextJS Link
                    >
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell>{row.gameServerTemplate.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <CreateVmDialog
        user={user}
        templates={templates}
        openVmDialog={openVmDialog}
        setOpenVmDialog={setOpenVmDialog}
      />
    </>
  );
}
