import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Fragment, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Stack from "@mui/material/Stack";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import TokenIcon from "@mui/icons-material/Token";
import Badge from "@mui/material/Badge";
import InfoIcon from "@mui/icons-material/Info";
import MaterialLink from "@mui/material/Link";
import { useRouter } from "next/router";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Layout({ user, children }) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="xl">
      <Grid
        container
        component="main"
        className="md:p-8 mb-12 pt-4"
        justifyContent="center"
      >
        <Fragment>
          <AppBar style={{ background: "#235b79" }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                <Link
                  style={{ color: "inherit", textDecoration: "inherit" }}
                  href={"/"}
                >
                  TGSP - The Gathering Server Panel
                </Link>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {typeof user?.credits !== "undefined" && (
                  <Tooltip title={`You have ${user?.credits} credits`}>
                    <Badge
                      badgeContent={`${user?.credits}`}
                      color={user?.credits >= 1 ? "success" : "warning"}
                    >
                      <TokenIcon />
                    </Badge>
                  </Tooltip>
                )}
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
          <Container>
            <Box sx={{ mt: 10 }}>{children}</Box>
          </Container>
        </Fragment>
      </Grid>
      <Box component="footer" style={{ marginBottom: "1rem" }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            direction={{ sm: "column", md: "row" }}
            spacing={12}
            sx={{ paddingTop: 5 }}
          >
            <Link href="https://www.nlogic.no/">
              <Image
                src="https://tech.gathering.org/wp-content/themes/technical-blog-wordpress-main/static/img/partners/nlogic.svg"
                alt="nlogic logo"
                loading="lazy"
                width={200}
                height={100}
              />
            </Link>
            <Link href="https://www.arista.com/">
              <Image
                src="https://www.tg.no/tg25/sponsors/arista.svg"
                alt="arista logo"
                loading="lazy"
                width={200}
                height={100}
              />
            </Link>
            <Link href="https://www.nextron.no/">
              <Image
                src="https://tech.gathering.org/wp-content/themes/technical-blog-wordpress-main/static/img/partners/nextron.svg"
                alt="nextron logo"
                loading="lazy"
                width={200}
                height={100}
              />
            </Link>
            <Link href="https://www.telenor.com/">
              <Image
                src="https://tech.gathering.org/wp-content/themes/technical-blog-wordpress-main/static/img/partners/telenor.svg"
                alt="telenor logo"
                loading="lazy"
                width={200}
                height={100}
              />
            </Link>
          </Stack>
          <Typography variant="body2">
            The Gathering 2025{" - "}
            <MaterialLink color="inherit" href="https://www.gathering.org">
              www.gathering.org
            </MaterialLink>
          </Typography>
        </Grid>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          {user?.email}
          <br /> ({user?.role})
        </MenuItem>
        <MenuItem onClick={() => router.push("/user")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          User Settings
        </MenuItem>
        <MenuItem onClick={() => router.push("/about")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          About TGSP
        </MenuItem>
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Container>
  );
}
