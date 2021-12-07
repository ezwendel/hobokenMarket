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
import EmailIcon from "@mui/icons-material/Email";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

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
            <Grid item xs={12}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Create an Account
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
                id="firstname"
                label="First Name"
                defaultValue="First Name"
                variant="standard"
                sx={{ width: "16ch", right: "18px" }}
              />
              <TextField
                id="lastname"
                label="Last Name"
                defaultValue="Last Name"
                variant="standard"
                sx={{ width: "16ch", left: "18px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="email"
                label="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter email"
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
            <Grid item xs={6}>
              <TextField
                  id="confirmpassword"
                  label="Confirm Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Confirm password"
                  variant="standard"
                  sx={{ width: "36ch" }}
                />
            </Grid>
            <Grid item xs={6} m={0.5}>
              <Button
                variant="contained"
                width="100%"
                endIcon={<PersonAddAltIcon />}
              >
                Create Account
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Or Login to an Existing Account
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
