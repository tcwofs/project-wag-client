import { Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useStyles } from './ChatField.style';

const ChatView = (props) => {
  const { room, user, socketChat } = props;
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  let userInterval = useRef();

  useEffect(() => {
    if (room) {
      userInterval.current = setInterval(() => {
        socketChat.emit('get-users', { roomname: room });
      }, 1000);
    }
  }, [room, socketChat]);

  useEffect(() => {
    socketChat.on('get-users', ({ users }) => setActiveUsers(users));
  }, [socketChat]);

  const sendMessage = (message) => {
    console.log(message);
    // socket.emit('get-users', { roomname });
    // if (message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  };

  return (
    <>
      <div className={classes.div}>
        <div id='message-container' className={classes.messageContainer}>
          <UserMessage />
          {room}
        </div>
      </div>
      <div className={classes.users}>
        <div id='message-container' className={classes.messageContainer}>
          {activeUsers.map((user) => (
            <p key={user.id}>{user.username}</p>
          ))}
        </div>
      </div>
      <div className={classes.form}>
        <TextField
          id='standard-textarea'
          autoComplete='off'
          placeholder='enter text'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant='contained' color='primary' onClick={() => sendMessage(message)}>
          Send
        </Button>
      </div>
    </>
  );
};

ChatView.propTypes = {
  room: PropTypes.string,
  socketChat: PropTypes.object,
  user: PropTypes.object,
};

const UserMessage = () => {
  return (
    <>
      asd asd
      <p>s</p>
    </>
  );
};
const OtherMessage = () => {};
const SystenMessage = () => {};

export default ChatView;
