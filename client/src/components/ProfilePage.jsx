import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";

import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

import MessageIcon from "@mui/icons-material/Message";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

const Label = styled("span")(({ theme }) => ({
  fontWeight: 500,
}));

const ItemListing = (item) => {
  console.log(item);
  const categoryInList = (category) => {
    <li key={category}>
      <Chip label={category} size="small" color="primary" variant="outlined" />
    </li>;
  };

  let categories = item.categories.map((category) => {
    return categoryInList(category);
  });

  return (
    <ListItem key={item._id}>
      {/* <Link to={`/items/${item._id}`} style={{ color: "inherit", textDecoration: "none" }}> */}
      <ListItemButton
        component={Link}
        to={`/items/${item._id}`}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <ListItemIcon>
          <ShoppingBasketIcon />
        </ListItemIcon>
        <ListItemText
          primary={item.name}
          // secondary={
          //   <>
          //     <div style={{marginTop: ".5em"}}>
          //       <ul className="category-list">
          //         {categories}
          //       </ul>
          //     </div>
          //     <div style={{marginTop: ".5em"}}>{item.description}</div>
          //   </>
          // }
          secondary={item.description}
        />
      </ListItemButton>
      <Divider />
      {/* </Link> */}
    </ListItem>
  );
};

const ItemPage = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [items, setItemData] = useState(undefined);
  const [errorHappened, setError] = useState(undefined);

  const useStyles = makeStyles(() => ({
    title: {
      fontWeight: "bold",
      color: "#444",
    },
  }));
  const classes = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/user/${currentUser.displayName}`
        );
        const itemData = await Promise.all(
          data.items.map(async (itemId) => {
            let item = await axios.get(`http://localhost:4000/items/${itemId}`);
            return item.data;
          })
        );
        setUser(data);
        setItemData(itemData);
        setError(undefined);
      } catch (e) {
        setUser({ username: "?" });
        setError(e);
      }
      setLoading(false);
    };
    setLoading(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="100%">
        <div style={{ margin: "0 auto", width: "fit-content" }}>Loading...</div>
      </Container>
    );
  } else if (errorHappened) {
    return (
      <div>
        <h2>{errorHappened.toString()}</h2>
      </div>
    );
  }
  // let itemListings = null;
  let itemListings = items.map((item) => {
    return ItemListing(item);
  });

  let avatarInternals = null;
  if (user.profilePicture) {
    avatarInternals = (
      <Avatar
        alt={`${user.name.firstName} ${user.name.lastName}`}
        src={`http://localhost:4000/file/${user.profilePicture}`}
        sx={{ width: 50, height: 50 }}
      />
    );
  } else {
    avatarInternals = (
      <Avatar sx={{ bgcolor: "#EB5757", width: 50, height: 50 }}>
        {user.username[0]}
      </Avatar>
    );
  }

  return (
    <Container maxWidth="100%">
      <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
        <CardHeader
          avatar={avatarInternals}
          title={user.username}
          subheader={user.joinDate}
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
              <Label>Full Name:</Label>{" "}
              {`${user.name.firstName}
              ${user.name.lastName}`}
            </Typography>
            <Typography gutterBottom variant="div" component="div">
              <Label>Cell Phone #:</Label> (123)-456-7890
            </Typography>
            <Typography gutterBottom variant="div" component="div">
              <Label>Home Phone #:</Label> (123)-456-7890
            </Typography>
            <Typography gutterBottom variant="div" component="div">
              <Label>Email Address:</Label> {user.emailAddress}
            </Typography>
          </div>
          <div style={{ margin: "1em 0" }}>
            <Typography variant="h6" component="div">
              Listed Items
            </Typography>
            <div>
              <List>{itemListings}</List>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ItemPage;
