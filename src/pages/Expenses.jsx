import React, { useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid, Stack,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTable, fmtRs } from '../useTable.js';
import MotionTableRow from '../components/MotionTableRow.jsx';
import { useNotifications } from '../components/NotificationsProvider.jsx';

const DEMO = [];
const empty = { description: '', category: '', amount: '', spent_on: '' };

export default function Expenses() {
  const { rows, addRow, deleteRow } = useTable('expenses', DEMO);
  const { notify, confirmDelete } = useNotifications();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await addRow({ ...form, amount: Number(form.amount) || 0 });
    if (error) notify('Expense save nahi hui.', 'error');
    else notify('Expense add ho gayi.', 'success');
    setForm(empty);
    setSaving(false);
  };

  const handleDelete = async (r) => {
    const ok = await confirmDelete(r.description);
    if (!ok) return;
    const { error } = await deleteRow(r.id);
    if (error) notify('Delete nahi ho saka.', 'error');
    else notify('Expense remove ho gayi.', 'success');
  };

  const sorted = [...rows].sort((a, b) => (b.spent_on || '').localeCompare(a.spent_on || ''));

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Add expense</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Description" required fullWidth size="small" value={form.description} onChange={handleChange('description')} />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField label="Category" fullWidth size="small" placeholder="Rent, Utilities…" value={form.category} onChange={handleChange('category')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Amount" type="number" required fullWidth size="small" value={form.amount} onChange={handleChange('amount')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Date" type="date" required fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.spent_on} onChange={handleChange('spent_on')} />
            </Grid>
            <Grid item xs={6} sm={3} md="auto">
              <Button type="submit" variant="contained" disabled={saving} sx={{ height: 40 }}>Add</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((r, idx) => (
              <MotionTableRow key={r.id} index={idx}>
                <TableCell>{r.description}</TableCell>
                <TableCell>{r.category || '—'}</TableCell>
                <TableCell>{r.spent_on || '—'}</TableCell>
                <TableCell align="right">{fmtRs(r.amount)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDelete(r)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </MotionTableRow>
            ))}
            {sorted.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No expenses recorded yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}