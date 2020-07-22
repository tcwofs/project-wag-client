import { Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useStyles } from './TTTView.styles';

let socket;

const TTTView = props => {
  const classes = useStyles();
  const [finishgame, setFinishgame] = useState(null);
  const [lobby, setLobby] = useState(true);
  const [users, setUsers] = useState([]);
  const [field, setField] = useState([
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ]);
  const [status, setStatus] = useState(null);
  const [symbol, setSymbol] = useState(null);

  if (!props.location.state) {
    window.location.href = `http://${window.location.host}/`;
  }
  const { username, roomname } = props.location.state;
  const ENDPOINT = 'http://' + window.location.host + '/ttt';

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('connect-room', { roomname });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, username, roomname]);

  useEffect(() => {
    socket.on('error-redirect', message => {
      window.alert(message.error);
      window.location.href = `http://${window.location.host}/`;
    });
    socket.on('error-msg', message => {
      window.alert(message.error);
    });
  }, []);

  useEffect(() => {
    socket.on('get-room-users', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    socket.on('start-game', () => {
      setLobby(false);
    });

    socket.on('finish-game', ({ lostuser }) => {
      setFinishgame(lostuser.username);
    });

    socket.on('update-field', ({ updatedfield, updatedStatus, newSymbol }) => {
      setField(updatedfield);
      setStatus(updatedStatus);
      setSymbol(newSymbol);
    });
  });

  const userReady = () => {
    socket.emit('user-ready', { roomname });
  };

  const userMove = cell => {
    socket.emit('user-move', { cell });
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography style={{ textAlign: 'center' }} variant='h4'>
          {roomname}
        </Typography>
        <Divider style={{ marginBottom: '1rem' }} light />
        {finishgame !== null ? (
          <div>
            <p style={{ textAlign: 'center' }}>{finishgame} lost! game ended</p>
            <Button variant='contained' color='secondary' href={`http://${window.location.host}/`}>
              Go Home
            </Button>
          </div>
        ) : (
          [
            lobby ? (
              <div key={1}>
                {users.map(user => (
                  <p key={user.id}>
                    {user.username} | {user.ready ? 'ready' : 'not ready'}
                  </p>
                ))}
                <Button variant='contained' color='secondary' onClick={userReady}>
                  <Typography>Ready</Typography>
                </Button>
              </div>
            ) : (
              <div key={2}>
                <Typography style={{ textAlign: 'center' }}>
                  {symbol && `Your symbol: ${symbol}`} | {status && status === 'attacking' ? 'You are attacking' : 'Wait for your turn'}
                </Typography>
                <Grid container spacing={1} direction='column' alignItems='center' justify='center'>
                  {field &&
                    field.map((row, rowIndex) => (
                      <Grid item xs={12} key={uuidv4()}>
                        <Grid container spacing={1} alignItems='flex-start' justify='flex-end' direction='row'>
                          {row.map((item, itemIndex) => (
                            <Grid item xs={4} key={uuidv4()}>
                              <Paper
                                style={{
                                  height: '10em',
                                  maxHeight: '20vh',
                                  width: '10rem',
                                  maxWidth: '100%',
                                  background: item === 'x' ? '#BB86FC' : item === 'o' ? '#03DAC6' : '#242424',
                                }}
                                onClick={e => {
                                  status && status === 'attacking' && item === ' ' ? userMove(`${rowIndex}${itemIndex}`) : e.preventDefault();
                                }}
                              >
                                {item.toUpperCase()}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </div>
            ),
          ]
        )}
      </Paper>
    </div>
  );
};

TTTView.propTypes = {
  location: PropTypes.object,
};

export default TTTView;
