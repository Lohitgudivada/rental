import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import BikeCard from "../components/BikeCard";

const emptyForm = {
  name: "",
  description: "",
  price_per_day: "",
  image_url: "",
  quantity: "1",
  is_available: true,
};

function OwnerPage({ bikes, onAddBike }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ownerBikes = useMemo(() => bikes, [bikes]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await onAddBike({
        ...form,
        price_per_day: Number(form.price_per_day),
        quantity: Number(form.quantity),
      });
      setForm(emptyForm);
      setMessage("Bike added successfully.");
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Failed to add bike.");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 340px" }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Add Bike</Typography>
            {message ? <Alert sx={{ mt: 2 }} severity="success">{message}</Alert> : null}
            {error ? <Alert sx={{ mt: 2 }} severity="error">{error}</Alert> : null}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Bike name"
                fullWidth
                margin="normal"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                minRows={3}
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
              />
              <TextField
                label="Price per day"
                fullWidth
                margin="normal"
                type="number"
                value={form.price_per_day}
                onChange={(event) => handleChange("price_per_day", event.target.value)}
              />
              <TextField
                label="Bike image URL"
                fullWidth
                margin="normal"
                value={form.image_url}
                onChange={(event) => handleChange("image_url", event.target.value)}
              />
              <TextField
                label="Quantity"
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ min: 1 }}
                value={form.quantity}
                onChange={(event) => handleChange("quantity", event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Add Bike
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: "1 1 500px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Bikes
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {ownerBikes.map((bike) => (
              <Box key={bike.id} sx={{ flex: "1 1 240px" }}>
                <BikeCard bike={bike} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default OwnerPage;
