import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import prisma from "utils/prisma";
import { useRouter } from "next/router";
import CreatePterodactylUserDialog from "components/createpterodactyluserdialog";

export async function getServerSideProps(context) {
  const games = await prisma.Game.findMany();
  return {
    props: { games },
  };
}

export default function GameIndex({ user, games }) {
  const router = useRouter();
  const [openUserDialog, setOpenUserDialog] = useState(
    user.pterodactyl_id === null ? true : false
  );
  return (
    <>
      {user.pterodactyl_id === null && (
        <Alert
          sx={{ mb: 2 }}
          variant="filled"
          severity="warning"
          action={
            <Button onClick={() => setOpenUserDialog(true)} color="inherit">
              Create user
            </Button>
          }
        >
          You will need a Pterodactyl user to continue.
        </Alert>
      )}
      <Typography gutterBottom variant="h2">
        Games
      </Typography>
      <Grid container spacing={5}>
        {games.map((row) => (
          <Grid key={row.id} item md={4}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={row.img}
                alt={row.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={user.pterodactyl_id ? false : true}
                  onClick={() => router.push(`/game/${row.id}`)}
                >
                  Go
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreatePterodactylUserDialog
        user={user}
        openUserDialog={openUserDialog}
        setOpenUserDialog={setOpenUserDialog}
      />
    </>
  );
}
