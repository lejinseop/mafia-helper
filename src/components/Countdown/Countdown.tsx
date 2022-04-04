import { useState } from 'react';
import type { FC } from 'react';
import { useCountdown } from 'react-countdown-circle-timer';
import { Box, Button, Typography } from '@mui/material';

const TIME = 60;

const Countdown: FC = () => {
  const [start, setStart] = useState(false);
  const { remainingTime } = useCountdown({
    isPlaying: start,
    initialRemainingTime: TIME,
    duration: TIME,
    colors: '#abc',
    onComplete: () => {
      return { shouldRepeat: true, delay: 1 };
    },
  });

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button
        variant="contained"
        sx={{ marginRight: '5px' }}
        onClick={() => {
          setStart(true);
        }}
      >
        카운트다운 start
      </Button>
      <Typography>{remainingTime} 초</Typography>
    </Box>
  );
};

export default Countdown;
