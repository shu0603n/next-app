import { useState } from 'react';

// material-ui
import {
  Button,
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

// ==============================|| アカウントプロファイル - 設定 ||============================== //

const TabSettings = () => {
  const [checked, setChecked] = useState(['en', 'pass', 'email-1', 'email-3', 'order-1', 'order-3']);

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
                    <ListItemText id="switch-list-label-en" primary={<Typography color="secondary">特級権限</Typography>} />
                    <Switch
                      edge="end"
                      onChange={handleToggle('en')}
                      checked={checked.indexOf('en') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-en'
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <Typography color="secondary">・全ての機能が利用可能</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText id="switch-list-label-en" primary={<Typography color="secondary">システム権限</Typography>} />
                    <Switch
                      edge="end"
                      onChange={handleToggle('en')}
                      checked={checked.indexOf('en') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-en'
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
                <ListItemText id="switch-list-label-email-1" primary={<Typography color="secondary">社員情報を表示</Typography>} />
                <Switch
                  edge="end"
                  onChange={handleToggle('email-1')}
                  checked={checked.indexOf('email-1') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-email-1'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText id="switch-list-label-email-2" primary={<Typography color="secondary">企業情報を表示</Typography>} />
                <Switch
                  edge="end"
                  onChange={handleToggle('email-2')}
                  checked={checked.indexOf('email-2') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-email-2'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText id="switch-list-label-email-3" primary={<Typography color="secondary">案件情報を表示</Typography>} />
                <Switch
                  edge="end"
                  onChange={handleToggle('email-3')}
                  checked={checked.indexOf('email-3') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-email-3'
                  }}
                />
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1">編集権限の設定</Typography>
            <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
              <ListItem>
                <ListItemText
                  id="switch-list-label-order-1"
                  primary={<Typography color="secondary.light">社員情報の編集を許可</Typography>}
                />
                <Switch
                  edge="end"
                  onChange={handleToggle('order-1')}
                  checked={checked.indexOf('order-1') !== -1}
                  disabled
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-order-1'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  id="switch-list-label-order-2"
                  primary={<Typography color="secondary.light">顧客情報の編集を許可</Typography>}
                />
                <Switch
                  edge="end"
                  disabled
                  onChange={handleToggle('order-2')}
                  checked={checked.indexOf('order-2') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-order-2'
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText id="switch-list-label-order-3" primary={<Typography color="secondary">案件情報の編集を許可</Typography>} />
                <Switch
                  edge="end"
                  onChange={handleToggle('order-3')}
                  checked={checked.indexOf('order-3') !== -1}
                  inputProps={{
                    'aria-labelledby': 'switch-list-label-order-3'
                  }}
                />
              </ListItem>
            </List>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            キャンセル
          </Button>
          <Button variant="contained">プロフィールを更新</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabSettings;
