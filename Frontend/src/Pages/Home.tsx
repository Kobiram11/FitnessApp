import { useState } from "react"
import { Box, Container, Typography, useMediaQuery } from "@mui/material"
import LoginForm from "../components/Login/LoginFrom"
import RegisterForm from "../components/Login/RegisterFrom"
import { useTheme } from "@mui/material/styles"


export default function Home() {
  const [showLogin, setShowLogin] = useState(true)
  const toggleForm = () => setShowLogin(!showLogin)

  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"))

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ✅ Background Image */}
      <Box
        component="img"
        src="/images/muscles.jpg"
        alt="Fitness Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(70%)",
          zIndex: 0,
        }}
      />

      {/* ✅ Header with Logo - Centered */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="Gain Hub Logo"
          sx={{ width: 175, height: 80, borderRadius: 3,objectFit: "cover",boxShadow: 4,opacity: 0.9, }}
        />
      </Box>

      {/* ✅ Main Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* ✅ Left Side - Quote */}
          <Box
            sx={{
              width: "100%",
              md: "50%",
              textAlign: { xs: "center", md: "left" },
              color: "white",
            }}
          >
            <Typography
              variant={isMdUp ? "h3" : "h4"}
              sx={{
                mb: 4,
                lineHeight: 1.4,
                fontFamily: "Doppio One, sans-serif",
                fontWeight: 600,
              }}
            >
              "Share your skills. Inspire others. Transform together — only on Gain Hub."
            </Typography>
          </Box>

          {/* ✅ Right Side - Form */}
          <Box sx={{ width: "100%", maxWidth: 450 }}>
            {showLogin ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <RegisterForm onToggleForm={toggleForm} />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
