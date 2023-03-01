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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import MaterialLink from "@mui/material/Link";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Grid from "@mui/material/Grid";

function createData(id, name, type, createdAt) {
  return { id, name, type, createdAt };
}

const rows = [
  createData("TGSPUUID1", "UUID", "Ubuntu 22.04 - Large", "2023-02-28 20:00"),
  createData("TGSPUUID2", "UUID", "Minecraft", "2023-02-28 21:00"),
];

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function Index() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

      <Dialog
        fullScreen={fullScreen}
        open={openVmDialog}
        onClose={() => {
          setOpenVmDialog(false);
        }}
        aria-labelledby="Launch new Linux VM"
      >
        <DialogTitle id="vm-dialog-title">{"Launch new Linux VM"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To get started, simply choose a size and template that best fits
            your needs.
          </DialogContentText>
          <DialogContentText sx={{ pt: 1 }}>
            Upon creating the instance, you will receive a username and password
            to access it. You can modify the password at any time to ensure the
            security of your account.
          </DialogContentText>
          <DialogContentText sx={{ pt: 1 }}>
            All Virtual Machines receive both public IPv4 and IPv6 addresses, as
            well as 60 GB of SSD storage.
          </DialogContentText>
          <TextField
            sx={{ mt: 2 }}
            margin="normal"
            id="name"
            label="Instance name"
            fullWidth
            defaultValue="vm-asdadat"
            variant="filled"
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>VM Template</InputLabel>
            <Select label="Instance Size" variant="filled">
              <MenuItem value={20}>Debian 11 (bullseye)</MenuItem>
              <MenuItem value={10}>Ubuntu 22.04 (Jammy Jellyfish)</MenuItem>
              <MenuItem value={10}>Rocky Linux 9</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>VM Size</InputLabel>
            <Select label="Instance Size" variant="filled">
              <MenuItem value={10}>Medium (2 vCPU & 4 GB Memory)</MenuItem>
              <MenuItem value={20}>Large (4 vCPU & 8 GB Memory)</MenuItem>
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              sx={{ mt: 2 }}
              control={<Checkbox />}
              label="I acknowledge that I am accepting the conditions of using this service and that all data will be permanently deleted on Sunday April 9th, 2023 at 06:00"
            />
          </FormGroup>
          <DialogContentText sx={{ pt: 1 }}>
            This VM will use all 8 available credits.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenVmDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenVmDialog(false);
            }}
          >
            Launch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
