import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Google,
  Visibility,
  VisibilityOff,
  ArrowForward,
} from "@mui/icons-material";
import { useState } from "react";
import { loginUser } from "../../api/api"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });

      // ✅ Store userId in localStorage for notifications
      localStorage.setItem("userId", response.data.id);

      // ✅ Optionally store JWT if used
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      console.log("Login success:", response.data);

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
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
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to continue to Gain Hub
        </Typography>
      </Box>

      <Box component="form" sx={{ mt: 2 }} onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Enter your Email ID"
          type="email"
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Enter your Password"
          type={showPassword ? "text" : "password"}
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={handleGoogleLogin}
          startIcon={<Google />}
          sx={{
            mt: 2,
            borderColor: "#4285F4",
            color: "#4285F4",
            "&:hover": {
              borderColor: "#3367D6",
              backgroundColor: "rgba(66, 133, 244, 0.04)",
            },
          }}
        >
          Login with Google
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="body2">New user?</Typography>
          <Button
            onClick={onToggleForm}
            endIcon={<ArrowForward />}
            color="primary"
          >
            Register
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
