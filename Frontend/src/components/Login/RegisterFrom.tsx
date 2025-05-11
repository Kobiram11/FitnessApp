import { useState, type ChangeEvent } from "react";
import { Box, Card, TextField, Button, Typography, Avatar, IconButton } from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { registerUser } from "../../api/api"; // adjust path if needed

interface RegisterFormProps {
  onToggleForm: () => void;
}

export default function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        name,
        mobileNumber,
        email,
        password,
        profileImage,
        source: "CREDENTIAL",
      });
      alert("Registration successful!");
      onToggleForm(); // switch to login form
    } catch (err: any) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 4,
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Create Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join Gain Hub today
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={profileImage || ""}
            sx={{ width: 80, height: 80, border: "3px solid", borderColor: "primary.main" }}
          />
          <input
            accept="image/*"
            type="file"
            id="profile-image-upload"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="profile-image-upload">
            <IconButton
              component="span"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
              size="small"
            >
              <AddAPhoto fontSize="small" />
            </IconButton>
          </label>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          required
          sx={{ mb: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Mobile Number"
          variant="outlined"
          margin="normal"
          required
          type="tel"
          sx={{ mb: 2 }}
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          required
          type="email"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          required
          type="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          sx={{
            mt: 2,
            mb: 2,
            py: 1.5,
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Sign Up
        </Button>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          pt: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body2">
          Already have an account?{" "}
          <Button
            onClick={onToggleForm}
            color="primary"
            sx={{ p: 0, minWidth: "auto", fontWeight: "bold", textTransform: "none" }}
          >
            Login
          </Button>
        </Typography>
      </Box>
    </Card>
  );
}
