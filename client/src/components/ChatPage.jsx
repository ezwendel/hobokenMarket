import React, { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useLocalStorage from '../hooks/useLocalStorage';
import ChatBar from './ChatBar';
import Contacts from './Contacts';
import { ContactsProvider } from '../contexts/Contacts';
import { ConversationProvider } from '../contexts/Conversations';
import './App.css';



const ChatPage = (props) => {
    const [id, setId] = useLocalStorage(props.id);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const dashboard = (
      <ContactsProvider>
        <ConversationProvider>
          <Contacts setSelectedIndex={setSelectedIndex} />
          <ChatBar id={id} selectedIndex={selectedIndex} />
        </ConversationProvider>
      </ContactsProvider>
    );

    return (
      {dashboard}
    );
  
}

export default ChatPage;