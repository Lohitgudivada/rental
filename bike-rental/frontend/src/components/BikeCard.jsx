import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";

function BikeCard({ bike, onBook, showBookButton = false }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6">{bike.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {bike.description}
        </Typography>
        <Typography>Price / day: ${bike.price_per_day}</Typography>
        <Chip
          sx={{ mt: 1 }}
          color={bike.is_available ? "success" : "default"}
          label={bike.is_available ? "Available" : "Booked"}
        />
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
