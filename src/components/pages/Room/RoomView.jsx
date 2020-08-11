import { Button, Divider, Grid, Paper, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { UserContext } from '../../../app';
import { useStyles } from './RoomView.styles';

let socket;

const RoomView = () => {
  const classes = useStyles();
  const [roomname, setRoomname] = useState('');
  const [rooms, setRooms] = useState();
  const [clicked, setClicked] = useState(false);
  const { user } = useContext(UserContext);
  const { serviceName } = useParams();
  console.log(serviceName);
  let getRoomInterval = useRef();
  const [service, setService] = useState({});
  const url = `http://${window.location.host}/api/services`;

  const getServices = useCallback(async () => {
    try {
      const res = await axios.get(url);
      setService(res.data.find((item) => item.name === serviceName));
    } catch (err) {}
  }, [url]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  // useEffect(() => {
  //   return () => {
  //     socket.emit('disconnect');
  //     socket.off();
  //   };
  // }, []);

  // useEffect(() => {
  //   getRoomInterval.current = setInterval(() => {
  //     socket.emit('get-active-rooms', { type: service.type });
  //   }, 2000);
  // }, [service]);

  // useEffect(() => {
  //   socket.on('get-active-rooms', (recievedRooms) => {
  //     setRooms(recievedRooms);
  //   });
  // });

  // useEffect(() => {
  //   socket.on('error-redirect', (message) => {
  //     // window.alert(message.error);
  //     // window.location.href = `http://${window.location.host}/`;
  //   });
  //   socket.on('error-msg', (message) => {
  //     window.alert(message.error);
  //   });
  // }, []);

  const connectToNewRoom = () => {
    // if (roomname) {
    //   socket.emit('connect-new-room', { roomname, type: service.type });
    //   socket.on('room created', () => {
    //     clearInterval(getRoomInterval.current);
    //     setClicked(true);
    //   });
    // }
  };

  const connectToExistingRoom = (selectedRoom) => {
    // socket.emit('connect-exist-room', { roomname: selectedRoom, type: service.type });
    // socket.on('room created', () => {
    //   clearInterval(getRoomInterval.current);
    //   setClicked(true);
    // });
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        {clicked ? <Redirect push to={{ pathname: service.path, state: { username: user.username, roomname } }} /> : null}

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
              <div className={classes.createRoom}>
                <TextField
                  className={classes.createRoomInput}
                  onChange={(event) => setRoomname(event.target.value.trim().toLowerCase())}
                  label='new room name'
                />
                <Button className={classes.createRoomButton} variant='outlined' color='primary' onClick={connectToNewRoom}>
                  Create
                </Button>
              </div>
              <Typography variant='h6' gutterBottom>
                Connect to a existing one
              </Typography>
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
                      onClick={() => {
                        setRoomname(room.roomname.trim().toLowerCase());
                        connectToExistingRoom(room.roomname.trim().toLowerCase());
                      }}
                    >
                      connect
                    </Button>
                  </div>
                ))}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

RoomView.propTypes = {
  location: PropTypes.object,
};

export default RoomView;
