import { useEffect, useLayoutEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { Menu } from 'menu-items/dashboard';

import { useSelector } from 'store';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';

// types
import { NavItemType } from 'types/menu';
import { MenuOrientation } from 'types/config';
import useUser from 'hooks/useUser';
import roleLevel from 'utils/roleLevel.json';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);
  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });

  const user = useUser();

  const updates = roleLevel.map((item) => {
    const data = { id: item.id, disabled: false };

    // roleLevel が 1 の場合の条件
    if (item.roleLevel === 1) {
      // superRole または systemRole が true の場合は常に disabled: false
      if (user?.roles.superRole || user?.roles.systemRole) {
        data.disabled = false;
      } else {
        switch (item.id) {
          case 'client':
            data.disabled = !user?.roles.clientView;
            break;
          case 'employee':
            data.disabled = !user?.roles.employeeView;
            break;
          case 'project':
            data.disabled = !user?.roles.projectView;
            break;
          default:
            data.disabled = true; // その他の id の場合はデフォルトで true
        }
      }
    } else if (item.roleLevel === 2) {
      // superRole が true の場合は常に disabled: false
      if (user?.roles.superRole) {
        data.disabled = false;
      } else {
        data.disabled = true;
      }
    } else {
      // roleLevel が 1 以外の場合は必ず disabled: false
      data.disabled = false;
    }

    return data;
  });

  const updateDisabledProperty = (data: { items: NavItemType[] }, updates: any[]) => {
    const updateItemDisabled = (items: NavItemType[], update: { id: string; disabled: boolean }) => {
      items.forEach((item) => {
        // id が一致する場合、disabled プロパティを更新
        if (item.id === update.id) {
          item.disabled = update.disabled;
        }
        // itemにchildrenがある場合、再帰的に処理
        if (item.children) {
          updateItemDisabled(item.children, update); // 再帰呼び出し
        }
      });
    };
    // updates の配列に基づいて、data 配列の各要素の disabled を更新
    updates.forEach((update) => {
      data.items.forEach((group) => {
        updateItemDisabled([group], update); // グループに対しても処理を行う
      });
    });
    return data;
  };

  updateDisabledProperty(menuItem, updates);

  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line
  }, []);

  let getMenu = Menu();
  const handlerMenuItem = () => {
    const isFound = menuItem.items.some((element) => {
      if (element.id === 'group-dashboard') {
        return true;
      }
      return false;
    });

    if (getMenu?.id !== undefined && !isFound) {
      menuItem.items.splice(0, 0, getMenu);
      setMenuItems(menuItem);
    }
  };

  useLayoutEffect(() => {
    setMenuItems(menuItem);
    // eslint-disable-next-line
  }, [menuItem]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
