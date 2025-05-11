import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { getCurrentUser } from "../../api/api"; // adjust path
import UserUpdate from "./UserUpdate";

interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

interface User {
  username: string;
  bio?: string;
  profileImage?: string;
  stats: UserStats;
}

export default function UserView() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  if (isEditing) return <UserUpdate />;

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: "#fff",
        maxWidth: 500,
        mx: "auto",
        mt: 4,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={user.profileImage || "/placeholder.svg?height=100"}
          alt="Profile"
          sx={{ width: 100, height: 100, border: "3px solid #1976d2" }}
        />
        <IconButton
          sx={{
            position: "absolute",
            right: -10,
            top: 0,
            bgcolor: "white",
            border: "1px solid #ccc",
            "&:hover": { bgcolor: "#eee" },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" fontWeight="bold">
        {user.username}
      </Typography>

      <Button variant="contained" onClick={() => setIsEditing(true)}>
        EDIT PROFILE
      </Button>

      <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography fontWeight="bold">{user.stats.posts}</Typography>
          <Typography variant="caption">Posts</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography fontWeight="bold">{user.stats.followers}</Typography>
          <Typography variant="caption">Followers</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography fontWeight="bold">{user.stats.following}</Typography>
          <Typography variant="caption">Following</Typography>
        </Box>
      </Box>
    </Box>
  );
}
