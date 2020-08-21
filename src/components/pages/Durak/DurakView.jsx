import { Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../../../app';
import { useStyles } from './DurakView.styles';

let socket;

const DurakView = () => {
  const classes = useStyles();
  const [finishgame, setFinishgame] = useState(null);
  const [userhand, setUserhand] = useState([]);
  const [lastcard, setLastcard] = useState();
  const [otherusers, setOtherusers] = useState();
  const [cardcount, setCardcount] = useState();
  const [userstatus, setUserStatus] = useState('other');
  const [field, setField] = useState();
  const [userfinished, setUserfinished] = useState(false);
  const ENDPOINT = `${window.location.host}/durak`;
  const { roomId } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    socket = io(ENDPOINT).emit('get-room-durak', { roomId, user });

    return () => {
      socket.off();
    };
  }, [ENDPOINT, roomId, user]);

  useEffect(() => {
    socket.on('error-redirect', (message) => {
      window.alert(message.error);
      window.location.href = `http://${window.location.host}/`;
    });
    socket.on('error-msg', (message) => {
      window.alert(message.error);
    });
  }, []);

  useEffect(() => {
    socket.on('handcards', ({ recievedUserhand, allcards, userhands, status, finished }) => {
      setUserhand(recievedUserhand);
      setLastcard(allcards.lastcard);
      setCardcount(allcards.cardcount);
      setField(allcards.field);
      setOtherusers(userhands);
      setUserStatus(status);
      setUserfinished(finished);
    });

    socket.on('update-field', ({ updatedField, updatedUserhand }) => {
      setField(updatedField);
      setUserhand(updatedUserhand);
    });

    socket.on('finish-game', ({ lostuser }) => {
      setFinishgame(lostuser.username);
    });

    socket.on('play-again', () => {
      setFinishgame(null);
      socket.emit('get-room-durak', { roomId, user });
    });
  });

  const cardAttack = ({ card, second }) => {
    socket.emit('attack', { card, roomId, second });
  };

  const cardDeffence = ({ card }) => {
    socket.emit('defence', { card, roomId });
  };

  const finishMove = () => {
    setUserfinished(!userfinished);
    socket.emit('finish-move', { roomId });
  };

  const playAgain = () => {
    socket.emit('play-again', { roomId });
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography style={{ textAlign: 'center' }} variant='h4'>
          {}
        </Typography>
        <Divider style={{ marginBottom: '1rem' }} light />
        {finishgame !== null ? (
          <div>
            <p style={{ textAlign: 'center' }}>{finishgame} lost! game ended</p>
            <Button variant='contained' color='secondary' href={`http://${window.location.host}/`}>
              Go Home
            </Button>
            <Button variant='contained' color='secondary' onClick={playAgain}>
              Play Again
            </Button>
          </div>
        ) : (
          <div className={classes.gamefield} key={1}>
            <Grid container spacing={2} alignItems='flex-start' justify='flex-end' direction='row'>
              {otherusers ? (
                otherusers.map((othuser) => (
                  <Grid item xs={12 / otherusers.length} key={uuidv4()}>
                    <img
                      alt=''
                      style={{
                        maxWidth: '4rem',
                        width: '80%',
                        height: 'auto',
                      }}
                      src={process.env.PUBLIC_URL + '/cards/gray_back.png'}
                    />
                    <div>
                      <Typography>{othuser.username}</Typography>
                      <Typography>{othuser.handlength}</Typography>
                    </div>
                  </Grid>
                ))
              ) : (
                <></>
              )}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Grid container spacing={1}>
                  {field &&
                    field.map((row) => (
                      <Grid item xs={2} key={uuidv4()}>
                        {row.map((item) => (
                          <img
                            key={uuidv4()}
                            alt=''
                            style={{
                              maxWidth: '6rem',
                              width: '100%',
                              height: 'auto',
                            }}
                            src={process.env.PUBLIC_URL + `/cards/${item}.png`}
                          />
                        ))}
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Grid item xs={3} style={{ position: 'relative' }}>
                <img
                  alt=''
                  style={{
                    position: 'relative',
                    maxWidth: '6rem',
                    width: '100%',
                    height: 'auto',
                  }}
                  src={process.env.PUBLIC_URL + `/cards/${lastcard}.png`}
                />
                <img
                  alt=''
                  style={{
                    transform: 'rotate(90deg)',
                    maxWidth: '6rem',
                    width: '80%',
                    height: 'auto',
                    position: 'absolute',
                    top: '30px',
                    left: '20px',
                  }}
                  src={process.env.PUBLIC_URL + '/cards/gray_back.png'}
                />
                <div>
                  <Typography>{cardcount}</Typography>
                  {userstatus === 'other' || !userstatus ? (
                    <Typography>Please wait for you turn</Typography>
                  ) : userstatus === 'attacking_1' ? (
                    <div>
                      <Typography>You are attacking 1st</Typography>
                      <Button variant='contained' color='secondary' onClick={finishMove}>
                        {!userfinished ? <Typography>Finish</Typography> : <Typography>Cancel</Typography>}
                      </Button>
                    </div>
                  ) : userstatus === 'attacking_2' ? (
                    <div>
                      <Typography>You are attacking 2nd</Typography>
                      <Button variant='contained' color='secondary' onClick={finishMove}>
                        {!userfinished ? <Typography>Finish</Typography> : <Typography>Cancel</Typography>}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Typography>You are defending</Typography>
                      <Button variant='contained' color='secondary' onClick={finishMove}>
                        {field.filter((row) => row.length % 2 === 0).length === field.length ? (
                          !userfinished ? (
                            <Typography>Draft</Typography>
                          ) : (
                            <Typography>Cancel</Typography>
                          )
                        ) : !userfinished ? (
                          <Typography>Take</Typography>
                        ) : (
                          <Typography>Cancel</Typography>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={0}>
                  {userhand &&
                    userhand.map((card) => (
                      <Grid item xs={2} md={1} key={uuidv4()}>
                        <div>
                          <img
                            alt=''
                            style={{ maxWidth: '6rem', width: '100%', height: 'auto' }}
                            src={process.env.PUBLIC_URL + `/cards/${card}.png`}
                            onClick={(e) => {
                              userstatus === 'attacking_1'
                                ? cardAttack({ card, second: false })
                                : userstatus === 'attacking_2'
                                ? cardAttack({ card, second: true })
                                : userstatus === 'defending'
                                ? cardDeffence({ card })
                                : e.preventDefault();
                            }}
                          />
                        </div>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default DurakView;
