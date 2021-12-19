import React from "react";
import { useTheme } from "@mui/material/styles";
import { Container, Stack, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  const theme = useTheme();

  return (
    <Container sx={{ margin: "0 auto", width: "100%", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Playfair Display", fontSize: "42px" }}>Hoboken Marketplace</h1>
      <h2
        className="title"
        style={{ fontSize: "20px", color: theme.palette.primary.main }}
      >
        A Marketplace for Hoboken Residents
      </h2>
      <Typography sx={{margin: "1em auto 3em auto", fontSize: "14px", fontFamily: "Montserrat"}}>View items that are up for sale in the Hoboken area, or put up your own items up for sale!</Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Button component={Link} to="/items/0" variant="outlined" className="home-button">
          View Listings
        </Button>
        <Button component={Link} to="/profile" variant="outlined" className="home-button">
          View Profile
        </Button>
      </Stack>
    </Container>
  );
}

export default Home;
