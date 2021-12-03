import React from "react";
import { useTheme } from "@mui/material/styles";

import {
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const theme = useTheme();

  return (
    <form>
      <Card sx={{ width: "400px", m: "0 auto" }}>
        <CardContent>
          <Grid
            container
            direction="column"
            spacing={3}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={6}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                User Login
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="username"
                label="Username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter username"
                variant="standard"
                sx={{ width: "36ch" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="password"
                label="Password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter password"
                variant="standard"
                sx={{ width: "36ch" }}
              />
            </Grid>
            <Grid item xs={6} m={0.5}>
              <Button variant="contained" width="100%" endIcon={<LoginIcon />}>
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Link
                to="/create-account"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Or Create an Account
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
