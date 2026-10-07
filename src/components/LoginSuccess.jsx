import React, { useEffect, useState } from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

const STAGES = [
  { label: 'Loading office records', duration: 1500 },
  { label: 'Welcome back', duration: 1500 },
];

const TOTAL_DURATION = STAGES.reduce((s, st) => s + st.duration, 0);

function Dots() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', ml: 0.3 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ marginLeft: 1 }}
        >
          .
        </motion.span>
      ))}
    </Box>
  );
}

export default function LoginSuccess({ email }) {
  const theme = useTheme();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return;
    const t = setTimeout(() => setStageIndex((i) => i + 1), STAGES[stageIndex].duration);
    return () => clearTimeout(t);
  }, [stageIndex]);

  const isWelcome = stageIndex === STAGES.length - 1;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        bgcolor: theme.palette.navy[900],
        backgroundImage: `radial-gradient(800px 450px at 50% 0%, ${alpha('#fff', 0.06)}, transparent 60%)`,
      }}
    >
      <Box sx={{ textAlign: 'center', width: 300 }}>
        <Box sx={{ position: 'relative', width: 92, height: 92, mx: 'auto', mb: 3.5 }}>
          <AnimatePresence mode="wait">
            {!isWelcome ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: `3px solid ${alpha('#fff', 0.12)}`,
                    borderTopColor: theme.palette.gold.main,
                    borderRightColor: alpha(theme.palette.gold.main, 0.4),
                  }}
                />
                <Box sx={{ position: 'absolute', inset: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: alpha(theme.palette.gold.main, 0.14), color: theme.palette.gold.main }}>
                  <SchoolRoundedIcon fontSize="small" />
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `3px solid ${theme.palette.success.main}`,
                  display: 'grid', placeItems: 'center',
                }}
              >
                <motion.svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M4 12l5 5L20 6"
                    stroke={theme.palette.success.main}
                    strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                  />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Typography variant="h5" sx={{ color: '#fff', mb: 0.5 }}>
          {isWelcome ? 'Welcome back' : 'Young Scholars'}
        </Typography>
        {isWelcome && email && (
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.55), mb: 2.5 }}>{email}</Typography>
        )}

        <Box sx={{ height: 4, borderRadius: 2, bgcolor: alpha('#fff', 0.1), overflow: 'hidden', mt: isWelcome ? 0.5 : 3, mb: 1.75 }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: TOTAL_DURATION / 1000, ease: 'linear' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${theme.palette.gold.main}, ${theme.palette.gold.light})` }}
          />
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={stageIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), letterSpacing: 0.3, display: 'flex', justifyContent: 'center' }}>
              {STAGES[stageIndex].label}<Dots />
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}