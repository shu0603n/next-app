import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { DeleteFilled } from '@ant-design/icons';
import { ClientType } from 'types/client/client';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// types
interface Props {
  deleteId: string;
  deleteName: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  onReload: (data: Array<ClientType>) => void;
}

// ==============================|| 顧客 - 削除 ||============================== //

// export default function AlertCustomerDelete({ deleteId, deleteName, open, handleClose, onReload }: Props) {
//   const handleDelete = async (deleteId: string) => {
//     try {
//       const response = await fetch(`/api/db/client/delete?id=${deleteId}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('削除に失敗しました');
//       }

//       const data = await response.json();
//       console.log('削除成功:', data);
//       onReload(data.projects);
//       handleClose(false);
//     } catch (error) {
//       console.error('エラー:', error);
//     }
//   };

export default function AlertCustomerDelete({ deleteId, deleteName, open, handleClose, onReload }: Props) {
  const handleDelete = (isDelete: boolean) => {
    if (isDelete) {
      alertSnackBar('処理中…', 'secondary');
      fetch(`/api/db/client/delete?id=${deleteId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('データの削除に失敗しました。');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.data);
          onReload(data.data);
          alertSnackBar('正常に削除されました。', 'success');
        })
        .catch((error) => {
          console.error('エラー:', error);
          alertSnackBar('データの削除に失敗しました。', 'error');
        })
        .finally(() => {
          handleClose(isDelete);
        });
    }
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
              「
              <Typography variant="subtitle1" component="span">
                {' '}
                {deleteName}{' '}
              </Typography>
              」を削除すると、そのプロジェクトに割り当てられたすべてのタスクも削除されます。
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              キャンセル
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleDelete(true)} autoFocus>
              削除
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
