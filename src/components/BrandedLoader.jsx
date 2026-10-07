import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

export default function BrandedLoader() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        bgcolor: theme.palette.navy[900],
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ position: 'relative', width: 76, height: 76, mx: 'auto', mb: 2.5 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2.5px solid ${alpha(theme.palette.gold.main, 0.18)}`,
              borderTopColor: theme.palette.gold.main,
            }}
          />
          <Box
            sx={{
              position: 'absolute', inset: 14, borderRadius: '50%',
              display: 'grid', placeItems: 'center',
              bgcolor: alpha(theme.palette.gold.main, 0.12),
              color: theme.palette.gold.main,
            }}
          >
            <SchoolRoundedIcon fontSize="small" />
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.55), letterSpacing: 1 }}>
          LOADING OFFICE RECORDS…
        </Typography>
      </Box>
    </Box>
  );
}