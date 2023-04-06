import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import getConfig from "next/config";
import prisma from "utils/prisma";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();

export async function getServerSideProps(context) {
  const game = await prisma.Game.findUniqueOrThrow({
    where: { id: parseInt(context.params.game) },
    select: {
      id: true,
      name: true,
      img: true,
      description: true,
      enabled: true,
      gameServerTemplates: true,
    },
  });

  return {
    props: {
      game,
    },
  };
}

export default function GameShow({ user, game }) {
  const router = useRouter();

  const createServer = async (template_id) => {
    const response = await fetch(`${publicRuntimeConfig.url}/api/game/create`, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ template: template_id }),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.log(data);
    } else {
      router.push(`/game/server/${data.id}`);
    }
  };

  return (
    <>
      {user.pterodactyl_id === null && (
        <Alert
          sx={{ mb: 2 }}
          variant="filled"
          severity="warning"
          action={
            <Button onClick={() => router.push("/game")} color="inherit">
              Create user
            </Button>
          }
        >
          You will need a Pterodactyl user to continue.
        </Alert>
      )}
      <Grid container pt={2} spacing={5}>
        {game.gameServerTemplates.map((row) => (
          <Grid key={row.id} item md={6}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {game.name}
                </Typography>
                <Typography gutterBottom variant="h4" component="div">
                  {row.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.description}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, pt: 1 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Cost: {row.cost} credits
                </Typography>
              </CardContent>
              <CardContent>
                {user.credits - row.cost >= 0 && (
                  <Alert severity="success">
                    This virtual machine will require {row.cost} out of{" "}
                    {user.credits} available credits.
                  </Alert>
                )}
                {user.credits - row.cost < 0 && (
                  <Alert severity="error">
                    <AlertTitle>Insufficient credits available</AlertTitle>
                    The selected game requires {row.cost} credits, which is more
                    than the available {user.credits} credits. Please consider
                    choosing a smaller size or removing a server to free up
                    credits.
                  </Alert>
                )}
              </CardContent>
              <CardActions sx={{ pb: 2 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={
                    user.pterodactyl_id && user.credits >= 1 ? false : true
                  }
                  onClick={() => createServer(row.id)}
                >
                  Start
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
