import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import BikeCard from "../components/BikeCard";

function CustomerPage({ bikes, bookings, onBookBike }) {
  const [selectedBike, setSelectedBike] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pickupSlot, setPickupSlot] = useState("09:00 - 11:00");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const pickupSlots = ["09:00 - 11:00", "11:00 - 13:00", "14:00 - 16:00", "16:00 - 18:00"];

  const handleBook = async () => {
    if (!selectedBike) return;
    setMessage("");
    setError("");
    try {
      await onBookBike({
        bike_id: selectedBike.id,
        from_date: fromDate,
        to_date: toDate,
        pickup_slot: pickupSlot,
        quantity: Number(quantity),
      });
      setMessage("Bike booked successfully.");
      setSelectedBike(null);
      setFromDate("");
      setToDate("");
      setPickupSlot("09:00 - 11:00");
      setQuantity(1);
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
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip size="small" label={`Booking #${booking.id}`} />
                  <Chip size="small" color="primary" label={`${booking.rental_days ?? "-"} days`} />
                </Stack>
                <Typography variant="subtitle1">{booking.bike_name || `Bike #${booking.bike_id}`}</Typography>
                <Typography color="text.secondary">Customer: {booking.customer_name || `User #${booking.customer_id}`}</Typography>
                <Typography>
                  Dates: {booking.from_date || "-"} to {booking.to_date || "-"}
                </Typography>
                <Typography>Pickup slot: {booking.pickup_slot || "-"}</Typography>
                <Typography>Quantity: {booking.quantity ?? 1}</Typography>
                <Typography sx={{ fontWeight: 600 }}>Total: ${booking.total_price}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog open={Boolean(selectedBike)} onClose={() => setSelectedBike(null)}>
        <DialogTitle>Book {selectedBike?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                type="date"
                fullWidth
                label="From date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                fullWidth
                label="To date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              select
              fullWidth
              label="Pickup slot"
              value={pickupSlot}
              onChange={(event) => setPickupSlot(event.target.value)}
              sx={{ mt: 2 }}
            >
              {pickupSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              label="Quantity"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              inputProps={{ min: 1, max: selectedBike?.quantity ?? 1 }}
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
