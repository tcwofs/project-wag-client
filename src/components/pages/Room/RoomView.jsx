import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add, ArrowForward } from '@material-ui/icons';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link as RouterLink, Redirect, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContext } from '../../../app';
import { useStyles } from './RoomView.styles';

const socketMain = io(`http://${window.location.host}/main`);

const RoomView = (props) => {
  const { user } = useContext(UserContext);
  const [service, setService] = useState(props.location.state ? props.location.state.service : null);
  const { serviceName } = useParams();
  const [connectPassword, setConnectPassword] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const classes = useStyles();
  const [rooms, setRooms] = useState();
  const [error, setError] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [roomError, setRoomError] = useState(false);
  const [roomErrorText, setRoomErrorText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [privateRoom, setPrivateRoom] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [room, setRoom] = useState();
  const [state, setState] = useState('loading');
  const [users, setUsers] = useState([]);
  const url = `http://${window.location.host}/api/services`;

  const getServices = useCallback(async () => {
    if (!service) {
      try {
        const res = await axios.get(url);
        setService(res.data.find((item) => item.type === serviceName));
        setState('rooms');
      } catch (err) {
        setError(err);
      }
    } else {
      setState('rooms');
    }
  }, [url, service, serviceName]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  useEffect(() => {
    socketMain.on('get-all-rooms', ({ rooms }) => {
      setRooms(rooms);
    });
    socketMain.on('get-room-users', ({ users }) => {
      setUsers(users);
    });
    socketMain.on('start-game', () => {
      setRedirect(true);
    });
    socketMain.on('error-redirect', ({ error }) => {
      window.alert(error);
      window.location.href = `http://${window.location.host}/`;
    });
    socketMain.on('error-msg', ({ error }) => {
      window.alert(error);
    });
    return () => {
      socketMain.off();
    };
  }, []);

  useEffect(() => {
    if (service) {
      socketMain.emit('get-all-rooms', { type: service.type });
      socketMain.on('emit-all-rooms', () => {
        socketMain.emit('get-all-rooms', { type: service.type });
      });
    }
  }, [service]);

  useEffect(() => {
    socketMain.on('emit-room-users', () => {
      if (room) {
        socketMain.emit('get-room-users', { roomname: room.roomname });
      }
    });
  }, [room]);

  const addRoom = ({ roomname, password = null, privateRoom }) => {
    socketMain.emit('new-room', { roomname, password, privateRoom, type: service.type });
    socketMain.on('new-chat-room-confirmed', ({ error, room }) => {
      setRoomError(!!error);
      setRoomErrorText(error);
      if (!error) {
        setRoom(room);
        setUsers(room.users);
        setState('lobby');
      }
    });
  };

  const connectRoom = ({ roomname, password }) => {
    socketMain.emit('connect-room', { roomname, password });
    socketMain.on('connect-room-confirmed', ({ errorRoom, errorPassword, room }) => {
      setRoomError(!!errorRoom);
      setRoomErrorText(errorRoom);
      setPasswordError(!!errorPassword);
      setPasswordErrorText(errorPassword);
      if (!errorRoom && !errorPassword) {
        setRoom(room);
        setUsers(room.users);
        setState('lobby');
      }
    });
  };

  const userReady = () => {
    socketMain.emit('user-ready', { roomname: room.roomname, user });
  };

  const leaveRoom = () => {
    if (room) {
      socketMain.emit('leave-room', { roomname: room.roomname, user });
    }
  };

  const renderSwitch = (state) => {
    switch (state) {
      case 'loading':
        return <LinearProgress className={classes.progress} color='secondary' />;
      case 'rooms':
        return (
          <Grid className={classes.grid} container spacing={2}>
            <Grid item md={8} xs={12}>
              <Typography variant='h4'>{service.name}</Typography>
              <Divider />
              <div className={classes.roomInfo}>
                <Typography variant='h6' gutterBottom>
                  {service.overview}
                </Typography>
                <Divider light />
                <Typography variant='subtitle1' gutterBottom>
                  {service.rules}
                </Typography>
              </div>
            </Grid>

            <Grid item md={4} xs={12}>
              <div className={classes.roomPanel}>
                <Typography variant='h6'>Create new room</Typography>
                <form className={classes.createRoom} onSubmit={(event) => event.preventDefault()}>
                  <Grid container spacing={2}>
                    <Grid item>
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
                    </Grid>
                    <Grid item>
                      <TextField
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
                    </Grid>
                    <Grid item>
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
                    </Grid>
                  </Grid>
                </form>
                <Typography variant='h6' gutterBottom>
                  Connect to a existing one
                </Typography>
                <div className={classes.rooms}>
                  {rooms &&
                    rooms.map((room) => (
                      <div key={room.id}>
                        <p>
                          {room.roomname}
                          {service.maxUsers ? ` (${room.users.length} / ${service.maxUsers})` : null}
                        </p>
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={() => (room.password ? setPasswordOpen(true) : connectRoom({ roomname: room.roomname, room }))}
                        >
                          connect
                        </Button>
                        {room.password ? (
                          <Dialog
                            open={passwordOpen}
                            onClose={() => setPasswordOpen(false)}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                          >
                            <DialogTitle id='alert-dialog-title'>{'Enter room password'}</DialogTitle>
                            <DialogContent className={classes.dialogContent}>
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
                              <Button onClick={() => connectRoom({ roomname: room.roomname, password: connectPassword })} color='primary'>
                                Connect
                              </Button>
                            </DialogActions>
                          </Dialog>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </Grid>
          </Grid>
        );
      case 'lobby':
        return (
          <>
            <Typography style={{ textAlign: 'center' }} variant='h4'>
              {room.roomname}
            </Typography>
            {users.map((user) => (
              <p key={user.id}>
                {user.username} | {user.ready ? 'ready' : 'not ready'}
              </p>
            ))}
            <Button variant='contained' color='secondary' onClick={userReady}>
              <Typography>Ready</Typography>
            </Button>
          </>
        );
      default:
        return <LinearProgress className={classes.progress} color='secondary' />;
    }
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Button component={RouterLink} to={`/`} size='small' variant='outlined' color='secondary' style={{ float: 'right' }} onClick={leaveRoom}>
          back
        </Button>
        {redirect ? <Redirect push to={{ pathname: `/${service.type}/${room.id}`, state: { room, user } }} /> : <></>}
        <div className={classes.errorLabel}>{error}</div>
        {renderSwitch(state)}
      </Paper>
    </div>
  );
};

export default RoomView;
