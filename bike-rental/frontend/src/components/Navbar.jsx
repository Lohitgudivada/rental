import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function Navbar({ user, onLogout }) {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Bike Rental</Typography>
        {user ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography>
              {user.name} ({user.role})
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
