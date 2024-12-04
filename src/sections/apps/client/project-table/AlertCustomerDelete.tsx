// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { ProjectTableType } from 'types/client/project-table';

// types
interface Props {
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  reloadDataAfterDelete: (data: ProjectTableType[]) => void;
}

// ==============================|| 顧客 - 削除 ||============================== //

export default function AlertCustomerDelete({ title, open, handleClose, reloadDataAfterDelete }: Props) {
  const handleDelete = async (title: string) => {
    try {
      const response = await fetch(`/api/db/client/delete?id=${title}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      const data = await response.json();
      console.log('削除成功:', data);
      reloadDataAfterDelete(data);
      handleClose(false);
    } catch (error) {
      console.error('エラー:', error);
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
                {title}{' '}
              </Typography>
              」ユーザーを削除すると、そのユーザーに割り当てられたすべてのタスクも削除されます。
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              キャンセル
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleDelete(title)} autoFocus>
              削除
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
