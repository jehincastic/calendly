import * as React from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PieChartIcon from "@mui/icons-material/PieChart";
import Logout from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ApiIcon from "@mui/icons-material/Api";

import Button from "@components/Button";
import { useAuth } from "@providers/AuthProvider";
import { LoadingContext } from "@providers/LoadingProvider";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface MenuItem {
  name: string;
  icon: React.FC;
  href?: string;
  onClickFn?: () => void;
}

const Navbar: React.FC = ({ children }) => {
  const { isLoading } = React.useContext(LoadingContext);
  const { user, setUser } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    localStorage.removeItem(process.env.tokenKey || "");
    setUser({
      loggedIn: false,
      email: "",
      emailVerified: false,
      id: "",
      firstName: "",
      lastName: "",
      image: "",
      timezone: "",
      timezoneDiff: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      loading: true,
    });
  };

  const iconsList: MenuItem[][] = [
    [
      {
        name: "Dashboard",
        icon: PieChartIcon,
        href: "/",
      },
    ], [
      {
        name: "My Schedule",
        icon: ScheduleIcon,
        href: "/schedule",
      }, {
        name: "My Calendar",
        icon: EventIcon,
        href: "/policy_holder/add",
      },
    ], [
      {
        name: "Webhooks",
        icon: ApiIcon,
        href: "/",
      }
    ]
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {process.env.appName}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {
                user.loading
                  ? null
                  : (user && user.loggedIn)
                    ? (
                      <>
                        <Tooltip title={user.firstName}>
                          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                            <Avatar
                              alt={user.firstName}
                              style={{
                                alignSelf: "center",
                                border: "1px solid gray"
                              }}
                              src={user.image || ""}
                              sx={{
                                width: 32,
                                height: 32,
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          anchorEl={anchorEl}
                          open={openProfile}
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
                                content: "''",
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
                          <MenuItem>
                            <Avatar
                              alt={user.firstName}
                              style={{
                                alignSelf: "center",
                              }}
                              src={user.image || ""}
                              sx={{
                                width: 32,
                                height: 32,
                              }}
                            /> Profile
                          </MenuItem>
                          <MenuItem>
                            <ListItemIcon>
                              <PieChartIcon fontSize="small" />
                            </ListItemIcon>
                            Dashboard
                          </MenuItem>
                          <Divider />
                          <MenuItem>
                            <ListItemIcon>
                              <ScheduleIcon fontSize="small" />
                            </ListItemIcon>
                            My Schedule
                          </MenuItem>
                          <MenuItem onClick={logOut}>
                            <ListItemIcon>
                              <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                          </MenuItem>
                        </Menu>
                      </>
                    )
                    : (
                      <>
                        <Button
                          style={{color: "#fff"}}
                          disabled={isLoading}
                          onClick={() => {
                            router.push("/login");
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          style={{color: "#fff"}}
                          disabled={isLoading}
                          onClick={() => {
                            router.push("/signup");
                          }}
                        >
                          Sign Up
                        </Button>
                      </>
                    )
              }
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {
          iconsList.map((icons, idx) => {
            return (
              <React.Fragment key={idx}>
                <List>
                  {icons.map(({
                    name,
                    icon: Icon,
                    href,
                    onClickFn,
                  }, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => {
                        handleDrawerClose();
                        if (href) {
                          router.push(href);
                        } else if (onClickFn) {
                          onClickFn();
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
                </List>
                {((iconsList.length - 1) !== idx) && <Divider />}
              </React.Fragment>
            )
          })
        }
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

const withNavBar = (
  Component: React.ComponentType<{}>,
  // eslint-disable-next-line react/display-name
): React.FC<any> => (props) => {
  return (
    <Navbar>
      <Component {...props}>{props.children}</Component>
    </Navbar>
  );
};

export default withNavBar;
