// material-ui
import { CameraOutlined } from '@ant-design/icons';
import { Typography, Stack, CardMedia } from '@mui/material';

// assets
import { DropzopType } from 'types/dropzone';

const UploadCover = '/assets/images/upload/upload.svg';

// ==============================|| アップロード - プレースホルダー ||============================== //

export default function PlaceholderContent({ type }: { type?: string }) {
  return (
    <>
      {type !== DropzopType.standard && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography variant="h5">ファイルをドラッグ＆ドロップまたは選択してください</Typography>

            <Typography color="secondary">
              ファイルをここにドロップするか、
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                クリック
              </Typography>
              &nbsp;してください
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzopType.standard && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <CameraOutlined style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}
