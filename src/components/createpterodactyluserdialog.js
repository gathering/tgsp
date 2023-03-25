import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import getConfig from "next/config";
import { useRouter } from "next/router";

export default function CreatePterodactylUserDialog({
  user,
  openUserDialog,
  setOpenUserDialog,
}) {
  const { publicRuntimeConfig } = getConfig();
  const router = useRouter();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [password, setPassword] = useState(null);

  const createPterodactylUser = async () => {
    const response = await fetch(`${publicRuntimeConfig.url}/api/game/user`, {
      method: "POST",
      credentials: "same-origin",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.log(data);
    } else {
      setPassword(data.password);
      setOpenUserDialog(true);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openUserDialog}
      aria-labelledby="Create Pterodactyl User"
    >
      <DialogTitle id="user-dialog-title">Create Pterodactyl User</DialogTitle>
      <DialogContent>
        {password === null && (
          <>
            <DialogContentText>
              To operate game servers, we utilize Pterodactyl.
            </DialogContentText>
            <DialogContentText>
              Therefore, in order to proceed, we&apos;ll need to generate a
              Pterodactyl account for you, accompanied by a temporary password.
            </DialogContentText>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <DialogContentText>
              Once you have set up your account, you may access the Pterodactyl
              Panel and administer your game servers.
            </DialogContentText>
          </>
        )}
        {password !== null && (
          <>
            <DialogContentText>
              Once the password is displayed, it&apos;s important to save it as
              it will only be shown once. Additionally, if needed, you can
              change the password at a later time.
            </DialogContentText>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <DialogContentText>Password: {password}</DialogContentText>
          </>
        )}
      </DialogContent>
      {password === null && (
        <DialogActions>
          <Button
            color="info"
            variant="outlined"
            size="large"
            onClick={() => {
              setOpenUserDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="success"
            variant="outlined"
            size="large"
            onClick={() => {
              createPterodactylUser();
            }}
          >
            Create user
          </Button>
        </DialogActions>
      )}
      {password !== null && (
        <DialogActions>
          <Button
            color="info"
            variant="outlined"
            size="large"
            onClick={() => {
              router.reload();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
