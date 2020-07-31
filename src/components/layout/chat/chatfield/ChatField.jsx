import { Button, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { RoomContext } from '../ChatComponent';
import { useStyles } from './ChatField.style';

const ChatView = () => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const room = useContext(RoomContext);
  const [value, setValue] = React.useState(0);

  const sendMessage = () => {
    // socket.emit('get-users', { roomname });
    // if (message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  };

  return (
    <>
      <div className={classes.div}>
        <div id='message-container' className={classes.messageContainer}>
          {room.room}
        </div>
      </div>
      <div className={classes.form}>
        <TextField
          id='standard-textarea'
          autoComplete='off'
          placeholder='Placeholder'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant='contained' color='primary' onClick={(event) => sendMessage(event)}>
          Send
        </Button>
      </div>
    </>
  );
};

export default ChatView;
