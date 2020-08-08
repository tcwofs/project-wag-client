import { Grid } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { DurakView, RoomView, RPSView, TTTView } from '../../pages';
import { AppHeader, ChatComponent } from '../index';
import AppMain from './AppMain';
import { useStyles } from './Routes.styles';

const Routes = () => {
  const classes = useStyles();

  return (
    <div className={classes.appContent} id='appContent'>
      <Router>
        <AppHeader />
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={12} sm={8}>
            <Switch>
              <Route path='/room' component={RoomView} exact />
              <Route path='/durak' component={DurakView} exact />
              <Route path='/rps' component={RPSView} exact />
              <Route path='/ttt' component={TTTView} exact />
              <Route component={AppMain} />
            </Switch>
          </Grid>
          <Grid item sm={12} md={4}>
            <ChatComponent />
          </Grid>
        </Grid>
      </Router>
    </div>
  );
};

export default Routes;
