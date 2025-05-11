import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Container,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  AccountCircle as AccountCircleIcon,
  Insights as InsightsIcon,
} from "@mui/icons-material";

import CreatePost from "../components/Post/CreatePost";
import ViewPost from "../components/Post/ViewPost";
import UserView from "../components/User/UserView";
import Notification from "../components/Notification/Notification";
import ProgressDashboard from "../components/ProgressUpdate/ProgressDashboard";

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

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem("userId") || "";

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (view: string) => {
    if (view === "createPost") {
      setIsCreatePostOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton sx={{ ml: 1 }} onClick={() => handleNavigation("userView") }>
              <Avatar alt="User" src="/placeholder.svg?height=40&width=40" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: [1] }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Gain Hub
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={currentView === "home"} onClick={() => handleNavigation("home") }>
              <ListItemIcon>
                <HomeIcon color={currentView === "home" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation("createPost") }>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Post" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton selected={currentView === "learningPlan"} onClick={() => handleNavigation("learningPlan") }>
              <ListItemIcon>
                <SchoolIcon color={currentView === "learningPlan" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Learning Plan" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton selected={currentView === "progress"} onClick={() => handleNavigation("progress") }>
              <ListItemIcon>
                <InsightsIcon color={currentView === "progress" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Progress" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton selected={currentView === "userView"} onClick={() => handleNavigation("userView") }>
              <ListItemIcon>
                <AccountCircleIcon color={currentView === "userView" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {settingsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Main open={drawerOpen}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {currentView === "home" && (
            <>
              <Typography variant="h5" gutterBottom>
                Recent Posts
              </Typography>
              <ViewPost />
            </>
          )}

          {currentView === "learningPlan" && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Learning Plan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is a placeholder for the Learning Plan section.
              </Typography>
            </Box>
          )}

          {currentView === "progress" && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Progress Tracker
              </Typography>
              <ProgressDashboard userId={userId} />
            </Box>
          )}

          {currentView === "userView" && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Profile
              </Typography>
              <UserView />
            </Box>
          )}
        </Container>
      </Main>

      <CreatePost open={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />

      <Notification
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        userId={userId}
        setUnreadCount={setUnreadCount}
      />
    </Box>
  );
}
