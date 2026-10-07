import React from 'react';
import { Box, Paper, Typography, Chip, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export default function ComingSoon({ title, description, icon: Icon }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 4, sm: 7 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute', inset: 0,
          background: isDark
            ? `radial-gradient(420px 220px at 50% 0%, ${alpha(theme.palette.gold.main, 0.08)}, transparent 70%)`
            : `radial-gradient(420px 220px at 50% 0%, ${alpha(theme.palette.navy[800], 0.05)}, transparent 70%)`,
        }}
      />

      <Box
        component={motion.div}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          width: 74, height: 74, borderRadius: '50%', mx: 'auto', mb: 3,
          display: 'grid', placeItems: 'center', position: 'relative',
          bgcolor: alpha(theme.palette.gold.main, isDark ? 0.14 : 0.1),
          color: theme.palette.gold.dark,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: `1px solid ${alpha(theme.palette.gold.main, 0.4)}`,
          }}
        />
        {Icon && <Icon sx={{ fontSize: 32 }} />}
      </Box>

      <Chip
        label="Coming soon"
        size="small"
        sx={{
          mb: 1.5, fontWeight: 700, letterSpacing: 0.4,
          bgcolor: alpha(theme.palette.gold.main, isDark ? 0.16 : 0.1),
          color: theme.palette.gold.dark,
        }}
      />
      <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto' }}>
        {description}
      </Typography>
    </Paper>
  );
}