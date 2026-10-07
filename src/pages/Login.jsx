import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Alert, alpha, useTheme, InputAdornment, CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
};

function Dots() {
  return (
    <Box component="span" sx={{ display: 'inline-flex', ml: 0.3 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        >
          .
        </motion.span>
      ))}
    </Box>
  );
}

export default function Login({ onSignIn }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true); // shows the full-page overlay below immediately — the real
                    // network call runs while it's already on screen, so the
                    // wait isn't doubled up with a fixed animation afterward
    const { error: err } = await onSignIn(email, password);
    if (err) {
      setError('Email ya password ghalat hai.');
      setBusy(false);
    }
    // On success we leave `busy` true — App.jsx swaps in its own screen the
    // moment the session updates, continuing seamlessly from this same look.
  };

  if (busy) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        sx={{
          minHeight: '100vh', display: 'grid', placeItems: 'center',
          bgcolor: theme.palette.navy[900],
          backgroundImage: `radial-gradient(800px 450px at 50% 0%, ${alpha('#fff', 0.06)}, transparent 60%)`,
        }}
      >
        <Box sx={{ textAlign: 'center', width: 300 }}>
          <Box sx={{ position: 'relative', width: 92, height: 92, mx: 'auto', mb: 3.5 }}>
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
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', mb: 2.5 }}>Young Scholars</Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), letterSpacing: 0.3, display: 'flex', justifyContent: 'center' }}>
            Signing you in<Dots />
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: theme.palette.navy[900],
      }}
    >
      {/* Branding panel */}
      <Box
        sx={{
          flex: { md: '0 0 46%' },
          minHeight: { xs: 220, md: '100vh' },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 4, md: 8 },
          py: { xs: 5, md: 0 },
          background: `linear-gradient(155deg, ${theme.palette.navy[900]} 0%, ${theme.palette.navy[800]} 55%, ${theme.palette.navy[700]} 100%)`,
        }}
      >
        {/* Decorative fine grid + glow */}
        <Box
          sx={{
            position: 'absolute', inset: 0, opacity: 0.5,
            backgroundImage: `
              linear-gradient(${alpha('#fff', 0.05)} 1px, transparent 1px),
              linear-gradient(90deg, ${alpha('#fff', 0.05)} 1px, transparent 1px)`,
            backgroundSize: '42px 42px',
            maskImage: 'radial-gradient(ellipse at 30% 30%, black 10%, transparent 72%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute', width: 520, height: 520, borderRadius: '50%',
            top: -180, right: -180,
            background: `radial-gradient(circle, ${alpha(theme.palette.gold.main, 0.22)}, transparent 70%)`,
          }}
        />

        <Box component={motion.div} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 54, height: 54, borderRadius: '50%', display: 'grid', placeItems: 'center', mb: 3,
              border: `1px solid ${alpha(theme.palette.gold.main, 0.5)}`,
              background: alpha(theme.palette.gold.main, 0.1),
              color: theme.palette.gold.main,
            }}
          >
            <SchoolRoundedIcon />
          </Box>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3, fontWeight: 700, fontSize: 12,
              color: theme.palette.gold.light,
            }}
          >
            OFFICE MANAGEMENT PORTAL
          </Typography>
          <Typography variant="h3" sx={{ color: '#fff', mt: 1, mb: 1, fontSize: { xs: 28, md: 38 }, lineHeight: 1.15 }}>
            Young Scholars<br />Grammar Secondary School
          </Typography>
          <Box sx={{ width: 64, height: 2, bgcolor: theme.palette.gold.main, my: 3, borderRadius: 2 }} />
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), maxWidth: 360, display: { xs: 'none', md: 'block' } }}>
            Students, staff, fees and finances — one secure record for the school office.
          </Typography>
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default',
          backgroundImage: isDark
            ? `radial-gradient(700px 400px at 80% 0%, ${alpha(theme.palette.gold.main, 0.07)}, transparent 60%)`
            : `radial-gradient(700px 400px at 80% 0%, ${alpha(theme.palette.navy[800], 0.05)}, transparent 60%)`,
          p: { xs: 3, sm: 5 },
        }}
      >
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          variant="outlined"
          sx={{
            width: 400, maxWidth: '100%', p: { xs: 3.5, sm: 4.5 }, borderRadius: 4,
            position: 'relative', overflow: 'hidden',
            boxShadow: isDark
              ? `0 20px 60px ${alpha('#000', 0.4)}`
              : `0 20px 60px ${alpha(theme.palette.navy[800], 0.12)}`,
            '&::before': {
              content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${theme.palette.gold.main}, transparent)`,
            },
          }}
        >
          <Typography variant="h5" sx={{ mb: 0.5 }}>Welcome back</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5 }}>
            Sign in to access the office records.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </Alert>
            )}

            <Box component={motion.div} custom={0} variants={fieldVariants} initial="hidden" animate="show">
              <TextField
                label="Email" type="email" required fullWidth size="medium" autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box component={motion.div} custom={1} variants={fieldVariants} initial="hidden" animate="show">
              <TextField
                label="Password" type="password" required fullWidth size="medium"
                value={password} onChange={e => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box component={motion.div} custom={2} variants={fieldVariants} initial="hidden" animate="show">
              <Button type="submit" variant="contained" fullWidth disabled={busy} sx={{ height: 46, mt: 0.5, fontSize: 15 }}
                startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}>
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}