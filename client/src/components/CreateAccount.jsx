import React, {useContext,useState }from "react";
import { useTheme } from "@mui/material/styles";
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import {AuthContext} from '../firebase/Auth';
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";

import {
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Grid,
  Button,
  TextField,
  linkClasses,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Loading from "./Loading";

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
      const { username, firstname, lastname, email, password, cellnumber, homenumber } = e.target.elements;

      const header = await createToken();

      const { data }=await axios.post(`http://localhost:4000/user/`,{
        firstName: firstname.value,
        lastName: lastname.value,
        username: username.value,
        password: password.value,
        profilePicture: null,
        emailAddress: email.value,
        numbers: {
          cell: cellnumber.value,
          home: homenumber.value
        }
      }, header
      );
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
      <Loading text={"Creating Account..."} />
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
            <Grid item xs={12}>
              <TextField
                id="cellnumber"
                label="Cell Phone Number (optional)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="XXX-XXX-XXXX"
                variant="standard"
                sx={{ width: "36ch" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="homenumber"
                label="Home Phone Number (optional)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="XXX-XXX-XXXX"
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
                endIcon={<PersonAddAltIcon />}
                type="submit"
              >
                Create Account
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/login"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                }}
              >
                Or Login to an Existing Account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>

    </div>
  );
};

export default CreateAccount;
