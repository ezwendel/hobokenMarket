import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
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
  Rating,
  Box,
  Fab,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";
import Loading from "./Loading";
import CreateContact from './CreateContact';

const Contacts = () => {
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorHappened, setError] = useState(undefined);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleFormOpen = () => {
      setFormOpen(true);
    };

    const handleFormClose = () => {
      setFormOpen(false);
    };
    

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index)
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const header = await createToken()
            const { data: data2 } = await axios.get(
              `http://localhost:4000/messageThreads/all_threads_for_user/${currentUser.email}`, 
              header
            );
            console.log(data2);
            setMessages(data2);
            
          } catch (e) {
            setError(e);
            console.log(e);
          }
          setLoading(false);
        };
        fetchData();
      }, []);

    const ContactsList = messages &&
                         messages.map((contact, index) => {
                            console.log(contact)
                             return <ListItemButton
                                        key = {contact.buyer}
                                        selected = {selectedIndex === index}
                                        onClick={(event) => handleListItemClick(event, index)}
                                    >
                                        <ListItemText primary={contact.buyer} />
                                    </ListItemButton>
                         })
    
    if (loading) {
      return <Loading />
    } else if (errorHappened) {
      return (
        <Container>
          <div style={{ margin: "0 auto", width: "fit-content" }}>
            {errorHappened.toString()}
          </div>
        </Container>
      )
    }

    return (
        <div>
            <p>Contacts</p>
            <List component="nav" aria-label="contacts">
                {ContactsList}
            </List>
            <CreateContact
              formOpen={formOpen}
              handleFormClose={handleFormClose}
            />
            <Fab
            color="primary"
            variant="extended"
            aria-label="create-post"
            style={{ position: "fixed", right: "5em", bottom: "3em" }}
            onClick={handleFormOpen}
          >
            <Add sx={{ mr: 1 }} />
            Create Contact.
          </Fab>
        </div>
    )

}

export default Contacts