import { Button, Card, CardActions, CardContent, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from './AppMain.styles';

const AppMain = () => {
  const classes = useStyles();
  const url = `http://${window.location.host}/api/services`;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getServices = useCallback(async () => {
    try {
      const res = await axios.get(url);
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  }, [url]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const renderCollection = useCallback(
    () =>
      services.map((service) => (
        <Grid item md={6} xs={12} key={service.id}>
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {service.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to={`/room/${service.type}`} size='small' variant='outlined' color='secondary'>
                start
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )),
    [services, classes.card]
  );

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div className={classes.errorLabel}>{error}</div>
        {loading ? (
          <LinearProgress className={classes.progress} color='secondary' />
        ) : (
          <Grid className={classes.grid} container spacing={2}>
            {renderCollection()}
          </Grid>
        )}
      </Paper>
    </div>
  );
};

export default AppMain;
