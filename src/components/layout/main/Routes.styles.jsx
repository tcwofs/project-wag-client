import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  appContent: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    height: 'inherit',
  },
  grid: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
