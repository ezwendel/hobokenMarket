import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatBar from './ChatBar';
import Contacts from './Contacts';



const ChatPage = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
      <div>
        <p>Chat Page</p>
        <Contacts setSelectedIndex={setSelectedIndex} />
        <ChatBar id={props.match.params.id} selectedIndex={selectedIndex} />
      </div>
    );
  
}

export default ChatPage;