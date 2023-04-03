import { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import getConfig from "next/config";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// ^ssh-[^\s]* AAAA[0-9A-Za-z+\/,]+ (.*)$

export default function User({ user }) {
  const { publicRuntimeConfig } = getConfig();
  const [userData, setUserData] = useState(user);
  const [userError, setUserError] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);

  const updateUser = async () => {
    const response = await fetch(`${publicRuntimeConfig.url}/api/user/update`, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(userData),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.log(data);
    } else {
      setSnackOpen(true);
    }
  };

  const validateUsername = (username) => {
    if (username === "") {
      setUserError({ ...userError, default_username: false });
      return;
    }
    // ^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$
    // https://unix.stackexchange.com/a/435120
    const regex = new RegExp("^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}$)$");
    setUserError({ ...userError, default_username: !regex.test(username) });
  };

  const validateAuthorized_keys = (authorized_keys) => {
    if (authorized_keys === "") {
      setUserError({ ...userError, authorized_keys: false });
      return;
    }
    // ^ssh-[^\s]* AAAA[0-9A-Za-z+\/,]+ (.*)$
    //const regex = new RegExp("^ssh-[^s]* AAAA[0-9A-Za-z+/,]+", "m");
    setUserError({
      ...userError,
      //authorized_keys: !regex.test(authorized_keys),
      authorized_keys: false,
    });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item md={8}>
        <Typography variant="h4">User</Typography>
        <Typography sx={{ mt: 2 }}>
          If no username is provided, the default username &quot;tg&quot; will
          be used for SSH access.
        </Typography>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="Default Username"
          value={userData.default_username ?? ""}
          onChange={(e) => {
            validateUsername(e.target.value.toLowerCase());
            setUserData({
              ...userData,
              default_username: e.target.value.toLowerCase(),
            });
          }}
          error={userError["default_username"]}
          helperText={userError["default_username"] ? "Invalid username" : null}
        />
        <Typography sx={{ mt: 2 }}>
          If you&apos;re an experienced user, you can take advantage of SSH
          Key-Based Authentication for secure SSH access to your server. When
          you set up authorized_keys, no auto-generated password is created.
          <br />
          Our system supports ssh-rsa or ssh-ed25519 public keys, which should
          be listed separately with a new line for each key.
        </Typography>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="~/.ssh/authorized_keys"
          multiline
          rows={4}
          value={userData.authorized_keys ?? ""}
          onChange={(e) => {
            validateAuthorized_keys(e.target.value);
            setUserData({ ...userData, authorized_keys: e.target.value });
          }}
          error={userError["authorized_keys"]}
          helperText={
            userError["authorized_keys"] ? "Invalid public ssh keys" : null
          }
        />
        <Typography sx={{ mt: 2 }}>
          Please note that any changes made here will only be applicable to new
          servers.
        </Typography>
        <Button
          sx={{ mt: 1 }}
          color="success"
          variant="outlined"
          size="large"
          onClick={() => updateUser()}
        >
          Save
        </Button>
      </Grid>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Success</AlertTitle>
        </Alert>
      </Snackbar>
    </Grid>
  );
}
