import React from 'react';
import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
}

// Builds the last `count` months (oldest first) as 'YYYY-MM' strings.
function lastMonths(count) {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = count - 1; i >= 0; i--) {
    const dd = new Date(d);
    dd.setMonth(dd.getMonth() - i);
    out.push(`${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export default function RevenueChart({ fees, salaries, expenses }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const sum = (arr, pred) => arr.filter(pred).reduce((s, x) => s + (Number(x.amount) || 0), 0);

  const months = lastMonths(6);
  const data = months.map((m) => ({
    month: monthLabel(m),
    revenue: sum(fees, p => p.month === m),
    net: sum(fees, p => p.month === m) - sum(salaries, p => p.month === m) - sum(expenses, e => (e.spent_on || '').slice(0, 7) === m),
  }));

  const hasAnyData = data.some(d => d.revenue !== 0 || d.net !== 0);

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Revenue — last 6 months</Typography>
      {!hasAnyData ? (
        <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary', fontSize: 13.5 }}>
          Fee payments record karo to yahan trend dikhega.
        </Box>
      ) : (
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.gold.main} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={theme.palette.gold.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.navy[600] || theme.palette.primary.main} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={theme.palette.navy[600] || theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={{ stroke: theme.palette.divider }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} width={54}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                formatter={(v, name) => [`Rs. ${Number(v).toLocaleString('en-PK')}`, name === 'revenue' ? 'Fees collected' : 'Net revenue']}
                contentStyle={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8, fontSize: 12.5,
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke={theme.palette.gold.main} strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="net" stroke={isDark ? theme.palette.text.secondary : theme.palette.navy[800]} strokeWidth={2} fill="url(#netGrad)" name="net" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}