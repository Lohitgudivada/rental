import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";

function LoginPage({ onLogin, error, isLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.92)" }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
          Premium Bike Booking
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Use sample users: admin@bike.com, owner@bike.com, customer@bike.com
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 2 }}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
