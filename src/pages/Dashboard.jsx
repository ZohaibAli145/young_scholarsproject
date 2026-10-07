import React from 'react';
import { Paper, Typography, Stack, Box, List, ListItem, ListItemText, Chip, Divider, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StatCard from '../components/StatCard.jsx';
import RevenueChart from '../components/RevenueChart.jsx';
import { useTable, fmtRs, currentMonth, lastMonth } from '../useTable.js';

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

function EmptyPendingState({ label }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 2 }}>
      <CheckCircleRoundedIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>
      )}
    </Box>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const { rows: students } = useTable('students', []);
  const { rows: teachers } = useTable('teachers', []);
  const { rows: fees } = useTable('fee_payments', []);
  const { rows: salaries } = useTable('salary_payments', []);
  const { rows: expenses } = useTable('expenses', []);

  const curM = currentMonth();
  const lastM = lastMonth();
  const sum = (arr, pred) => arr.filter(pred || (() => true)).reduce((s, x) => s + (Number(x.amount) || 0), 0);

  const netFor = (month) =>
    sum(fees, p => p.month === month) - sum(salaries, p => p.month === month) - sum(expenses, e => (e.spent_on || '').slice(0, 7) === month);

  const netThis = netFor(curM);
  const netLast = netFor(lastM);
  const netAll = sum(fees) - sum(salaries) - sum(expenses);
  const trend = netLast !== 0 ? ((netThis - netLast) / Math.abs(netLast)) * 100 : null;

  const paidStudentIds = new Set(fees.filter(p => p.month === curM).map(p => p.student_id));
  const pendingStudents = students.filter(s => !paidStudentIds.has(s.id));

  const paidTeacherIds = new Set(salaries.filter(p => p.month === curM).map(p => p.teacher_id));
  const pendingTeachers = teachers.filter(t => !paidTeacherIds.has(t.id));

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <StatCard
          icon={TrendingUpRoundedIcon}
          label="This month revenue"
          value={fmtRs(netThis)}
          tone={netThis >= 0 ? 'positive' : 'negative'}
          delay={0}
          trend={trend}
        />
        <StatCard
          icon={CalendarMonthRoundedIcon}
          label="Last month revenue"
          value={fmtRs(netLast)}
          tone="neutral"
          delay={0.06}
        />
        <StatCard
          icon={AccountBalanceRoundedIcon}
          label="All-time net revenue"
          value={fmtRs(netAll)}
          tone={netAll >= 0 ? 'positive' : 'negative'}
          delay={0.12}
        />
      </Stack>

      <RevenueChart fees={fees} salaries={salaries} expenses={expenses} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, flex: 1 }}>
          <SectionHeader title="Pending fees" subtitle={`This month · ${pendingStudents.length} outstanding`} />
          <Divider sx={{ mb: 1 }} />
          {pendingStudents.length === 0 ? (
            <EmptyPendingState label="All fees collected for this month." />
          ) : (
            <List dense component={motion.ul} variants={listVariants} initial="hidden" animate="show" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {pendingStudents.map(s => (
                <ListItem key={s.id} disableGutters component={motion.li} variants={itemVariants}
                  secondaryAction={
                    <Chip size="small" label={fmtRs(s.monthly_fee)}
                      sx={{ bgcolor: alpha(theme.palette.error.main, 0.12), color: theme.palette.error.main, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }} />
                  }>
                  <ListItemText primary={s.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, flex: 1 }}>
          <SectionHeader title="Pending salaries" subtitle={`This month · ${pendingTeachers.length} outstanding`} />
          <Divider sx={{ mb: 1 }} />
          {pendingTeachers.length === 0 ? (
            <EmptyPendingState label="All salaries paid for this month." />
          ) : (
            <List dense component={motion.ul} variants={listVariants} initial="hidden" animate="show" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {pendingTeachers.map(t => (
                <ListItem key={t.id} disableGutters component={motion.li} variants={itemVariants}
                  secondaryAction={
                    <Chip size="small" label={fmtRs(t.monthly_salary)}
                      sx={{ bgcolor: alpha(theme.palette.error.main, 0.12), color: theme.palette.error.main, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }} />
                  }>
                  <ListItemText primary={t.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Chip
          size="small"
          label={`${students.length} students`}
          sx={{ bgcolor: alpha(theme.palette.gold?.main || theme.palette.primary.main, 0.1), fontWeight: 600 }}
        />
        <Chip
          size="small"
          label={`${teachers.length} teachers`}
          sx={{ bgcolor: alpha(theme.palette.gold?.main || theme.palette.primary.main, 0.1), fontWeight: 600 }}
        />
      </Stack>
    </Stack>
  );
}