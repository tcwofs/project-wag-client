import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1vh',
    paddingBottom: '1vh',
    marginLeft: '1rem',
  },
  paper: {
    padding: '1rem',
    width: '95%',
    maxWidth: '80vw',
    marginRight: '1rem',
    marginLeft: '1rem',
    backgroundColor: theme.palette.background.fiveperc,
  },
  grid: {},
  roomInfo: {
    float: 'left',
    paddingTop: '1vh',
    width: '100%',
    height: '100%',
  },
  roomPanel: {
    float: 'right',
    paddingTop: '1vh',
    width: '100%',
    height: '100%',
    '& > form': {
      paddingBottom: '1vh',
    },
  },
  createRoomInput: {
    width: '100%',
    '& > *': {
      color: '#eeeeee',
    },
  },
  createRoomButton: {
    width: '100%',
    marginTop: '1vh',
    marginBottom: '1vh',
  },
  errorLabel: {
    textAlign: 'center',
    marginBottom: '0.5vh',
    color: theme.palette.text.error,
  },
  floatingLabelFocusStyle: {
    color: theme.palette.text.primary,
  },
  checkbox: {
    color: theme.palette.text.primary,
  },
  dialogContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  rooms: {
    maxHeight: '20rem',
    overflowY: 'scroll',
  },
}));
