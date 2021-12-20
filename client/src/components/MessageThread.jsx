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
    ListItemIcon,
    ListItemText,
    Divider,
    ListItem,
    TextField,
    Fab
  } from "@mui/material";


import SendIcon from '@mui/icons-material/Send';
import MailIcon from "@mui/icons-material/Mail";
import Loading from "./Loading";

const MessageThread = (props) => {
  const id = props.match.params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recipient, setRecipient] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');

  const { currentUser } = useContext(AuthContext);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Get Message Thread
  useEffect(() => {
    const fetchData = async () => {
      try {
        const header = await createToken();
        
        const userData = await axios.get(
            `http://localhost:4000/user/email/${currentUser.email}`, header
          );
        
          

        const { data } = await axios.get(`http://localhost:4000/messageThreads/${id}`, header);
        console.log(data.messages);

        setUser(userData.data)
        if (data.buyer.toString() === userData.data._id.toString()) {
            let seller = await axios.get(`http://localhost:4000/user/${data.seller.toString()}`, header);
            setRecipient(seller.data);
        } else {
            let buyer = await axios.get(`http://localhost:4000/user/${data.buyer.toString()}`, header);
            setRecipient(buyer.data);
        }

        setMessages(data.messages);
        setLoading(false);

        
      } catch (e) {
        setError(e);
        console.log(e);
      }
    };
    setLoading(true);
    fetchData();
  }, [currentUser.email, id]);

  const sendMessage = async () => {
    const header = await createToken();

    let { data } = await axios.post(
      `http://localhost:4000/messageThreads/message/${id}`, 
      {sender: user.emailAddress, message: value},
      header
    );
    console.log(data);
    setValue('');

    setMessages(data.messages)

  }

  const MessageListing = (message) => {
    let sender = '';
    if (message.sender.toString() === recipient._id.toString()) {
        sender = recipient.username;
    } else {
        sender = user.username;
    }
    return (
      <>
        <ListItem key={message._id} sx={{ padding: 0 }}>
          {/* <Link to={`/items/${item._id}`} style={{ color: "inherit", textDecoration: "none" }}> */}
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText
              primary={sender}
              secondary={
                <div>
                  {message.message}
                </div>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
          {/* </Link> */}
        </ListItem>
        <Divider />
      </>
    );
  };

  let messageThreads = messages.slice(0).reverse().map(message => {
    return MessageListing(message);
  });

  if (loading) {
    return (
      <Loading />
    );
  }
  if (error) {
    return (
      <Container>
        <div style={{ margin: "0 auto", width: "fit-content" }}>{error.toString()}</div>
      </Container>
    );
  }
  return (
    <Container>
        
      <Card sx={{ minWidth: 250, maxWidth: "70%", margin: "0 auto" }}>
        <Divider />
        <CardContent>
            <Typography component='div' variant='h6' align='center'>
                Compose Message
            </Typography>
            <TextField
                placeholder="Type a message..."
                multiline
                fullWidth
                maxRows={4}
                value={value}
                onChange={handleChange}
            />
            <Fab
            color="primary"
            variant="extended"
            aria-label="compose"
            sx={{my: 2, ml : 80}}
            onClick={sendMessage}
            disabled={value? false : true}
          >
            Send     
            <SendIcon sx={{ ml:1, mr: 0.5 }} />
          </Fab>
          <div style={{ margin: "1em 0" }}>
            <Typography variant="h6" component="div" align='center'>
              Messages
            </Typography>
            <div>
              <List sx={{ width: "100%" }}>{messageThreads}</List>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MessageThread;
