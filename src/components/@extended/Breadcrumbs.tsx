import { CSSProperties, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project import
import MainCard from 'components/MainCard';
import { ApartmentOutlined, HomeOutlined, HomeFilled } from '@ant-design/icons';

// types
import { OverrideIcon } from 'types/root';
import { NavItemType } from 'types/menu';

// ==============================|| BREADCRUMBS ||============================== //

export interface BreadCrumbSxProps extends CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface Props {
  card?: boolean;
  divider?: boolean;
  icon?: boolean;
  icons?: boolean;
  maxItems?: number;
  navigation?: { items: NavItemType[] };
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

const Breadcrumbs = ({
  card,
  divider = true,
  icon,
  icons,
  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  titleBottom,
  sx,
  ...others
}: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { asPath } = router;
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<NavItemType[]>([]);

  const iconSX = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  useEffect(() => {
    const buildBreadcrumbs = (menus: NavItemType[], currentPath: string): NavItemType[] => {
      const trail: NavItemType[] = [];

      const findActiveItem = (menuList: NavItemType[], parentTrail: NavItemType[] = []): boolean => {
        for (const menu of menuList) {
          // 動的パス対応（`[id]` 等の部分を正規表現に置き換える）
          const dynamicUrlPattern = new RegExp(`^${menu.url?.replace(/\[.*?\]/g, '[^/]+')}$`);

          if (dynamicUrlPattern.test(currentPath)) {
            trail.push(...parentTrail, menu);
            return true;
          }

          if (menu.children && findActiveItem(menu.children, [...parentTrail, menu])) {
            return true;
          }
        }
        return false;
      };

      if (navigation?.items) {
        findActiveItem(menus);
      }

      // Filter the breadcrumb trail to include only items (not groups)
      return trail.filter((item) => item.type === 'item');
    };

    const breadcrumbs = buildBreadcrumbs(navigation?.items || [], asPath);
    setBreadcrumbTrail(breadcrumbs);
  }, [navigation, asPath]);

  const SeparatorIcon = separator!;
  const separatorIcon = separator ? <SeparatorIcon style={{ fontSize: '0.75rem', marginTop: 2 }} /> : '/';

  const breadcrumbItems = breadcrumbTrail.map((item, index) => {
    const isLast = index === breadcrumbTrail.length - 1;
    const ItemIcon = item.icon || ApartmentOutlined;

    return isLast ? (
      <Typography key={item.id} variant="subtitle1" color="textPrimary">
        {icons && <ItemIcon style={iconSX} />}
        {item.title}
      </Typography>
    ) : (
      <NextLink key={item.id} href={item.url || '/'} passHref legacyBehavior>
        <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
          {icons && <ItemIcon style={iconSX} />}
          {item.title}
        </Typography>
      </NextLink>
    );
  });

  return (
    <MainCard
      border={card}
      sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
      {...others}
      content={card}
      shadow="none"
    >
      <Grid
        container
        direction={rightAlign ? 'row' : 'column'}
        justifyContent={rightAlign ? 'space-between' : 'flex-start'}
        alignItems={rightAlign ? 'center' : 'flex-start'}
        spacing={1}
      >
        <Grid item>
          <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
            <NextLink href="/" passHref legacyBehavior>
              <Typography color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                {icons && <HomeOutlined style={iconSX} />}
                {icon && !icons && <HomeFilled style={{ ...iconSX, marginRight: 0 }} />}
                {(!icon || icons) && 'HOME'}
              </Typography>
            </NextLink>
            {breadcrumbItems}
          </MuiBreadcrumbs>
        </Grid>
        {title && titleBottom && (
          <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
            <Typography variant="h2">{breadcrumbTrail[breadcrumbTrail.length - 1]?.title}</Typography>
          </Grid>
        )}
      </Grid>
      {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
    </MainCard>
  );
};

export default Breadcrumbs;
