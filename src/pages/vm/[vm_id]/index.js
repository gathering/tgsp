import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "utils/prisma";
import axios from "axios";

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
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import getConfig from "next/config";
import { useRouter } from "next/router";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const server = await prisma.VirtualServer.findUniqueOrThrow({
    where: { id: parseInt(context.params.vm_id) },
    select: {
      id: true,
      userId: true,
      name: true,
      username: true,
      password: true,
      virtualServerSize: true,
      virtualServerTemplate: true,
      orcId: true,
    },
  });

  if (server.userId !== session.user.id) {
    context.res.statusCode = 403;
    return {
      props: { error: "No access" },
    };
  }

  const orcInstance = await axios({
    method: "GET",
    url: `${serverRuntimeConfig.orc.url}/instance/${server.orcId}`,
    headers: {
      Authorization: `Token ${serverRuntimeConfig.orc.token}`,
    },
  });

  return {
    props: {
      server,
      orcInstance: {
        ipv4: orcInstance.data.ipam_provider_state?.ip_addresses[0]?.address.replace(
          /\/([0-9]{1,3})$/gi,
          ""
        ),
        ipv6: orcInstance.data.ipam_provider_state?.ip_addresses[1]?.address.replace(
          /\/([0-9]{1,3})$/gi,
          ""
        ),
      },
    },
  };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const deleteVm = async (server_id, router) => {
  const response = await fetch(
    `${publicRuntimeConfig.url}/api/virtualmachine/${server_id}/delete`,
    {
      method: "DELETE",
      credentials: "same-origin",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    }
  );
  const data = await response.json();
  if (data.error) {
    console.log(data);
  } else {
    router.push(`/`);
  }
};

export default function ShowVm({ error, server, orcInstance }) {
  const router = useRouter();
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item md={10}>
        <Typography variant="h4">
          My Virtual Server
          <ButtonGroup size="small" variant="contained" sx={{ ml: 2, mb: 1 }}>
            <Button>Reboot</Button>
            <Button
              onClick={() => {
                deleteVm(server.id, router);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Typography>
        <Typography variant="body1">
          Below, you will find the hostname and login credentials that you need
          to connect to the server. <br />
          You must be connected to The Gathering&apos;s network for SSH to work.
          <br />
          Please note that the password provided is temporary and must be
          changed on your first login.
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell>Server Name</StyledTableCell>
                <StyledTableCell>
                  {server.name}.tg23.gathering.org
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>{server.username}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Default password</StyledTableCell>
                <StyledTableCell>{server.password}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>IPv4</StyledTableCell>
                <StyledTableCell>{orcInstance.ipv4}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>IPv6</StyledTableCell>
                <StyledTableCell>{orcInstance.ipv6}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Template</StyledTableCell>
                <StyledTableCell>
                  {server.virtualServerTemplate.name} -{" "}
                  {server.virtualServerSize}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>
                  <Chip sx={{ mr: 1 }} label="Online" color="success" />
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1">
          In order to connect to the server using SSH, you will need an SSH
          client. If you are using Windows as your operating system, PuTTY is a
          popular SSH client that you can use.
          <br /> <br />
          To connect to the server using SSH on Linux or Mac, you don&apos;t
          need to install any additional software as SSH is built-in to these
          operating systems.
        </Typography>
      </Grid>
    </Grid>
  );
}
