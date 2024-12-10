// material-ui
import { SxProps, styled, useTheme } from '@mui/material/styles';
import { Box, Button, CardMedia, Stack, Theme } from '@mui/material';

// third-party
import { DropzoneOptions, useDropzone } from 'react-dropzone';

// project import
import PlaceholderContent from 'components/third-party/dropzone/PlaceholderContent';
import RejectionFiles from 'components/third-party/dropzone/RejectionFiles';

// types
import { CustomFile } from 'types/dropzone';
import Papa from 'papaparse';
import { replace } from 'lodash';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

export interface CsvUploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile[] | null;
  setFieldValue: (field: string, value: any) => void;
  onRelode: (data: Array<any>) => void;
  sx?: SxProps<Theme>;
}
const CsvFile = ({ error, file, setFieldValue, onRelode, sx, ...other }: CsvUploadProps) => {
  const theme = useTheme();

  const handleCsvFile = (acceptedFiles: File[]) => {
    const csvFile: File = acceptedFiles[0];
    Papa.parse(csvFile, {
      complete: (result: any) => {
        const newData = result.data.reduce((accumulator: any, value: any) => {
          const id = Number(value['スタッフNO']);
          // 既に同じidが存在する場合はスキップ
          if (!accumulator.find((item: any) => item.id === id)) {
            accumulator.push({
              id,
              name: replace(value['スタッフ氏名'], ' ', ''),
              mail: value['メールアドレス１'],
              birthday: value['生年月日'],
              staff_status_id: value['ステータス']
            });
          }
          return accumulator;
        }, []);
        onRelode(newData);
      },
      header: true,
      encoding: 'SJIS'
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: handleCsvFile
  });

  const thumbs =
    file &&
    file.map((item: CustomFile) => (
      <CardMedia
        key={item.name}
        component="img"
        src={item.preview}
        sx={{
          top: 8,
          left: 8,
          borderRadius: 2,
          position: 'absolute',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          background: theme.palette.background.paper
        }}
        onLoad={() => {
          URL.revokeObjectURL(item.preview!);
        }}
      />
    ));

  const onRemove = () => {
    setFieldValue('files', null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(file && {
            padding: '12% 0'
          })
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent />
        {thumbs}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={onRemove}>
            Remove
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default CsvFile;
