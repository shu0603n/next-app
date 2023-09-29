// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { dbResponse } from 'types/dbResponse';

// types
interface Props {
  id: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  onReload: (data: dbResponse) => void;
}

// ==============================|| 顧客 - 削除 ||============================== //

export default function AlertCustomerDelete({ id, open, handleClose, onReload }: Props) {
  const handleClick = (isDelete: boolean) => {
    if (isDelete) {
      fetch(`/api/db/parameter/project_type/delete?id=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('データの削除に失敗しました。');
          }
          return response.json();
        })
        .then((data) => {
          onReload(data);
          dispatch(
            openSnackbar({
              open: true,
              message: 'パラメーターが正常に削除されました。',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        })
        .catch((error) => {
          console.error('エラー:', error);
          dispatch(
            openSnackbar({
              open: true,
              message: 'データの削除に失敗しました。',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: false
            })
          );
        });
    }

    handleClose(isDelete);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <DeleteFilled />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              削除してもよろしいですか？
            </Typography>
            <Typography align="center">
              {'ID:('}
              <Typography variant="subtitle1" component="span">
                {id}
                {') '}
              </Typography>
              を削除すると、関連するデータも削除されます。
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClick(false)} color="secondary" variant="outlined">
              キャンセル
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleClick(true)} autoFocus>
              削除
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
