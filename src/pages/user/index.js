import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// ^ssh-[^\s]* AAAA[0-9A-Za-z+\/,]+ (.*)$

export default function User({ user }) {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item md={8}>
        <Typography variant="h4">Account settings for {user.name}</Typography>
        <Typography sx={{ mt: 2 }}>
          If no username is provided, the default username &quot;tg&quot; will
          be used for SSH access.
        </Typography>
        <TextField sx={{ mt: 2 }} fullWidth label="Default Username" />
        <Typography sx={{ mt: 2 }}>
          If you&apos;re an experienced user, you can take advantage of SSH
          Key-Based Authentication for secure SSH access to your server. When
          you set up authorized_keys, no auto-generated password is created.
          Please note that we currently do not validate the key. We support
          ssh-rsa or ssh-ed25519 public keys.
        </Typography>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="~/.ssh/authorized_keys"
          multiline
          rows={4}
        />
        <Typography sx={{ mt: 2 }}>
          Note: Changes done here will only apply on new servers.
        </Typography>
        <Button sx={{ mt: 1 }} color="success" variant="outlined" size="large">
          Save
        </Button>
      </Grid>
    </Grid>
  );
}
