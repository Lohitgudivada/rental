import { Alert, Box, CircularProgress, Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import LoginPage from "./pages/LoginPage";
import OwnerPage from "./pages/OwnerPage";
import {
  addBikeApi,
  bookBikeApi,
  getAdminOverviewApi,
  getBookingsApi,
  listBikesApi,
  loginApi,
  signupApi,
  setUserHeader,
} from "./services/api";

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme-mode") || "light");
  const [user, setUser] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [overview, setOverview] = useState({ users: [], bikes: [], bookings: [] });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#2f6bff" },
          secondary: { main: "#00a9b8" },
          background:
            mode === "dark"
              ? { default: "#0e1117", paper: "#151a22" }
              : { default: "#eef3ff", paper: "#ffffff" },
        },
        shape: { borderRadius: 14 },
      }),
    [mode],
  );

  const ownerBikes = useMemo(() => {
    if (!user) return [];
    return bikes.filter((bike) => bike.owner_id === user.id);
  }, [bikes, user]);

  const loadBikes = async () => {
    const { data } = await listBikesApi();
    setBikes(data);
  };

  const loadBookings = async () => {
    if (!user || (user.role !== "customer" && user.role !== "admin")) return;
    const { data } = await getBookingsApi();
    setBookings(data);
  };

  const loadAdminOverview = async () => {
    if (!user || user.role !== "admin") return;
    const { data } = await getAdminOverviewApi();
    setOverview(data);
  };

  const refreshDataByRole = async () => {
    await loadBikes();
    if (user?.role === "customer") {
      await loadBookings();
    }
    if (user?.role === "admin") {
      await loadBookings();
      await loadAdminOverview();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshDataByRole().catch(() => {
      // Keep initial render stable even when backend is temporarily unavailable.
      console.error("Could not load data from backend.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogin = async (payload) => {
    setLoading(true);
    setLoginError("");
    setSuccessMessage("");
    try {
      const { data } = await loginApi(payload);
      setUser(data);
      setUserHeader(data.id);
      setGlobalError("");
    } catch (error) {
      if (!error.response) {
        setLoginError("Cannot reach server. Please start backend on port 8000.");
      } else {
        setLoginError(error.response?.data?.detail || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (payload) => {
    setLoading(true);
    setLoginError("");
    setSuccessMessage("");
    try {
      await signupApi(payload);
      setSuccessMessage("Account created successfully. You can now login.");
    } catch (error) {
      if (!error.response) {
        setLoginError("Cannot reach server. Please start backend on port 8000.");
      } else {
        setLoginError(error.response?.data?.detail || "Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBookings([]);
    setOverview({ users: [], bikes: [], bookings: [] });
    setUserHeader(null);
  };

  const handleAddBike = async (payload) => {
    await addBikeApi(payload);
    await loadBikes();
  };

  const handleBookBike = async (payload) => {
    await bookBikeApi(payload);
    await refreshDataByRole();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            mode === "dark"
              ? "radial-gradient(circle at 8% 10%, rgba(59, 130, 246, 0.2), transparent 26%), radial-gradient(circle at 85% 5%, rgba(45, 212, 191, 0.14), transparent 30%)"
              : "radial-gradient(circle at 8% 10%, rgba(58, 123, 213, 0.18), transparent 26%), radial-gradient(circle at 85% 5%, rgba(0, 210, 255, 0.18), transparent 30%)",
        }}
      >
        <Navbar user={user} onLogout={handleLogout} mode={mode} onToggleMode={() => setMode((prev) => (prev === "light" ? "dark" : "light"))} />
        {globalError ? (
          <Container sx={{ mt: 2 }}>
            <Alert severity="error">{globalError}</Alert>
          </Container>
        ) : null}
        {!user ? <LoginPage onLogin={handleLogin} onSignup={handleSignup} error={loginError} successMessage={successMessage} isLoading={loading} /> : null}
        {loading ? (
          <Container sx={{ mt: 4, textAlign: "center" }}>
            <CircularProgress />
          </Container>
        ) : null}
        {user?.role === "owner" ? <OwnerPage bikes={ownerBikes} onAddBike={handleAddBike} /> : null}
        {user?.role === "customer" ? (
          <CustomerPage bikes={bikes.filter((bike) => bike.is_available && (bike.quantity ?? 0) > 0)} bookings={bookings} onBookBike={handleBookBike} />
        ) : null}
        {user?.role === "admin" ? <AdminPage overview={overview} /> : null}
      </Box>
    </ThemeProvider>
  );
}

export default App;
