import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  appContent: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    height: '100%',
  },
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
    width: '100%',
    maxWidth: '80vw',
    backgroundColor: theme.palette.background.fiveperc,
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
  card: {
    backgroundColor: theme.palette.background.eightperc,
    color: theme.palette.text.primary,
    width: 'auto',
  },
  cardMedia: {
    height: '15vh',
    filter: 'blur(10px)',
  },
  errorLabel: {
    textAlign: 'center',
    marginBottom: '0.5vh',
    color: theme.palette.text.error,
  },
}));
