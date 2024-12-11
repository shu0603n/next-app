// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// next
import { useRouter } from 'next/router';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { DeleteFilled } from '@ant-design/icons';
import { EmployeeType } from 'types/employee/employee';

// types
interface Props {
  deleteId: string;
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
  onReload: (data: EmployeeType) => void;
}

// ==============================|| 顧客 - 削除 ||============================== //

export default function AlertCustomerDelete({ deleteId, title, open, handleClose, onReload }: Props) {
  const router = useRouter();
  const handleDelete = async (title: string) => {
    try {
      const response = await fetch(`/api/db/employee/delete?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      const data = await response.json();
      console.log('削除成功:', data);
      router.push(`/employee`);
      // onReload(data);
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
              」を削除すると、そのユーザーに割り当てられたすべてのタスクも削除されます。
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              キャンセル
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleDelete(deleteId)} autoFocus>
              削除
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
