import { useEffect, useState } from 'react';

// material-ui
import {
  Button,
  CircularProgress,
  // Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// プロジェクトのインポート
import MainCard from 'components/MainCard';
import router from 'next/router';
import useUser from 'hooks/useUser';
import { alertSnackBar } from 'function/alert/alertSnackBar';

// ==============================|| アカウントプロファイル - 設定 ||============================== //

const TabSettings = () => {
  const id = router.query.id as string;
  const user = useUser();
  const [checked, setChecked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  async function fetchTableData(id: string) {
    try {
      const response = await fetch(`/api/db/employee/setting/select?id=${id}`);
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();

      return data; // APIから返されたデータを返します
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function updateRoles() {
    try {
      const initializePermissions = (checked: string[], id: number) => {
        // 各権限の状態を設定
        const permissions = defaultPermissions.reduce((acc, permission) => {
          acc[permission] = checked.includes(permission);
          return acc;
        }, {} as Record<string, boolean | number>);

        // employee_id を追加
        permissions.employee_id = id;

        return permissions;
      };

      const defaultPermissions = [
        'super_role',
        'system_role',
        'employee_view',
        'client_view',
        'project_view',
        'employee_edit',
        'client_edit',
        'project_edit',
      ];

      const values = initializePermissions(checked, Number(id));

      alertSnackBar('処理中…', 'secondary');
      fetch(`/api/db/employee/setting/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('更新に失敗しました。');
          }
          return response.json();
        })
        .then((fetchedData) => {
          alertSnackBar('正常に更新されました。', 'success');
          setChecked(fetchedData.data);
        })
        .catch((error) => {
          console.error('エラー:', error);
          alertSnackBar('データの更新に失敗しました。', 'error');
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // ページがロードされたときにデータを取得
    fetchTableData(id)
      .then((fetchedData) => {
        setChecked(fetchedData.data);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // ローディングを終了
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    // ローディング中の表示
    return (
      <Grid container justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="管理者設定">
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">管理者権限の設定</Typography>
                <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                  <ListItem>
                    <ListItemText id="switch-list-label-super_role" primary={<Typography color="secondary">特級権限</Typography>} />
                    <Switch
                      edge="end"
                      disabled={!user?.roles.superRole}
                      onChange={handleToggle('super_role')}
                      checked={checked.indexOf('super_role') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-super_role'
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <Typography color="secondary">・全ての機能が利用可能</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText id="switch-list-label-system_role" primary={<Typography color="secondary">システム権限</Typography>} />
                    <Switch
                      edge="end"
                      disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                      onChange={handleToggle('system_role')}
                      checked={checked.indexOf('system_role') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-system_role'
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <Typography color="secondary">・「設定」を表示する</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography color="secondary">・「パスワード変更」を表示する</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography color="secondary">・「パラメーター」を表示する</Typography>
                  </ListItem>
                </List>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard title="システム設定">
          <Stack spacing={2.5}>
            <Typography variant="subtitle1">参照権限の設定</Typography>
            <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
              <ListItem>
                <ListItemText id="switch-list-label-employee_view" primary={<Typography color="secondary">社員情報を表示</Typography>} />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('employee_view')}
                  checked={checked.indexOf('employee_view') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-employee_view'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText id="switch-list-label-client_view" primary={<Typography color="secondary">企業情報を表示</Typography>} />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('client_view')}
                  checked={checked.indexOf('client_view') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-client_view'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText id="switch-list-label-project_view" primary={<Typography color="secondary">案件情報を表示</Typography>} />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('project_view')}
                  checked={checked.indexOf('project_view') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-project_view'
                  }}
                />
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1">編集権限の設定</Typography>
            <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
              <ListItem>
                <ListItemText
                  id="switch-list-label-employee_edit"
                  primary={<Typography color="secondary">社員情報の編集を許可</Typography>}
                />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('employee_edit')}
                  checked={checked.indexOf('employee_edit') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-employee_edit'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  id="switch-list-label-client_edit"
                  primary={<Typography color="secondary">顧客情報の編集を許可</Typography>}
                />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('client_edit')}
                  checked={checked.indexOf('client_edit') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-client_edit'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  id="switch-list-label-project_edit"
                  primary={<Typography color="secondary">案件情報の編集を許可</Typography>}
                />
                <Switch
                  edge="end"
                  disabled={!(user?.roles.superRole || user?.roles.systemRole)}
                  onChange={handleToggle('project_edit')}
                  checked={checked.indexOf('project_edit') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-project_edit'
                  }}
                />
              </ListItem>
            </List>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="contained" onClick={updateRoles} disabled={!(user?.roles.superRole || user?.roles.systemRole)}>
            プロフィールを更新
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabSettings;
