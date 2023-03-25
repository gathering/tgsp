import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import nodeactyl from "nodeactyl";

import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import getConfig from "next/config";
import { useRouter } from "next/router";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const client = new nodeactyl.NodeactylClient(
    serverRuntimeConfig.pterodactyl.url,
    serverRuntimeConfig.pterodactyl.client_key
  );

  const application = new nodeactyl.NodeactylApplication(
    serverRuntimeConfig.pterodactyl.url,
    serverRuntimeConfig.pterodactyl.application_key
  );

  const server = await prisma.GameServer.findUniqueOrThrow({
    where: { id: parseInt(context.params.server_id) },
    select: {
      id: true,
      userId: true,
      name: true,
      gameServerTemplate: true,
      pterodactyl_id: true,
    },
  });

  if (server.userId !== session.user.id) {
    context.res.statusCode = 403;
    return {
      props: { error: "No access" },
    };
  }

  const pterodactyl_app_server = await application.getServerDetails(
    server.pterodactyl_id
  );

  const pterodactyl_server = await client.getServerDetails(
    pterodactyl_app_server.uuid
  );
  const status = await client.getServerStatus(pterodactyl_app_server.uuid);

  return {
    props: {
      pterodactyl_server,
      status,
      server,
    },
  };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

export default function ShowGameServer({ server, pterodactyl_server, status }) {
  const router = useRouter();
  const default_allocation =
    pterodactyl_server.relationships.allocations.data.find((allocation) => {
      return allocation?.attributes?.is_default;
    }).attributes;

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item md={10}>
        <Typography variant="h4">
          My Game Server
          <ButtonGroup size="small" variant="contained" sx={{ ml: 2, mb: 1 }}>
            <Button
              href={publicRuntimeConfig.pterodactyl.url}
              color="secondary"
            >
              Panel
            </Button>
            <Button
              onClick={() => {
                deleteServer(server.id, router);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell>Server Name</StyledTableCell>
                <StyledTableCell>{pterodactyl_server.name}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>
                  {default_allocation?.ip_alias}:{default_allocation?.port}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>{status}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
