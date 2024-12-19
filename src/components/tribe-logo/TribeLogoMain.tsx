import { useTheme } from '@mui/material/styles';
import Image from 'next/image'; // Next.js の場合

const TribeLogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();

  // 画像パスを設定
  const logo = '/assets/images/tribe-logo.png'; // ロゴ画像のパス
  const logoDark = '/assets/images/tribe-logo.png'; // ダークモード用ロゴ画像のパス

  return (
    <Image
      src={theme.palette.mode === 'dark' || reverse ? logoDark : logo}
      alt="Tribe Logo"
      width={150} // ロゴの幅
      height={30} // ロゴの高さ
      {...others} // 他の props を渡す
    />
  );
};

export default TribeLogoMain;
