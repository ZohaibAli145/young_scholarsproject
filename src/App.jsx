import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  Box, CssBaseline, ThemeProvider, AppBar, Toolbar, IconButton, Typography, useMediaQuery, Tooltip, Chip,
  alpha,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { AnimatePresence, motion } from 'framer-motion';
import { buildTheme } from './theme.js';
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar.jsx';
import { supabaseReady } from './supabaseClient.js';
import { useAuth } from './useAuth.js';
import Login from './pages/Login.jsx';
import LoginSuccess from './components/LoginSuccess.jsx';
import { NotificationsProvider } from './components/NotificationsProvider.jsx';
import ComingSoon from './components/ComingSoon.jsx';
import BrandedLoader from './components/BrandedLoader.jsx';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import Teachers from './pages/Teachers.jsx';
import Fees from './pages/Fees.jsx';
import Salaries from './pages/Salaries.jsx';
import Expenses from './pages/Expenses.jsx';

const PAGES = {
  dashboard: { title: 'Dashboard', group: 'Overview', Component: Dashboard },
  students: { title: 'Students', group: 'Records', Component: Students },
  teachers: { title: 'Teachers', group: 'Records', Component: Teachers },
  fees: { title: 'Fees', group: 'Records', Component: Fees },
  salaries: { title: 'Salaries', group: 'Records', Component: Salaries },
  expenses: { title: 'Expenses', group: 'Records', Component: Expenses },
  exams: {
    title: 'Exams & Results', group: 'Coming soon',
    Component: () => <ComingSoon icon={GradeRoundedIcon} title="Exams & Results"
      description="Marks entry, grading, and printable report cards — coming in the next update." />,
  },
  attendance: {
    title: 'Attendance', group: 'Coming soon',
    Component: () => <ComingSoon icon={EventAvailableRoundedIcon} title="Attendance"
      description="Daily student and staff attendance with monthly summaries — coming in the next update." />,
  },
  timetable: {
    title: 'Timetable', group: 'Coming soon',
    Component: () => <ComingSoon icon={ScheduleRoundedIcon} title="Timetable"
      description="Class-wise period schedules — coming in the next update." />,
  },
  admissions: {
    title: 'Admissions', group: 'Coming soon',
    Component: () => <ComingSoon icon={HowToRegRoundedIcon} title="Admissions"
      description="A proper enrollment form and application tracking — coming in the next update." />,
  },
  notices: {
    title: 'Notices', group: 'Coming soon',
    Component: () => <ComingSoon icon={CampaignRoundedIcon} title="Notices"
      description="Send announcements and circulars to staff and parents — coming in the next update." />,
  },
};

export default function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => localStorage.getItem('ysg-theme-mode') || (prefersDark ? 'dark' : 'light'));
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmall = useMediaQuery('(max-width:900px)');
  const { isAuthed, userEmail, loading, signIn, signOut } = useAuth();
  const prevAuthed = useRef(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (prevAuthed.current === null) {
      prevAuthed.current = isAuthed; // baseline on first load — no welcome flash for an existing session
      return;
    }
    if (!prevAuthed.current && isAuthed) {
      setShowWelcome(true);
      const t = setTimeout(() => setShowWelcome(false), 3100);
      prevAuthed.current = isAuthed;
      return () => clearTimeout(t);
    }
    prevAuthed.current = isAuthed;
  }, [isAuthed, loading]);

  useEffect(() => { localStorage.setItem('ysg-theme-mode', mode); }, [mode]);

  const theme = useMemo(() => buildTheme(mode), [mode]);
  const { title, group, Component } = PAGES[page];
  const isDark = mode === 'dark';

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrandedLoader />
      </ThemeProvider>
    );
  }

  if (!isAuthed) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onSignIn={signIn} />
      </ThemeProvider>
    );
  }

  if (showWelcome) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginSuccess email={userEmail} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsProvider>
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
            backgroundImage: isDark
              ? `radial-gradient(1100px 500px at 100% -10%, ${alpha(theme.palette.gold.main, 0.08)}, transparent 60%)`
              : `radial-gradient(1100px 500px at 100% -10%, ${alpha(theme.palette.navy[800], 0.06)}, transparent 60%)`,
          }}
        >
          <Sidebar
            page={page}
            setPage={setPage}
            variant={isSmall ? 'temporary' : 'permanent'}
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.72),
                backdropFilter: 'blur(10px)',
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundImage: `linear-gradient(90deg, transparent, ${alpha(theme.palette.gold.main, 0.5)}, transparent)`,
                backgroundSize: '100% 2px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
              }}
            >
              <Toolbar sx={{ gap: 1.5 }}>
                {isSmall && (
                  <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                    <MenuRoundedIcon />
                  </IconButton>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', fontSize: 10, lineHeight: 1.4 }}>
                  {group}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: 18, lineHeight: 1.2 }}>{title}</Typography>
              </Box>
                {!supabaseReady && (
                  <Chip
                    size="small"
                    label="Database not connected — demo data"
                    color="warning"
                    variant="outlined"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  />
                )}
                {userEmail && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                    {userEmail}
                  </Typography>
                )}
                <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                  <IconButton
                    onClick={() => setMode(m => (m === 'dark' ? 'light' : 'dark'))}
                    sx={{
                      bgcolor: alpha(theme.palette.gold.main, isDark ? 0.14 : 0.08),
                      '&:hover': { bgcolor: alpha(theme.palette.gold.main, isDark ? 0.22 : 0.14) },
                    }}
                  >
                    <motion.div
                      key={mode}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: 'flex' }}
                    >
                      {isDark ? <LightModeRoundedIcon sx={{ color: 'secondary.main' }} /> : <DarkModeRoundedIcon />}
                    </motion.div>
                  </IconButton>
                </Tooltip>
                {supabaseReady && (
                  <Tooltip title="Sign out">
                    <IconButton onClick={signOut}>
                      <LogoutRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Toolbar>
            </AppBar>

            <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1180, mx: 'auto' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Component />
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
        </Box>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export { DRAWER_WIDTH };