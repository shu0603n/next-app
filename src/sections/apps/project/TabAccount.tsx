import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// ==============================|| ACCOUNT PROFILE - MY ACCOUNT ||============================== //

const TabAccount = () => {
  const [signing, setSigning] = useState('facebook');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSigning(event.target.value);
  };

  const [checked, setChecked] = useState(['sb', 'ln', 'la']);

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
      <Grid item xs={12}>
        <MainCard title="一般設定">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="my-account-username">ユーザー名</InputLabel>
                <TextField fullWidth defaultValue="Asoka_Tana_16" id="my-account-username" placeholder="ユーザー名" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="my-account-email">アカウントのメール</InputLabel>
                <TextField fullWidth defaultValue="user@tana.com" id="my-account-email" placeholder="アカウントのメール" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="my-account-lang">言語</InputLabel>
                <TextField fullWidth defaultValue="New York" id="my-account-lang" placeholder="言語" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="my-account-signing">署名に使用するもの</InputLabel>
                <Select fullWidth id="my-account-signing" value={signing} onChange={handleChange} MenuProps={MenuProps}>
                  <MenuItem value="form">基本フォーム</MenuItem>
                  <MenuItem value="firebase">Firebase - 認証</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="gmail">Gmail</MenuItem>
                  <MenuItem value="jwt">JWT</MenuItem>
                  <MenuItem value="auth0">AUTH0</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard title="高度な設定" content={false}>
          <List sx={{ p: 0 }}>
            <ListItem divider>
              <ListItemText id="switch-list-label-sb" primary="セキュアブラウジング" secondary="必要な場合に安全なブラウジング（https）" />
              <Switch
                edge="end"
                onChange={handleToggle('sb')}
                checked={checked.indexOf('sb') !== -1}
                inputProps={{
                  'aria-labelledby': 'switch-list-label-sb'
                }}
              />
            </ListItem>
            <ListItem divider>
              <ListItemText id="switch-list-label-ln" primary="ログイン通知" secondary="他の場所からのログインが試行されたときに通知" />
              <Switch
                edge="end"
                onChange={handleToggle('ln')}
                checked={checked.indexOf('ln') !== -1}
                inputProps={{
                  'aria-labelledby': 'switch-list-label-ln'
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                id="switch-list-label-la"
                primary="ログイン承認"
                secondary="認識されていないデバイスからのログイン時に承認が必要ではありません。"
              />
              <Switch
                edge="end"
                onChange={handleToggle('la')}
                checked={checked.indexOf('la') !== -1}
                inputProps={{
                  'aria-labelledby': 'switch-list-label-la'
                }}
              />
            </ListItem>
          </List>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard title="認識されたデバイス" content={false}>
          <List sx={{ p: 0 }}>
            <ListItem divider>
              <ListItemText primary="Cent Desktop" secondary="4351 Deans Lane, Chelmsford" />
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'success.main', borderRadius: '50%' }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>アクティブ</Typography>
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Imho Tablet" secondary="4185 Michigan Avenue" />
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'secondary.main', borderRadius: '50%' }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>アクティブ 5日前</Typography>
              </Stack>
            </ListItem>
            <ListItem>
              <ListItemText primary="Albs Mobile" secondary="3462 Fairfax Drive, Montcalm" />
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'secondary.main', borderRadius: '50%' }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>アクティブ 1ヶ月前</Typography>
              </Stack>
            </ListItem>
          </List>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard title="アクティブなセッション" content={false}>
          <List sx={{ p: 0 }}>
            <ListItem divider>
              <ListItemText primary={<Typography variant="h5">Cent Desktop</Typography>} secondary="4351 Deans Lane, Chelmsford" />
              <Button>ログアウト</Button>
            </ListItem>
            <ListItem>
              <ListItemText primary={<Typography variant="h5">Moon Tablet</Typography>} secondary="4185 Michigan Avenue" />
              <Button>ログアウト</Button>
            </ListItem>
          </List>
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

export default TabAccount;
