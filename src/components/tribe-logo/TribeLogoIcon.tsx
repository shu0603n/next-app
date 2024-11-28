import Image from 'next/image'; // Next.js の場合

/**
 * TribeLogoIcon - トライブロゴアイコンコンポーネント
 */

const TribeLogoIcon = () => {
  // ロゴ画像のパスを設定
  const logoIcon = '/assets/images/tribe-logo-icon.png';

  return (
    <Image
      src={logoIcon} // ロゴ画像
      alt="Tribe Logo Icon" // 画像の説明
      width={40} // 幅
      height={30} // 高さ
    />
  );
};

export default TribeLogoIcon;
