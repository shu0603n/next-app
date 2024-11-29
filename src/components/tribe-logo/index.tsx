import NextLink from 'next/link';

// material-ui
import { ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import TribeLogoMain from './TribeLogoMain';
import TribeLogoIcon from './TribeLogoIcon';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: string;
}

const TribeLogoSection = ({ reverse, isIcon, sx, to }: Props) => (
  <NextLink href={!to ? APP_DEFAULT_PATH : to} passHref legacyBehavior>
    <ButtonBase disableRipple sx={sx}>
      {isIcon ? <TribeLogoIcon /> : <TribeLogoMain reverse={reverse} />}
    </ButtonBase>
  </NextLink>
);

export default TribeLogoSection;
