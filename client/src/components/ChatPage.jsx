import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatBar from './ChatBar';
import Contacts from './Contacts';



const ChatPage = (props) => {

    return (
      <div>
        <Contacts />
        <ChatBar id={props.match.params.id} />
      </div>
    );
  
}

export default ChatPage;