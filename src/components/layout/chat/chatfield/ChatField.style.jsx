import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  div: {
    width: '65%',
  },
  users: {
    width: '35%',
    paddingLeft: '0.3rem',
  },
  title: {
    textAlign: 'center',
    padding: '0',
    margin: '0',
  },
  messageContainer: {
    minHeight: '50px',
    maxHeight: '250px',
    width: '100%',
    marginBottom: '2rem',
    overflowY: 'scroll',
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
}));
