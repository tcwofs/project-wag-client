import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Add, AddComment, ArrowForward, Close, Delete, ExitToApp } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useStyles } from './ChatRooms.style';

const ChatView = (props) => {
  const { setRoom, socketChat, user } = props;
  const classes = useStyles();
  const [chatRooms, setChatRooms] = useState([]);
  const [enteredChatRooms, setEnteredChatRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [connectPassword, setConnectPassword] = useState('');
  const [value, setValue] = useState(0);
  const [roomOpen, setRoomOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [roomError, setRoomError] = useState(false);
  const [roomErrorText, setRoomErrorText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [privateRoom, setPrivateRoom] = useState(false);

  useEffect(() => {
    if (roomOpen) socketChat.emit('get-all-chatrooms');
  }, [socketChat, roomOpen]);

  useEffect(() => {
    socketChat.on('get-user-chatrooms', ({ rooms }) => {
      if (!rooms || rooms.length === 0) {
        setRoom('');
        return setEnteredChatRooms([]);
      }
      if (rooms.length === 1) setRoom(rooms[0].roomname);
      setEnteredChatRooms(rooms);
    });
  }, [setRoom, socketChat]);

  useEffect(() => {
    socketChat.on('get-all-chatrooms', ({ rooms }) => {
      setChatRooms(rooms);
    });
  }, [enteredChatRooms, socketChat]);

  useEffect(() => {
    socketChat.on('emit-user-chatrooms', () => {
      socketChat.emit('get-user-chatrooms');
    });
    socketChat.on('emit-all-chatrooms', () => {
      socketChat.emit('get-all-chatrooms');
    });
  }, [socketChat]);

  const deleteRoom = ({ roomname }) => {
    socketChat.emit('del-room', { roomname });
  };

  const leaveRoom = ({ roomname }) => {
    socketChat.emit('leave-room', { roomname, user });
  };

  const addRoom = ({ roomname, password = null, privateRoom }) => {
    socketChat.emit('new-chat-room', { roomname, password, privateRoom });
    socketChat.on('new-chat-room-confirmed', ({ error }) => {
      setRoomError(!!error);
      setRoomErrorText(error);
      if (!error) {
        setRoomName('');
        setRoomPassword('');
        socketChat.emit('get-messages', { roomname });
      }
    });
  };

  const connectRoom = ({ roomname, password }) => {
    socketChat.emit('connect-chat-room', { roomname, password });
    socketChat.on('connect-chat-room-confirmed', ({ errorRoom, errorPassword }) => {
      setRoomError(!!errorRoom);
      setRoomErrorText(errorRoom);
      setPasswordError(!!errorPassword);
      setPasswordErrorText(errorPassword);
      if (!errorRoom && !errorPassword) {
        setRoomName('');
        socketChat.emit('get-all-chatrooms');
        socketChat.emit('get-messages', { roomname });
      }
    });
  };

  return (
    <>
      <AppBar position='static' color='default' className={classes.roomRow}>
        <IconButton aria-label='add' onClick={() => setRoomOpen(true)}>
          <AddComment />
        </IconButton>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {enteredChatRooms.map((value, index) => (
            <Tab
              key={index}
              wrapped
              label={value.roomname}
              onClick={() => {
                setRoom(value.roomname);
                socketChat.emit('get-users', { roomname: value.roomname });
                socketChat.emit('get-messages', { roomname: value.roomname });
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      <Dialog fullScreen open={roomOpen} onClose={() => setRoomOpen(false)} className={classes.dialog}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={() => setRoomOpen(false)} aria-label='close'>
              <Close />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Add or delete chat rooms
            </Typography>
          </Toolbar>
        </AppBar>
        <List className={classes.roomsList}>
          {chatRooms.map((value, index) => (
            <ListItem key={index}>
              <ListItemText primary={value.roomname} />
              <ListItemSecondaryAction>
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={() => (value.password ? setPasswordOpen(true) : connectRoom({ roomname: value.roomname }))}
                >
                  <Add />
                </IconButton>
                {value.password ? (
                  <Dialog
                    open={passwordOpen}
                    onClose={() => setPasswordOpen(false)}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                  >
                    <DialogTitle id='alert-dialog-title'>{'Enter room password'}</DialogTitle>
                    <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
                      <TextField
                        type='password'
                        label='password'
                        error={passwordError}
                        value={connectPassword}
                        autoFocus
                        helperText={passwordErrorText}
                        onChange={(event) => setConnectPassword(event.target.value)}
                        InputLabelProps={{
                          className: classes.floatingLabelFocusStyle,
                        }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setPasswordOpen(false)} color='primary'>
                        Close
                      </Button>
                      <Button onClick={() => connectRoom({ roomname: value.roomname, password: connectPassword })} color='primary'>
                        Connect
                      </Button>
                    </DialogActions>
                  </Dialog>
                ) : (
                  <></>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List className={classes.roomsList}>
          {enteredChatRooms.map((value, index) => (
            <ListItem key={index}>
              <ListItemText primary={value.roomname} />

              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete' onClick={() => leaveRoom({ roomname: value.roomname })}>
                  <ExitToApp />
                </IconButton>
                {value.host.id === user.id ? (
                  <IconButton edge='end' aria-label='delete' onClick={() => deleteRoom({ roomname: value.roomname })}>
                    <Delete />
                  </IconButton>
                ) : (
                  <></>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
          <TextField
            required
            label='name'
            error={roomError}
            value={roomName}
            helperText={roomErrorText}
            onChange={(event) => setRoomName(event.target.value)}
            InputLabelProps={{
              className: classes.floatingLabelFocusStyle,
            }}
          />
          <TextField
            style={{ marginLeft: '0.7rem' }}
            type='password'
            label='password'
            error={passwordError}
            value={roomPassword}
            helperText={passwordErrorText}
            onChange={(event) => setRoomPassword(event.target.value)}
            InputLabelProps={{
              className: classes.floatingLabelFocusStyle,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={privateRoom}
                onChange={(event) => setPrivateRoom(event.target.checked)}
                color='primary'
                className={classes.checkbox}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label='private'
          />
          <Button size='small' aria-label='add' onClick={() => addRoom({ roomname: roomName, password: roomPassword, privateRoom })}>
            <Add />
          </Button>
          <Button size='small' aria-label='add' onClick={() => connectRoom({ roomname: roomName, password: roomPassword })}>
            <ArrowForward />
          </Button>
        </form>
      </Dialog>
    </>
  );
};

ChatView.propTypes = {
  room: PropTypes.string,
  setRoom: PropTypes.func,
  socketChat: PropTypes.object,
  user: PropTypes.object,
};

export default ChatView;
