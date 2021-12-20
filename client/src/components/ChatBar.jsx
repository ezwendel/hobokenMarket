import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";
import { AuthContext } from "../firebase/Auth";

import {
  Container,
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItem,
} from "@mui/material";
import { Link } from "react-router-dom";


import MailIcon from "@mui/icons-material/Mail";
import Loading from "./Loading";

// const Label = styled("span")(({ theme }) => ({
//   fontWeight: 500,
// }));

const ChatBar = (props) => {
  // const theme = useTheme();
  // const useStyles = makeStyles(() => ({
  //   title: {
  //     fontWeight: "bold",
  //     color: "#444",
  //   },
  // }));
  // const classes = useStyles();
  const [loading, setLoading] = useState(true);
  // const [user, setUserData] = useState(undefined);
  const [messageThreadData, setMessageThreadData] = useState(undefined);
  const [messageThreadUsers, setMessageThreadUserData] = useState(undefined);
  const [errorHappened, setError] = useState(undefined);
  const { currentUser } = useContext(AuthContext);

  const MessageThreadListing = (messageThread, index) => {


    let userToMessage = messageThreadUsers[index];

    let lastMsg = messageThread.messages[messageThread.messages.length - 1];

    return (
      <>
        <ListItem key={messageThread._id} sx={{ padding: 0 }}>
          {/* <Link to={`/items/${item._id}`} style={{ color: "inherit", textDecoration: "none" }}> */}
          <ListItemButton
            component={Link}
            to={`/messageThread/${messageThread._id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText
              primary={userToMessage.username}
              secondary={
                <div>
                  {lastMsg.message}
                  <br />
                  {lastMsg.read ? "Message Read" : "Message Unread"}
                  <br />
                  {/* {lastMsg.time.split('T')[0]} */}
                  {lastMsg.time.toLocaleString('en-US', {timeZone: 'EST'})}
                </div>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItemButton>
          {/* </Link> */}
        </ListItem>
        <Divider />
      </>
    );
  };

  useEffect(() => {
    console.log("useEffect fired");
    async function fetchData() {
      try {
        const header = await createToken();

        const { data } = await axios.get(
          `http://localhost:4000/messageThreads/all_threads_for_user/${currentUser.email}`, header
        );
        const userData = await axios.get(
          `http://localhost:4000/user/email/${currentUser.email}`, header
        )
        
        const messageThreadData = await Promise.all(
          data.map(async (messageThread) => {
            if (messageThread.buyer.toString() === userData.data._id.toString()) {
              let seller = await axios.get(`http://localhost:4000/user/${messageThread.seller.toString()}`, header);
              return seller.data;
            } else {
              let buyer = await axios.get(`http://localhost:4000/user/${messageThread.buyer.toString()}`, header);
              return buyer.data;
            }
          })
        );
        setMessageThreadData(data)
        //setUserData(userData.data);
        setMessageThreadUserData(messageThreadData);
        setError(undefined);
        setLoading(false);
      } catch (e) {
        setError(e);
        console.log(e);
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser.email]);

  if (loading) {
    return <Loading />;
  } else if (errorHappened) {
    return (
      <Container>
        <div style={{ margin: "0 auto", width: "fit-content" }}>
          {errorHappened.toString()}
        </div>
      </Container>
    );
  } else {
    let messageThreads = messageThreadData.map((messageThread, index) => {
      return MessageThreadListing(messageThread, index);
    });

    return (
      <Container>
        <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
          <Divider />
          <CardContent>
            <div style={{ margin: "1em 0" }}>
              <Typography variant="h6" component="div">
                Mail
              </Typography>
              <div>
                <List sx={{ width: "100%" }}>{messageThreads}</List>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }
};

export default ChatBar;
