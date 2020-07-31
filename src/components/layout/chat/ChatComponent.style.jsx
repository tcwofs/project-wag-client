import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: '1rem',
  },
  paper: {
    padding: '1rem',
    maxWidth: '80vw',
    width: '95%',
    backgroundColor: theme.palette.background.fiveperc,
  },
  gridContainer: {
    minHeight: '50px',
    maxHeight: '700px',
    display: 'flex',
    justifyContent: 'center',
  },
  chatField: {
    minHeight: '50px',
    maxHeight: '350px',
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  chatRooms: {
    minHeight: '50px',
    width: '100%',
    padding: '0',
    margin: '0',
  },
}));
