"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function UserUpdate() {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/users/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load user");

        const user = await res.json();
        setUsername(user.username || "");
        setProfileImage(user.profileImage || "");
        setUserId(user.id || "");
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, profileImage }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Update failed");
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Edit Profile
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar
          src={profileImage}
          alt={username}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: "3px solid",
            borderColor: "primary.main",
          }}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="profile-image-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="profile-image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCameraIcon />}
            size="small"
            sx={{ mb: 3 }}
          >
            Change Photo
          </Button>
        </label>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          variant="outlined"
          required
        />

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <Button variant="contained" type="submit" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
