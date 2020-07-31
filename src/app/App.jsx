import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { createContext, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Routes } from '../components/layout';
import generateName from '../components/utils/nameGenerator';
import { darkTheme, lightTheme } from '../styles';

const user = { id: uuidv4(), username: generateName() };
const socketMain = io(`http://${window.location.host}/login`).emit('new-user-connection', { user });
const socketChat = io(`http://${window.location.host}/chat`);

export const AppContext = createContext({});
export const UserContext = createContext({});
export const SocketContext = createContext({});

const App = () => {
  // TODO: remove socketMain.id. Use uuid instead. get rid of it on bakend
  // ? // TODO: How about separate users for chat and main and their rooms
  // ! // TODO: make /login go /main. remove default namespace actions
  const [theme, setTheme] = useState(darkTheme);
  const switchTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ switchTheme }}>
        <UserContext.Provider value={{ user }}>
          <SocketContext.Provider value={{ socketMain, socketChat }}>
            <Routes />
          </SocketContext.Provider>
        </UserContext.Provider>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
