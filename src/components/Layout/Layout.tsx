import type { FC } from 'react';
import { Box } from '@mui/material';

const Layout: FC = ({ children }) => {
  return <Box sx={{ textAlign: 'center' }}>{children}</Box>
}

export default Layout;
