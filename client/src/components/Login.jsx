import React, { useContext, useState } from "react";
import { useTheme } from "@mui/material/styles";
import SocialSignIn from "./SocialSignIn";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";

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
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LoginIcon from "@mui/icons-material/Login";

const Login = () => {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };
  if (currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <form onSubmit={handleLogin}>
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
                Login
              </Typography>
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
            <Grid item xs={6} m={0.5}>
              <Button
                variant="contained"
                width="100%"
                endIcon={<LoginIcon />}
                type="submit"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className="forgotPassword"
                onClick={(e) => {
                  passwordReset(e);
                }}
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                Forgot Password
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/create-account"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  position: "relative",
                  bottom: "1em"
                }}
              >
                Or Create an Account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
