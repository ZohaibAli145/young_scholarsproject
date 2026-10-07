import React from 'react';
import { Box, CircularProgress, useTheme, alpha } from '@mui/material';

export default function ToggleStatusPill({ paid, onToggle, loading }) {
  const theme = useTheme();
  const color = paid ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Box
      component="button"
      type="button"
      onClick={onToggle}
      disabled={loading}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        border: 'none',
        outline: 'none',
        cursor: loading ? 'default' : 'pointer',
        borderRadius: 20,
        px: 1.25,
        py: 0.5,
        bgcolor: alpha(color, 0.12),
        color,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'inherit',
        transition: 'background-color 0.15s ease, transform 0.1s ease',
        '&:hover': { bgcolor: alpha(color, loading ? 0.12 : 0.2) },
        '&:active': { transform: loading ? 'none' : 'scale(0.96)' },
      }}
    >
      {loading ? (
        <CircularProgress size={11} thickness={6} sx={{ color }} />
      ) : (
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      )}
      {paid ? 'Paid' : 'Pending'}
    </Box>
  );
}