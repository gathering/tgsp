import { useState } from "react";

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
import MaterialLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import prisma from "utils/prisma";
import { useRouter } from "next/router";

import CreateVmDialog from "components/createvmdialog";

function createData(id, name, type, createdAt) {
  return { id, name, type, createdAt };
}

const rows = [
  createData("TGSPUUID1", "UUID", "Ubuntu 22.04 - Large", "2023-02-28 20:00"),
  createData("TGSPUUID2", "UUID", "Minecraft", "2023-02-28 21:00"),
];

export async function getServerSideProps(context) {
  const templates = await prisma.VirtualServerTemplate.findMany();
  const servers = await prisma.VirtualServer.findMany({
    where: { userId: "1" },
  });

  return {
    props: { templates },
  };
}

export default function Index({ user, templates }) {
  const router = useRouter();
  const [openVmDialog, setOpenVmDialog] = useState(false);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={6}>
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
          </Card>
        </Grid>
        <Grid item md={6}>
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
                Coming soon - stay tuned!
              </Typography>
            </CardContent>
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
          </Card>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Typography variant="h4" sx={{ marginLeft: 1, marginTop: 1 }}>
          My Servers
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <MaterialLink href={`/virtualserver/${row.id}`}>
                    {row.name}
                  </MaterialLink>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateVmDialog
        user={user}
        templates={templates}
        openVmDialog={openVmDialog}
        setOpenVmDialog={setOpenVmDialog}
      />
    </>
  );
}
