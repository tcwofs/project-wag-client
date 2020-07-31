import { Divider, Grid, Paper } from '@material-ui/core';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SocketContext, UserContext } from '../../../app';
import { useStyles } from './ChatComponent.style';
import ChatField from './chatfield/ChatField';
import ChatRooms from './chatrooms/ChatRooms';

export const RoomContext = createContext({});

const ChatComponent = () => {
  const [room, setRoom] = useState();
  const { socketChat } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    socketChat.on('error-redirect', ({ error }) => {
      window.alert(error);
      window.location.href = `http://${window.location.host}/`;
    });
  }, [socketChat]);

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item md={12} className={classes.chatRooms}>
            <ChatRooms room={room} setRoom={setRoom} socketChat={socketChat} user={user} />
          </Grid>
          <Divider />
          <Grid item md={12} className={classes.chatField}>
            <ChatField room={room} socketChat={socketChat} user={user} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ChatComponent;
