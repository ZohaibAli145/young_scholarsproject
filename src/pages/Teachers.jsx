import React, { useMemo, useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid, Stack, InputAdornment, Chip, Avatar, useTheme, alpha,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useTable, fmtRs, currentMonth } from '../useTable.js';
import MotionTableRow from '../components/MotionTableRow.jsx';
import { useNotifications } from '../components/NotificationsProvider.jsx';
import ToggleStatusPill from '../components/ToggleStatusPill.jsx';
import TeacherDetail from './TeacherDetail.jsx';

const empty = { name: '', subject: '', contact: '', monthly_salary: '' };

export default function Teachers() {
  const theme = useTheme();
  const { rows, addRow, updateRow, deleteRow } = useTable('teachers', []);
  const { rows: salaryPayments, addRow: addSalaryPayment, deleteRow: deleteSalaryPayment } = useTable('salary_payments', []);
  const { notify, confirmDelete } = useNotifications();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [togglingSalaryIds, setTogglingSalaryIds] = useState(new Set());

  const paidTeacherIds = useMemo(() => {
    const cm = currentMonth();
    return new Set(salaryPayments.filter(p => p.month === cm).map(p => p.teacher_id));
  }, [salaryPayments]);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await addRow({ ...form, monthly_salary: Number(form.monthly_salary) || 0 });
    if (error) notify('Teacher add nahi ho saka.', 'error');
    else notify(`${form.name} add ho gaya.`, 'success');
    setForm(empty);
    setSaving(false);
  };

  const handleDelete = async (r) => {
    const ok = await confirmDelete(r.name);
    if (!ok) return false;
    const { error } = await deleteRow(r.id);
    if (error) { notify('Delete nahi ho saka.', 'error'); return false; }
    notify('Teacher remove ho gaya.', 'success');
    return true;
  };

  const handleDeleteFromDetail = async (r) => {
    const ok = await handleDelete(r);
    if (ok) setSelectedId(null);
  };

  const handleUpdateTeacher = async (id, patch) => {
    const { error } = await updateRow(id, patch);
    if (error) { notify('Update nahi ho saka.', 'error'); return false; }
    notify('Teacher update ho gaya.', 'success');
    return true;
  };

  const handleToggleSalary = async (teacher) => {
    const cm = currentMonth();
    setTogglingSalaryIds(prev => new Set(prev).add(teacher.id));
    const existing = salaryPayments.find(p => p.teacher_id === teacher.id && p.month === cm);
    if (existing) {
      const { error } = await deleteSalaryPayment(existing.id);
      if (error) notify('Status update nahi ho saka.', 'error');
      else notify(`${teacher.name} — is month pending mark ho gaya.`, 'success');
    } else {
      const { error } = await addSalaryPayment({
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        month: cm,
        amount: Number(teacher.monthly_salary) || 0,
        paid_on: new Date().toISOString().slice(0, 10),
      });
      if (error) notify('Status update nahi ho saka.', 'error');
      else notify(`${teacher.name} — is month paid mark ho gaya.`, 'success');
    }
    setTogglingSalaryIds(prev => { const next = new Set(prev); next.delete(teacher.id); return next; });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => (r.name || '').toLowerCase().includes(q) || (r.subject || '').toLowerCase().includes(q));
  }, [rows, query]);

  const selectedTeacher = selectedId ? rows.find(r => r.id === selectedId) : null;

  if (selectedTeacher) {
    return (
      <TeacherDetail
        teacher={selectedTeacher}
        onBack={() => setSelectedId(null)}
        onSave={(patch) => handleUpdateTeacher(selectedTeacher.id, patch)}
        onDelete={handleDeleteFromDetail}
        paid={paidTeacherIds.has(selectedTeacher.id)}
        toggling={togglingSalaryIds.has(selectedTeacher.id)}
        onToggle={() => handleToggleSalary(selectedTeacher)}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Add teacher</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Name" required fullWidth size="small" value={form.name} onChange={handleChange('name')} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Subject" fullWidth size="small" value={form.subject} onChange={handleChange('subject')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2.5}>
              <TextField label="Contact" fullWidth size="small" value={form.contact} onChange={handleChange('contact')} />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Monthly salary" type="number" required fullWidth size="small" value={form.monthly_salary} onChange={handleChange('monthly_salary')} />
            </Grid>
            <Grid item xs={6} sm={3} md="auto">
              <Button type="submit" variant="contained" disabled={saving} sx={{ height: 40 }}>Add</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small" placeholder="Search by name or subject…" value={query}
          onChange={(e) => setQuery(e.target.value)} sx={{ minWidth: 280 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }}
        />
        <Chip size="small" variant="outlined" label={`${filtered.length} of ${rows.length}`} />
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">Monthly salary</TableCell>
              <TableCell>This month</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((r, idx) => (
              <MotionTableRow key={r.id} index={idx} onClick={() => setSelectedId(r.id)} sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: 12.5, fontWeight: 700, bgcolor: alpha(theme.palette.navy[800], 0.1), color: theme.palette.navy[800] }}>
                      {(r.name || '?').charAt(0).toUpperCase()}
                    </Avatar>
                    {r.name}
                  </Box>
                </TableCell>
                <TableCell>{r.subject || '—'}</TableCell>
                <TableCell>{r.contact || '—'}</TableCell>
                <TableCell align="right">{fmtRs(r.monthly_salary)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <ToggleStatusPill paid={paidTeacherIds.has(r.id)} loading={togglingSalaryIds.has(r.id)} onToggle={() => handleToggleSalary(r)} />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton size="small" onClick={() => handleDelete(r)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </MotionTableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                {rows.length === 0 ? 'No teachers yet.' : 'No matches for this search.'}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}