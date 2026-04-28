import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Navbar({ user, onLogout }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "linear-gradient(90deg, #243B55 0%, #141E30 100%)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
          Velocity Bike Rental
        </Typography>
        {user ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography sx={{ opacity: 0.9 }}>
              {user.name} ({user.role})
            </Typography>
            <Button color="inherit" onClick={onLogout} sx={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2 }}>
              Logout
            </Button>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
