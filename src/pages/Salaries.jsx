import React, { useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid, Stack, MenuItem,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTable, fmtRs, currentMonth } from '../useTable.js';
import MotionTableRow from '../components/MotionTableRow.jsx';
import { useNotifications } from '../components/NotificationsProvider.jsx';
import StatusPill from '../components/StatusPill.jsx';

const DEMO_TEACHERS = [
  { id: 'demo-1', name: 'Sadia Malik', monthly_salary: 45000 },
  { id: 'demo-2', name: 'Usman Tariq', monthly_salary: 48000 },
];
const DEMO_SALARIES = [];

const empty = { teacher_id: '', amount: '', month: currentMonth(), paid_on: '' };

export default function Salaries() {
  const { rows: teachers } = useTable('teachers', DEMO_TEACHERS);
  const { rows, addRow, deleteRow } = useTable('salary_payments', DEMO_SALARIES);
  const { notify, confirmDelete } = useNotifications();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const teacher = teachers.find(t => t.id === form.teacher_id);
    const { error } = await addRow({
      teacher_id: form.teacher_id,
      teacher_name: teacher ? teacher.name : '',
      amount: Number(form.amount) || 0,
      month: form.month,
      paid_on: form.paid_on,
    });
    if (error) notify('Salary payment save nahi hui.', 'error');
    else notify('Salary payment record ho gayi.', 'success');
    setForm({ ...empty, month: currentMonth() });
    setSaving(false);
  };

  const handleDelete = async (r) => {
    const ok = await confirmDelete(`${r.teacher_name || 'Ye'} ki ${r.month} ki payment`);
    if (!ok) return;
    const { error } = await deleteRow(r.id);
    if (error) notify('Delete nahi ho saka.', 'error');
    else notify('Payment record remove ho gaya.', 'success');
  };

  const sorted = [...rows].sort((a, b) => (b.paid_on || '').localeCompare(a.paid_on || ''));

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Record a salary payment</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField select label="Teacher" required fullWidth size="small" value={form.teacher_id} onChange={handleChange('teacher_id')}>
                {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Amount" type="number" required fullWidth size="small" value={form.amount} onChange={handleChange('amount')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="For month" type="month" required fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.month} onChange={handleChange('month')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Date paid" type="date" required fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.paid_on} onChange={handleChange('paid_on')} />
            </Grid>
            <Grid item xs={6} sm={3} md="auto">
              <Button type="submit" variant="contained" disabled={saving} sx={{ height: 40 }}>Record</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Date paid</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((r, idx) => (
              <MotionTableRow key={r.id} index={idx}>
                <TableCell>{r.teacher_name || '—'}</TableCell>
                <TableCell>{r.month || '—'}</TableCell>
                <TableCell>{r.paid_on || '—'}</TableCell>
                <TableCell align="right">{fmtRs(r.amount)}</TableCell>
                <TableCell><StatusPill label="Paid" tone="paid" /></TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDelete(r)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </MotionTableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No salary payments recorded yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}