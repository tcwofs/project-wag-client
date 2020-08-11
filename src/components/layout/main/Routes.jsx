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
        <Grid id='main' container spacing={3} className={classes.grid}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={8}>
            <Switch>
              <Route path='/room/:serviceName' component={RoomView} exact />
              <Route path='/durak/:roomId' component={DurakView} exact />
              <Route path='/rps/:roomId' component={RPSView} exact />
              <Route path='/ttt/:roomId' component={TTTView} exact />
              <Route component={AppMain} />
            </Switch>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={4}>
            <ChatComponent />
          </Grid>
        </Grid>
      </Router>
    </div>
  );
};

export default Routes;
