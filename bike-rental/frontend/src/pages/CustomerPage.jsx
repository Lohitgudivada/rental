import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import BikeCard from "../components/BikeCard";

function CustomerPage({ bikes, bookings, onBookBike }) {
  const [selectedBike, setSelectedBike] = useState(null);
  const [days, setDays] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleBook = async () => {
    if (!selectedBike) return;
    setMessage("");
    setError("");
    try {
      await onBookBike({ bike_id: selectedBike.id, days: Number(days) });
      setMessage("Bike booked successfully.");
      setSelectedBike(null);
      setDays(1);
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to book bike.");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert sx={{ mt: 2 }} severity="error">{error}</Alert> : null}
      <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
        Available Bikes
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {bikes.map((bike) => (
          <Box key={bike.id} sx={{ flex: "1 1 280px" }}>
            <BikeCard bike={bike} showBookButton onBook={setSelectedBike} />
          </Box>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        My Bookings
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {bookings.map((booking) => (
          <Box key={booking.id} sx={{ flex: "1 1 300px" }}>
            <Card>
              <CardContent>
                <Typography>Booking ID: {booking.id}</Typography>
                <Typography>Bike ID: {booking.bike_id}</Typography>
                <Typography>Days: {booking.days}</Typography>
                <Typography>Total: ${booking.total_price}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={Boolean(selectedBike)} onClose={() => setSelectedBike(null)}>
        <DialogTitle>Book {selectedBike?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              type="number"
              fullWidth
              label="Number of days"
              value={days}
              onChange={(event) => setDays(event.target.value)}
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBike(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleBook}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CustomerPage;
