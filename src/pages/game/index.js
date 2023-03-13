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
import Grid from "@mui/material/Grid";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function GameIndex() {
  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={4}>
          <Card>
            <CardMedia
              component="img"
              height="150"
              image="https://assets-prd.ignimgs.com/2021/12/14/minecraft-1639513933156.jpg"
              alt="virtual server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Minecraft
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The classic game from Mojang.
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="outlined">
                Start
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardMedia
              component="img"
              height="150"
              image="https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg?t=1676365340"
              alt="virtual server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Valheim
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valheim is an survival and sandbox video game
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="outlined">
                Start
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardMedia
              component="img"
              height="150"
              image="https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg?t=1641233427"
              alt="virtual server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                CS GO
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The classic
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="outlined">
                Start
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardMedia
              component="img"
              height="150"
              image="https://staticctf.ubisoft.com/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7A6P3TspEsvt1VP2aHjQRt/c3c411f53ea09ac4ecc4a925738f19c5/Header.jpg"
              alt="virtual server"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                Trackmania
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experience the thrills of racing and the joy of creation with
                Trackmania!
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" variant="outlined">
                Start
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}