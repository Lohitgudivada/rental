import { Alert, Box, CircularProgress, Container } from "@mui/material";
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
  setUserHeader,
} from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [overview, setOverview] = useState({ users: [], bikes: [], bookings: [] });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [globalError, setGlobalError] = useState("");

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
    refreshDataByRole().catch(() => {
      setGlobalError("Could not load data from backend.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogin = async (payload) => {
    setLoading(true);
    setLoginError("");
    try {
      const { data } = await loginApi(payload);
      setUser(data);
      setUserHeader(data.id);
      setGlobalError("");
    } catch (error) {
      setLoginError(error.response?.data?.detail || "Login failed.");
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <Navbar user={user} onLogout={handleLogout} />
      {globalError ? (
        <Container sx={{ mt: 2 }}>
          <Alert severity="error">{globalError}</Alert>
        </Container>
      ) : null}
      {!user ? <LoginPage onLogin={handleLogin} error={loginError} isLoading={loading} /> : null}
      {loading ? (
        <Container sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      ) : null}
      {user?.role === "owner" ? <OwnerPage bikes={ownerBikes} onAddBike={handleAddBike} /> : null}
      {user?.role === "customer" ? (
        <CustomerPage bikes={bikes.filter((bike) => bike.is_available)} bookings={bookings} onBookBike={handleBookBike} />
      ) : null}
      {user?.role === "admin" ? <AdminPage overview={overview} /> : null}
    </Box>
  );
}

export default App;
