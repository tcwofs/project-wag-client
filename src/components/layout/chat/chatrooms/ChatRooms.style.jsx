import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  roomRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialog: {
    '& .MuiDialog-paper': {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
  },
  floatingLabelFocusStyle: {
    color: theme.palette.text.primary,
  },
  form: {
    justifyContent: 'center',
    width: '99%',
  },
  checkbox: {
    color: theme.palette.text.primary,
  },
}));
