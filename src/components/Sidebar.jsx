import React from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useTheme, alpha, Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

export const DRAWER_WIDTH = 256;

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: SpaceDashboardRoundedIcon },
    ],
  },
  {
    label: 'Records',
    items: [
      { key: 'students', label: 'Students', icon: SchoolRoundedIcon },
      { key: 'teachers', label: 'Teachers', icon: PersonRoundedIcon },
      { key: 'fees', label: 'Fees', icon: PaymentsRoundedIcon },
      { key: 'salaries', label: 'Salaries', icon: AccountBalanceWalletRoundedIcon },
      { key: 'expenses', label: 'Expenses', icon: ReceiptLongRoundedIcon },
    ],
  },
  {
    label: 'Coming soon',
    items: [
      { key: 'exams', label: 'Exams & Results', icon: GradeRoundedIcon, soon: true },
      { key: 'attendance', label: 'Attendance', icon: EventAvailableRoundedIcon, soon: true },
      { key: 'timetable', label: 'Timetable', icon: ScheduleRoundedIcon, soon: true },
      { key: 'admissions', label: 'Admissions', icon: HowToRegRoundedIcon, soon: true },
      { key: 'notices', label: 'Notices', icon: CampaignRoundedIcon, soon: true },
    ],
  },
];

const ITEM_RADIUS = 10; // single source of truth — used by both the button and its active-pill overlay

export default function Sidebar({ page, setPage, variant, open, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const gold = theme.palette.gold?.main || theme.palette.primary.main;
  const goldLight = theme.palette.gold?.light || theme.palette.primary.light;

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        bgcolor: isDark ? theme.palette.navy[800] : theme.palette.navy[900],
        color: '#EDE9DC',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.75, pt: 3.5, pb: 2.5 }}>
        <Box
          sx={{
            width: 38, height: 38, borderRadius: 2.5, flexShrink: 0,
            display: 'grid', placeItems: 'center',
            background: `linear-gradient(135deg, ${goldLight}, ${gold})`,
            color: theme.palette.navy[900],
            fontWeight: 800,
            fontSize: 16,
            boxShadow: `0 4px 14px ${alpha(gold, 0.35)}`,
          }}
        >
          YS
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              letterSpacing: 0.6,
              fontWeight: 700,
              background: `linear-gradient(90deg, ${goldLight}, ${gold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            YOUNG SCHOLARS
          </Typography>
          <Typography variant="body2" noWrap sx={{ lineHeight: 1.3, color: '#fff', fontWeight: 600 }}>
            Grammar Secondary School
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: alpha('#fff', 0.08) }} />
      <List
        sx={{
          px: 1.5, py: 1.5,
          flex: '1 1 auto',
          minHeight: 0,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          scrollbarGutter: 'stable',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: alpha('#fff', 0.14),
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha('#fff', 0.24),
          },
        }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <Box key={group.label} sx={{ mb: gi === NAV_GROUPS.length - 1 ? 0 : 2 }}>
            <Typography
              variant="overline"
              sx={{ display: 'block', px: 1.5, pt: gi === 0 ? 0.5 : 1, pb: 0.75, color: alpha('#fff', 0.32), fontSize: 10.5, letterSpacing: 1.1 }}
            >
              {group.label}
            </Typography>
            {group.items.map(({ key, label, icon: Icon, soon }) => {
              const active = page === key;
              return (
                <ListItemButton
                  key={key}
                  onClick={() => { setPage(key); if (onClose) onClose(); }}
                  sx={{
                    borderRadius: `${ITEM_RADIUS}px`,
                    mb: 0.5,
                    py: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    color: active ? '#fff' : alpha('#fff', 0.62),
                    transition: 'background-color 0.18s ease, color 0.18s ease',
                    '&:hover': { bgcolor: active ? 'transparent' : alpha('#fff', 0.06) },
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: ITEM_RADIUS,
                        background: `linear-gradient(90deg, ${alpha(gold, 0.18)}, ${alpha(gold, 0.03)})`,
                        boxShadow: `inset 3px 0 0 ${gold}`,
                      }}
                    />
                  )}
                  <ListItemIcon sx={{ minWidth: 36, color: active ? gold : alpha('#fff', 0.5), zIndex: 1, transition: 'color 0.18s ease' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 600 : 500, noWrap: true, zIndex: 1 }}
                    sx={{ zIndex: 1, minWidth: 0 }}
                  />
                  {soon && (
                    <Chip
                      label="Soon"
                      size="small"
                      variant="outlined"
                      sx={{
                        zIndex: 1, height: 18, fontSize: 10, fontWeight: 700, flexShrink: 0, ml: 0.5,
                        bgcolor: 'transparent',
                        borderColor: alpha(goldLight, 0.4),
                        color: goldLight,
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </List>
      <Divider sx={{ borderColor: alpha('#fff', 0.08) }} />
      <Box sx={{ px: 2.75, py: 2 }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.35) }}>
          © {new Date().getFullYear()} Young Scholars Grammar Secondary School
        </Typography>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          height: '100vh',
          position: 'sticky',
          top: 0,
          boxShadow: isDark ? '2px 0 20px rgba(0,0,0,0.3)' : '2px 0 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      {content}
    </Drawer>
  );
}