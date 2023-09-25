import React, { useState, useRef } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, IconButton, ClickAwayListener, BoxProps } from '@mui/material';

// third-party
// import { PickerProps } from 'emoji-mart';
import data from '@emoji-mart/data';
// import data from '@emoji-mart/data';
// // @ts-ignore
// import Picker from '@emoji-mart/react';

// assets
import { SmileOutlined } from '@ant-design/icons';

const Picker = ({ ...other }) => {
  const ref = useRef<HTMLDivElement>(null);

  import('emoji-mart').then(({ Picker }) => new Picker({ ...other, data, ref }));

  return <div ref={ref} />;
};

// ==============================|| EMOJI PICKER ||============================== //

const RootStyle = styled(Box)({
  position: 'relative'
});

const PickerStyle = styled('div')(({ theme }) => ({
  bottom: 40,
  overflow: 'hidden',
  position: 'absolute',
  left: -16,
  boxShadow: theme.customShadows.z1,
  borderRadius: 4,
  '& .emoji-mart': {
    border: 'none',
    backgroundColor: theme.palette.background.paper
  },
  '& .emoji-mart-anchor': {
    color: theme.palette.text.disabled,
    '&:hover, &:focus, &.emoji-mart-anchor-selected': {
      color: theme.palette.text.primary
    }
  },
  '& .emoji-mart-bar': { borderColor: theme.palette.divider },
  '& .emoji-mart-search input': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey[500],
    '&::placeholder': {
      ...theme.typography.body2,
      color: theme.palette.text.disabled
    }
  },
  '& .emoji-mart-search-icon svg': {
    opacity: 1,
    fill: theme.palette.text.disabled
  },
  '& .emoji-mart-category-label span': {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary
  },
  '& .emoji-mart-title-label': { color: theme.palette.text.primary },
  '& .emoji-mart-category .emoji-mart-emoji:hover:before': {
    backgroundColor: theme.palette.action.selected
  },
  '& .emoji-mart-emoji': { outline: 'none' },
  '& .emoji-mart-preview-name': {
    color: theme.palette.text.primary
  },
  '& .emoji-mart-preview-shortname, .emoji-mart-preview-emoticon': {
    color: theme.palette.text.secondary
  }
}));

interface EmoijPickerProps extends BoxProps {
  disabled?: boolean;
  value: string;
  setValue: (value: string) => void;
  alignRight?: boolean;
}

export default function EmojiPicker({ disabled, value, setValue, alignRight = false, ...other }: EmoijPickerProps) {
  const theme = useTheme();
  const [emojiPickerState, SetEmojiPicker] = useState(false);

  let emojiPicker;
  if (emojiPickerState) {
    emojiPicker = (
      <Picker
        data={data}
        color={theme.palette.primary.main}
        title="Pick your emoji…"
        emoji="point_up"
        onEmojiSelect={(emoji: any) => setValue(value + emoji?.native)}
      />
    );
  }

  const triggerPicker = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  const handleClickAway = () => {
    SetEmojiPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <RootStyle {...other}>
        <PickerStyle
          sx={{
            ...(alignRight && {
              right: -2,
              left: 'auto !important'
            })
          }}
        >
          {emojiPicker}
        </PickerStyle>
        <IconButton disabled={disabled} onClick={triggerPicker} sx={{ opacity: 0.5 }}>
          <SmileOutlined />
        </IconButton>
      </RootStyle>
    </ClickAwayListener>
  );
}
