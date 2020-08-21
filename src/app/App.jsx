import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Routes } from '../components/layout';
import generateName from '../components/utils/nameGenerator';
import { darkTheme, lightTheme } from '../styles';

const user = { id: uuidv4(), username: generateName() };
const socketChat = io(`http://${window.location.host}/chat`);
io(`http://${window.location.host}/login`).emit('new-user-connection', { user });

export const AppContext = createContext({});
export const UserContext = createContext({});
export const SocketContext = createContext({});

const App = () => {
  const [theme, setTheme] = useState(darkTheme);
  const switchTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  const updateHeight = () => {
    let check = document.getElementById('main').scrollHeight + document.getElementById('header').scrollHeight > window.innerHeight;
    let height = check ? 'auto' : `${window.innerHeight}px`;
    document.getElementById('root').style.height = height;
    document.getElementById('root').style.backgroundColor = theme.palette.background.default;
  };

  useEffect(() => {
    window.addEventListener('resize', updateHeight);

    window.addEventListener('wheel', updateHeight);
    updateHeight();
    return () => [window.addEventListener('wheel', updateHeight), window.removeEventListener('resize', updateHeight)];
  });

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ switchTheme, updateHeight }}>
        <UserContext.Provider value={{ user }}>
          <SocketContext.Provider value={{ socketChat }}>
            <Routes />
          </SocketContext.Provider>
        </UserContext.Provider>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
