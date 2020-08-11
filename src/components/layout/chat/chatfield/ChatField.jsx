import { Button, Divider, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useStyles } from './ChatField.style';

const ChatView = (props) => {
  const { room, user, socketChat } = props;
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  let messageBody = document.querySelector('#div');

  useEffect(() => {
    socketChat.on('emit-users', () => {
      socketChat.emit('get-users', { roomname: room });
    });
  }, [socketChat, room]);

  useEffect(() => {
    socketChat.on('emit-messages', () => {
      room && socketChat.emit('get-messages', { roomname: room });
    });
  }, [socketChat, room]);

  useEffect(() => {
    if (!room) {
      setMessages([]);
    }
  }, [room]);
  useEffect(() => {
    socketChat.on('get-users', ({ users }) => setActiveUsers(users));
    socketChat.on('get-messages', ({ messages }) => {
      setMessages(messages);
      if (messageBody) messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });
  }, [socketChat, messageBody]);

  const sendMessage = (message) => {
    if (!room) return;
    if (message) {
      socketChat.emit('send-message', { message, roomname: room, user });
      socketChat.emit('get-messages', { roomname: room });
      setMessage('');
    }
  };

  return (
    <>
      <div id='div' className={`${classes.div} ${classes.util}`}>
        <MessageContainer messages={messages} id={user.id} classes={classes} />
      </div>
      <Divider orientation='vertical' flexItem className={`${classes.util} ${classes.divider}`} />
      <div className={`${classes.users} ${classes.util}`}>
        {activeUsers.map((user) => (
          <p key={user.id}>{user.username}</p>
        ))}
      </div>
      <div className={classes.form}>
        <TextField
          id='standard-textarea'
          autoComplete='off'
          placeholder='enter text'
          value={message}
          multiline
          rows='3'
          rowsMax='3'
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant='contained' color='primary' onClick={() => sendMessage(message)}>
          Send
        </Button>
      </div>
    </>
  );
};

const MessageContainer = (props) => (
  <>
    {props.messages.map((message) => (
      <p
        key={message.id}
        className={
          message.from === 'System' ? props.classes.systemMessage : message.from === props.id ? props.classes.userMessage : props.classes.otherMessage
        }
      >
        {`[${message.username}]: ${message.text}`}
      </p>
    ))}
  </>
);

ChatView.propTypes = {
  room: PropTypes.string,
  socketChat: PropTypes.object,
  user: PropTypes.object,
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  id: PropTypes.string,
  classes: PropTypes.object,
};

export default ChatView;
