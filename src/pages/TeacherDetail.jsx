import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, IconButton, Grid, Stack, useTheme, alpha } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { fmtRs } from '../useTable.js';
import ToggleStatusPill from '../components/ToggleStatusPill.jsx';

function ViewField({ label, value, md = 3 }) {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6} md={md}>
      <Box sx={{ height: '100%', px: 1.5, py: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.text.primary, 0.03) }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>{value || '—'}</Typography>
      </Box>
    </Grid>
  );
}

export default function TeacherDetail({ teacher, onBack, onSave, onDelete, paid, toggling, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(teacher);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft(teacher); setEditing(true); };
  const cancelEdit = () => { setDraft(teacher); setEditing(false); };
  const handleChange = (field) => (e) => setDraft(d => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const patch = { ...draft, monthly_salary: Number(draft.monthly_salary) || 0 };
    delete patch.id;
    delete patch.created_at;
    const ok = await onSave(patch);
    setSaving(false);
    if (ok) setEditing(false);
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={onBack}><ArrowBackRoundedIcon fontSize="small" /></IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>{teacher.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{teacher.subject || 'Teacher profile'}</Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <ToggleStatusPill paid={paid} loading={toggling} onToggle={onToggle} />
        {!editing ? (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<EditRoundedIcon />} onClick={startEdit}>Edit</Button>
            <Button size="small" color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => onDelete(teacher)}>Delete</Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<CloseRoundedIcon />} onClick={cancelEdit} disabled={saving}>Cancel</Button>
            <Button size="small" variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Stack>
        )}
      </Box>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
        <Grid container spacing={editing ? 2 : 1}>
          {editing ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Name" required fullWidth size="small" value={draft.name || ''} onChange={handleChange('name')} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Subject" fullWidth size="small" value={draft.subject || ''} onChange={handleChange('subject')} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Contact" fullWidth size="small" value={draft.contact || ''} onChange={handleChange('contact')} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Monthly salary" type="number" required fullWidth size="small" value={draft.monthly_salary ?? ''} onChange={handleChange('monthly_salary')} />
              </Grid>
            </>
          ) : (
            <>
              <ViewField label="Subject" value={teacher.subject} />
              <ViewField label="Contact" value={teacher.contact} />
              <ViewField label="Monthly salary" value={fmtRs(teacher.monthly_salary)} />
            </>
          )}
        </Grid>
      </Paper>
    </Stack>
  );
}