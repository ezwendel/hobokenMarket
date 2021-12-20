import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { createToken } from "../firebase/AuthBackend";
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  ListItem,
  Rating,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';


const ChatBar = ({ id, selectedIndex }) => {
    const [ user, setUser ] = useState(undefined);
    const [ selectedChat, setselectedChat ] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorHappened, setError] = useState(undefined);
    
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // const { data: data2 } = await axios.get(
          // `http://localhost:4000/user/${id}`
          // );
          // console.log(data2);
          // setUser(data2);
          setLoading(false);
        } catch (e) {
          setError(e);
          console.log(e);
        }
      };
      fetchData();
    }, [id]);


    // const renderChat = () => {
    //     return chat.map(({ name, message }, index) => (
    //       <div key={index}>
    //         <h3>
    //           {name}: <span>{message}</span>
    //         </h3>
    //       </div>
    //     ));
    //   };
    
    return (
        <div>
            <p>Bar</p>
        </div>
    );
}

export default ChatBar;