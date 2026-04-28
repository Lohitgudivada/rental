import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

function LoginPage({ onLogin, onSignup, error, successMessage, isLoading }) {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (view === "login") {
      onLogin({ email, password });
      return;
    }
    onSignup({ name, email, password, role });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 7 }}>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
          gap: 4,
        }}
      >
        <Box>
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
            PREMIUM CITY RIDES
          </Typography>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 800, lineHeight: 1.1 }}>
            Reserve high quality bikes in London and beyond.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            Professional rentals for owners and riders. Track fleet availability, bookings, and customer activity in one modern dashboard.
          </Typography>
          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper variant="outlined" sx={{ px: 2, py: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle2">350+ bikes</Typography>
              <Typography variant="caption" color="text.secondary">Live availability</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ px: 2, py: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle2">24/7 support</Typography>
              <Typography variant="caption" color="text.secondary">Priority service</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ px: 2, py: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle2">Secure billing</Typography>
              <Typography variant="caption" color="text.secondary">Verified checkout</Typography>
            </Paper>
          </Box>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            {view === "login" ? "Sign in to your account" : "Create your account"}
          </Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            fullWidth
            sx={{ mb: 2 }}
            onChange={(_, value) => {
              if (value) setView(value);
            }}
          >
            <ToggleButton value="login">Login</ToggleButton>
            <ToggleButton value="signup">Signup</ToggleButton>
          </ToggleButtonGroup>

          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          {error ? <Alert severity="error" sx={{ mt: successMessage ? 1 : 0 }}>{error}</Alert> : null}

          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            Test users: admin@bike.com / admin123, owner@bike.com / owner123, customer@bike.com / customer123
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1.5 }}>
            {view === "signup" ? (
              <TextField
                label="Full name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            ) : null}
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {view === "signup" ? (
              <TextField
                select
                label="Account type"
                fullWidth
                margin="normal"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                helperText="Choose owner to list bikes or customer to rent bikes."
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
              </TextField>
            ) : null}
            <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 2, py: 1.2, borderRadius: 2 }}>
              {isLoading ? (view === "login" ? "Logging in..." : "Creating account...") : view === "login" ? "Login" : "Create account"}
            </Button>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
}

export default LoginPage;
