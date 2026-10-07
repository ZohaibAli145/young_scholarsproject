import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';

const TONES = {
  paid: 'success',
  pending: 'error',
  neutral: 'default',
};

export default function StatusPill({ label, tone = 'neutral' }) {
  const theme = useTheme();
  const color =
    tone === 'paid' ? theme.palette.success.main
    : tone === 'pending' ? theme.palette.error.main
    : theme.palette.text.secondary;

  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        px: 1.1, py: 0.35, borderRadius: 999,
        fontSize: 11.5, fontWeight: 700, letterSpacing: 0.2,
        bgcolor: alpha(color, 0.12),
        color,
        border: `1px solid ${alpha(color, 0.25)}`,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      {label}
    </Box>
  );
}