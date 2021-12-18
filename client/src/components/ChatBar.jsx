import React, { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useLocalStorage from '../hooks/useLocalStorage';
import ChatBar from './ChatBar';
import { ContactsProvider, useContacts } from '../contexts/Contacts';
import './App.css';

import {
  Card,
  CardContent,
  Typography,
  InputAdornment,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import Sidebar from './Sidebar';


const ChatBar = ({ id, selectedIndex }) => {
    const [state, setState] = useState({ message: '', name: ''})
    const { contacts } = useContacts();
    const [ selectedChat, setselectedChat ] = 

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('/');
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.on('send_message', ({ }))
    })

    const messageSubmit = (e) => {
        let msgEle = document.getElementById('message');
        console.log([[msgEle.name], msgEle.value]);
        socketRef.current.emit('send_message', {
            recipients: msgEle,
            message: msgEle.value
        });
        e.preventDefault();
        setState({ message: '', name: state.name });
        msgEle.value = '';
        msgEle.focus();
    }

    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
          <div key={index}>
            <h3>
              {name}: <span>{message}</span>
            </h3>
          </div>
        ));
      };
    
    return (
        <div>
            <Sidebar id={id} />
        </div>
    );
}

export default ChatBar;