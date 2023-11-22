import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

export const alertSnackBar = (message: string, type: 'success' | 'error') => {
  dispatch(
    openSnackbar({
      open: true,
      message: message,
      variant: 'alert',
      alert: {
        color: type
      },
      close: false
    })
  );
};
