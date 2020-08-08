import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  div: {
    width: '65%',
    overflowY: 'scroll',
  },
  users: {
    width: '35%',
    paddingLeft: '0.3rem',
    overflowY: 'scroll',
  },
  divider: {
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
  },
  util: {
    minHeight: '50px',
    maxHeight: '250px',
    marginBottom: '5rem',
  },
  title: {
    textAlign: 'center',
    padding: '0',
    margin: '0',
  },
  form: {
    position: 'absolute',
    bottom: '0.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiTextField-root': {
      width: '100%',
      marginRight: '5px',
    },
  },
  systemMessage: {
    padding: '1rem',
    textAlign: 'center',
    background: theme.palette.background.sevenperc,
  },
}));
