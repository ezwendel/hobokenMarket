import React, {useContext,useState }from "react";
import { useTheme } from "@mui/material/styles";
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import {AuthContext} from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import axios from "axios";

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

const CreateAccount = () => {
  const theme = useTheme();
  const {currentUser}=useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { username, email, password, confirmpassword, } = e.target.elements;
    if (password.value !== confirmpassword.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
    postData(e);

  };
  const postData = async (e) => {
    try {
      const { username, firstname,lastname,email, password } = e.target.elements;
      const { data }=await axios.post(`http://localhost:4000/user/`,{
        firstName: firstname.value,
        lastName: lastname.value,
        username: username.value,
        password: password.value,
        profilePicture: null,
        emailAddress: email.value,

      });
      await doCreateUserWithEmailAndPassword(
        email.value,
        password.value,
        data._id
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert(e);
    }
    
  };
  if (currentUser) {
    return <Redirect to="/" />;
  }
  if (loading) {
    return (

        <div style={{ margin: "0 auto", width: "fit-content" }}>Loading...</div>

    );
  }

  return (
    <div>
    <form onSubmit={handleSignUp}>
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
                type="submit"
              >
                Create Account
              </Button>
              <SocialSignIn/>
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

    </div>
  );
};

export default CreateAccount;
