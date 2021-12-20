import React from 'react';
import ChatBar from './ChatBar';
import Contacts from './Contacts';



const ChatPage = (props) => {

    return (
      
      <div>
        <Contacts formOpen={props.location.state ? props.location.state.formOpen : false} email={props.location.state ? props.location.state.email : ''} />
        <ChatBar id={props.match.params.id} />
      </div>
    );
  
}

export default ChatPage;