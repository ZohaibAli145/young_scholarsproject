import React from 'react';
import { TableRow, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

// Drop-in replacement for <TableRow hover> that fades/slides each row in,
// staggered by its index in the list.
export default function MotionTableRow({ index = 0, children, ...props }) {
  const theme = useTheme();
  return (
    <TableRow
      component={motion.tr}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.035, 0.4), ease: 'easeOut' }}
      whileHover={{ backgroundColor: alpha(theme.palette.gold.main, theme.palette.mode === 'dark' ? 0.06 : 0.05) }}
      {...props}
    >
      {children}
    </TableRow>
  );
}