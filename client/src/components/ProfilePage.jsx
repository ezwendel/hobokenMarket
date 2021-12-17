import React, { useEffect, useState } from "react";
import { styled } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

import MessageIcon from "@mui/icons-material/Message";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import axios from "axios";

const Label = styled("span")(({ theme }) => ({
  fontWeight: 500,
}));

const ItemListing = () => {
  return (
    <Link to="/items/0" style={{ color: "inherit", textDecoration: "none" }}>
      <ListItemButton>
        <ListItemIcon>
          <ShoppingBasketIcon />
        </ListItemIcon>
        <ListItemText
          primary="Item"
          secondary={
            <>
              <div style={{ marginTop: ".5em" }}>
                <ul className="category-list">
                  <li>
                    <Chip
                      label="Category"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: ".5em" }}>Description</div>
            </>
          }
        />
      </ListItemButton>
      <Divider />
    </Link>
  );
};

const ProfilePage = (props) => {
  const theme = useTheme();
  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();
  const [account, setAccount] = useState(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      console.log(props.match.params.id);
      const { data: user } = await axios.get(`http://localhost:4000/user/${props.match.params.id}`);
      setAccount(user);
      setLoading(false);
    }
    fetch();
  }, [props.match.params.id]);
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Container maxWidth="100%">
        <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "#EB5757", width: 50, height: 50 }}>
                A
              </Avatar>
            }
            title={account.username ? account.username : "jsmith1999"}
            subheader="Member since: December 10, 2021"
            action={
              <Button aria-label="message" color="secondary">
                Send a Message
                <MessageIcon style={{ marginLeft: ".3em" }} />
              </Button>
            }
            classes={{ title: classes.title }}
          />
          <Divider />
          <CardContent>
            <div style={{ margin: "1em 0" }}>
              <Typography gutterBottom variant="h6" component="div">
                Contact Information
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Full Name:</Label> {account.name ? account.name.firstName + account.name.lastName : "John Smith"}
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Cell Phone #:</Label> (123)-456-7890
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Home Phone #:</Label> (123)-456-7890
              </Typography>
              <Typography gutterBottom variant="div" component="div">
                <Label>Email Address:</Label> john.smith@gmail.com
              </Typography>
            </div>
            <div style={{ margin: "1em 0" }}>
              <Typography variant="h6" component="div">
                Listed Items
              </Typography>
              <div>
                <List>
                  <Divider />
                  <ItemListing />
                  <ItemListing />
                  <ItemListing />
                  <ItemListing />
                </List>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }
};

export default ProfilePage;
