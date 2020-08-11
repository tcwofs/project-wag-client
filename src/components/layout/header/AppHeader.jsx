import { AppBar, ClickAwayListener, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useContext, useState } from 'react';
import { AppContext, UserContext } from '../../../app';
import { useStyles } from './AppHeader.styles';

const AppHeader = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { switchTheme } = useContext(AppContext);
  const { user } = useContext(UserContext);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div id='header' className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography data-testid='title' variant='h5' className={classes.title} color='textSecondary'>
            {'>'} project wag
          </Typography>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={`[${user.username} // ${user.id}]`}
            >
              <Typography noWrap onClick={handleTooltipOpen} data-testid='username'>
                {user.username}
              </Typography>
            </Tooltip>
          </ClickAwayListener>
          <IconButton data-testid='theme-changer-button' color='inherit' onClick={switchTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppHeader;
