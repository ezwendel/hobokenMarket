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
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from "../firebase/Auth";
import { createToken } from "../firebase/AuthBackend";
import Loading from "./Loading";
import CreateContact from './CreateContact';

const Contacts = () => {
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorHappened, setError] = useState(undefined);
    const [formOpen, setFormOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleFormOpen = () => {
      setFormOpen(true);
    };

    const handleFormClose = () => {
      setFormOpen(false);
    };

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
            <CreateContact
              formOpen={formOpen}
              handleFormClose={handleFormClose}
            />
            <Fab
            color="primary"
            variant="extended"
            aria-label="compose"
            style={{ position: "fixed", right: "5em", bottom: "3em" }}
            onClick={handleFormOpen}
          >
            Compose     
            <SendIcon sx={{ ml:1, mr: 1 }} />
              
          </Fab>
        </div>
    )

}

export default Contacts