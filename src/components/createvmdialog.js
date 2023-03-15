import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useTheme } from "@mui/material/styles";
import getConfig from "next/config";
import { useRouter } from "next/router";

export default function CreateVmDialog({
  templates,
  openVmDialog,
  setOpenVmDialog,
  user,
}) {
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [vmConfig, setVmConfig] = useState({
    vm_template: "",
    vm_size: "",
    terms: false,
  });

  const createVm = async () => {
    const response = await fetch(
      `${publicRuntimeConfig.url}/api/virtualmachine/create`,
      {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(vmConfig),
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
      router.push(`/vm/${data.id}`);
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [selectedSize, setSelectedSize] = useState({});

  return (
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
          To get started, simply choose a size and template that best fits your
          needs.
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
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>VM Template</InputLabel>
          <Select
            label="VM Template"
            variant="filled"
            value={vmConfig.vm_template}
            onChange={(e) => {
              let template = templates.find((x) => x.id === e.target.value);
              setSelectedTemplate(template);
              setSelectedSize(template.sizes[0]);
              setVmConfig({
                ...vmConfig,
                vm_template: template.id,
                vm_size: template.sizes[0].id,
              });
            }}
          >
            {templates.map((template) => {
              return (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              );
            })}
            {templates.length <= 0 && (
              <MenuItem disabled key="null" value="null">
                There are currently no templates accessible at the moment.
                Please try again later.
              </MenuItem>
            )}
          </Select>
        </FormControl>
        {vmConfig.vm_template !== "" && (
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>VM Size</InputLabel>
            <Select
              label="VM Size"
              variant="filled"
              value={vmConfig.vm_size}
              onChange={(e) => {
                setSelectedSize(
                  selectedTemplate.sizes.find((x) => x.id === e.target.value)
                );
                setVmConfig({ ...vmConfig, vm_size: e.target.value });
              }}
            >
              {selectedTemplate.sizes.map((size) => {
                return (
                  <MenuItem key={size.id} value={size.id}>
                    {size.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        {vmConfig.vm_size !== "" && (
          <DialogContent sx={{ p: 0, pt: 2 }}>
            {user.credits - selectedSize.cost >= 0 && (
              <Alert severity="success">
                This virtual machine will require {selectedSize.cost} out of{" "}
                {user.credits} available credits.
              </Alert>
            )}
            {user.credits - selectedSize.cost < 0 && (
              <Alert severity="error">
                <AlertTitle>Insufficient credits available</AlertTitle>
                The selected size requires {selectedSize.cost} credits, which is
                more than the available {user.credits} credits. Please consider
                choosing a smaller size or removing a server to free up credits.
              </Alert>
            )}
          </DialogContent>
        )}
        <FormGroup>
          <FormControlLabel
            sx={{ mt: 2 }}
            control={<Checkbox />}
            label="I am accepting the conditions of using this service and that all data will be permanently deleted on Sunday April 9th, 2023 at 06:00"
            checked={vmConfig.terms}
            onChange={(e) => {
              setVmConfig({ ...vmConfig, terms: e.target.checked });
            }}
          />
          <FormLabel sx={{ mt: 1 }} component="legend">
            <Button href={"/about"} target="_blank" rel="noopener noreferrer">
              Read the terms
            </Button>
          </FormLabel>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          variant="outlined"
          size="large"
          onClick={() => {
            setOpenVmDialog(false);
          }}
        >
          Cancel
        </Button>
        <Button
          color="success"
          variant="outlined"
          size="large"
          disabled={
            vmConfig.vm_template === "" ||
            vmConfig.vm_size === "" ||
            vmConfig.terms !== true ||
            user.credits - selectedSize.cost < 0
          }
          onClick={() => {
            createVm();
          }}
        >
          Launch
        </Button>
      </DialogActions>
    </Dialog>
  );
}
