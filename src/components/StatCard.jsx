import React from 'react';
import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

export default function StatCard({ label, value, tone = 'neutral', delay = 0, icon: Icon, trend }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const effectiveTone = tone;

  const palette = {
    positive: {
      text: theme.palette.success.main,
      accent: theme.palette.success.main,
      iconBg: alpha(theme.palette.success.main, isDark ? 0.18 : 0.1),
      iconColor: theme.palette.success.dark || theme.palette.success.main,
    },
    negative: {
      text: theme.palette.error.main,
      accent: theme.palette.error.main,
      iconBg: alpha(theme.palette.error.main, isDark ? 0.18 : 0.1),
      iconColor: theme.palette.error.dark || theme.palette.error.main,
    },
    neutral: {
      text: theme.palette.text.primary,
      accent: theme.palette.gold?.main || theme.palette.primary.main,
      iconBg: alpha(theme.palette.gold?.main || theme.palette.primary.main, isDark ? 0.18 : 0.1),
      iconColor: theme.palette.gold?.dark || theme.palette.primary.dark,
    },
  }[effectiveTone];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      sx={{ flex: 1, minWidth: 200 }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isDark
            ? `0 2px 10px ${alpha('#000', 0.25)}`
            : `0 2px 10px ${alpha(theme.palette.navy?.[800] || '#0a1a3c', 0.06)}`,
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          '&:hover': {
            boxShadow: isDark
              ? `0 16px 36px ${alpha('#000', 0.45)}`
              : `0 16px 36px ${alpha(theme.palette.navy?.[800] || '#0a1a3c', 0.14)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 12, right: 12, height: 3,
            borderRadius: '0 0 4px 4px',
            background: palette.accent,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          {Icon && (
            <Box
              sx={{
                width: 32, height: 32, borderRadius: 2,
                display: 'grid', placeItems: 'center',
                bgcolor: palette.iconBg,
                color: palette.iconColor,
                boxShadow: `inset 0 0 0 1px ${alpha(palette.iconColor, 0.15)}`,
              }}
            >
              <Icon sx={{ fontSize: 17 }} />
            </Box>
          )}
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 0.6 }}>
            {label}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            sx={{
              color: palette.text,
              fontWeight: 700,
              fontSize: '1.7rem',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: -0.3,
            }}
          >
            {value}
          </Typography>

          {trend != null && (
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.25,
                fontSize: 12, fontWeight: 700,
                color: trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
              }}
            >
              {trend >= 0 ? <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />}
              {Math.abs(trend).toFixed(0)}%
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}