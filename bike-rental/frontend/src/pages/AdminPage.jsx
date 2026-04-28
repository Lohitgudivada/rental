import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from "@mui/material";

function AdminPage({ overview }) {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Users ({overview.users.length})</Typography>
              <Divider sx={{ my: 1 }} />
              {overview.users.map((user) => (
                <Stack key={user.id} direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip size="small" label={`#${user.id}`} />
                  <Typography>{user.name}</Typography>
                  <Chip size="small" color="info" label={user.role} />
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Bikes ({overview.bikes.length})</Typography>
              <Divider sx={{ my: 1 }} />
              {overview.bikes.map((bike) => (
                <Stack key={bike.id} direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip size="small" label={`#${bike.id}`} />
                  <Typography>{bike.name}</Typography>
                  <Chip size="small" color="success" label={`Qty ${bike.quantity ?? 0}`} />
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Bookings ({overview.bookings.length})</Typography>
              <Divider sx={{ my: 1 }} />
              {overview.bookings.map((booking) => (
                <Box key={booking.id} sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label={`#${booking.id}`} />
                    <Typography>{booking.bike_name || `Bike ${booking.bike_id}`}</Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {booking.customer_name || `User ${booking.customer_id}`} | {booking.from_date} to {booking.to_date}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default AdminPage;
