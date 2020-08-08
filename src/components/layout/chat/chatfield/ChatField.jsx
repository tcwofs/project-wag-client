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
    socketChat.on('get-messages', ({ messages }) => setMessages(messages));
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
      <div className={`${classes.div} ${classes.util}`}>
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
    {props.messages.map((message) =>
      message.from === 'System' ? (
        <SystenMessage key={message.id} message={message.text} classes={props.classes} />
      ) : message.from === props.id ? (
        <UserMessage key={message.id} message={message.text} classes={props.classes} />
      ) : (
        <OtherMessage key={message.id} message={message.text} classes={props.classes} />
      )
    )}
  </>
);

const UserMessage = (props) => <p className={props.classes.userMessage}>user</p>;
const OtherMessage = (props) => <p className={props.classes.userMessage}>other</p>;
const SystenMessage = (props) => <p className={props.classes.systemMessage}>{props.message}</p>;

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

OtherMessage.propTypes = {
  message: PropTypes.string,
  classes: PropTypes.object,
};

UserMessage.propTypes = {
  message: PropTypes.string,
  classes: PropTypes.object,
};

SystenMessage.propTypes = {
  message: PropTypes.string,
  classes: PropTypes.object,
};

export default ChatView;
