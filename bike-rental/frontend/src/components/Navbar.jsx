import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";

function Navbar({ user, onLogout, mode, onToggleMode }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
          Velocity Bike Rental
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <IconButton color="inherit" onClick={onToggleMode} aria-label="toggle dark mode">
            {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
          {user ? (
            <>
              <Typography sx={{ opacity: 0.9 }}>
                {user.name} ({user.role})
              </Typography>
              <Button color="inherit" onClick={onLogout} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                Logout
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
