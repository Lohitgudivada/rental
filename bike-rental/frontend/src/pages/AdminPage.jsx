import { Box, Card, CardContent, Container, Typography } from "@mui/material";

function AdminPage({ overview }) {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users ({overview.users.length})</Typography>
              {overview.users.map((user) => (
                <Typography key={user.id}>
                  #{user.id} - {user.name} ({user.role})
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Bikes ({overview.bikes.length})</Typography>
              {overview.bikes.map((bike) => (
                <Typography key={bike.id}>
                  #{bike.id} - {bike.name} (${bike.price_per_day}/day)
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: "1 1 300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Bookings ({overview.bookings.length})</Typography>
              {overview.bookings.map((booking) => (
                <Typography key={booking.id}>
                  #{booking.id} - Bike {booking.bike_id}, User {booking.customer_id}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default AdminPage;
