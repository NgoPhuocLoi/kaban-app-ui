import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CustomEmoji, EmojiData, Picker } from 'emoji-mart';
import React, { useEffect, useState } from 'react';
import 'emoji-mart/css/emoji-mart.css';

interface CustomEmojiData extends CustomEmoji {
  native: string;
}

interface Props {
  icon: string | undefined;
  onIconChange: (icon: string) => void;
}

const EmojiPicker = ({ icon, onIconChange }: Props) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>();
  const [isShowPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setSelectedEmoji(icon);
  }, [icon]);

  const selectEmoji = (e: CustomEmojiData) => {
    onIconChange(e.native);
    setShowPicker(false);
  };

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant="h3"
        fontWeight={'700'}
        sx={{ cursor: 'pointer' }}
        onClick={togglePicker}
      >
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPicker ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: 999,
        }}
      >
        <Picker theme="dark" onSelect={selectEmoji} showPreview={false} />
      </Box>
    </Box>
  );
};

export default EmojiPicker;
