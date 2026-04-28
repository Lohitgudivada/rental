import { Button, Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from "@mui/material";

function BikeCard({ bike, onBook, showBookButton = false }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 4,
        borderColor: "rgba(44, 62, 80, 0.18)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.14)" },
      }}
    >
      <CardMedia
        component="img"
        height="170"
        image={bike.image_url || "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80"}
        alt={bike.name}
      />
      <CardContent>
        <Typography variant="h6">{bike.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {bike.description}
        </Typography>
        <Stack direction="row" sx={{ mt: 1, mb: 1 }} spacing={1}>
          <Chip color="primary" label={`$${bike.price_per_day}/day`} />
          <Chip color={bike.quantity > 0 ? "success" : "default"} label={`Qty: ${bike.quantity ?? 0}`} />
        </Stack>
        <Chip color={bike.is_available ? "success" : "default"} label={bike.is_available ? "Available" : "Out of stock"} />
      </CardContent>
      {showBookButton && (
        <CardActions>
          <Button
            variant="contained"
            fullWidth
            disabled={!bike.is_available}
            onClick={() => onBook(bike)}
          >
            Book this bike
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default BikeCard;
