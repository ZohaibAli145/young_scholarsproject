import React, { useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, IconButton, Grid, Stack, MenuItem, Divider, useTheme, alpha,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { fmtRs } from '../useTable.js';
import { SecureAvatar, PhotoUpload, DocumentSlot } from '../components/SecureFile.jsx';
import ToggleStatusPill from '../components/ToggleStatusPill.jsx';

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SECTIONS = [
  {
    title: 'Basic info',
    fields: [
      { key: 'dob', label: 'Date of birth', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: GENDERS },
      { key: 'b_form_number', label: 'B-Form number' },
      { key: 'blood_group', label: 'Blood group', type: 'select', options: BLOOD_GROUPS },
      { key: 'class_name', label: 'Class' },
      { key: 'section', label: 'Section' },
      { key: 'roll_number', label: 'Roll number' },
      { key: 'admission_number', label: 'Admission number' },
      { key: 'admission_date', label: 'Admission date', type: 'date' },
    ],
  },
  {
    title: 'Parent / Guardian',
    fields: [
      { key: 'father_name', label: "Father's name" },
      { key: 'father_cnic', label: "Father's CNIC" },
      { key: 'father_occupation', label: "Father's occupation" },
      { key: 'contact', label: "Father's contact" },
      { key: 'mother_name', label: "Mother's name" },
      { key: 'mother_cnic', label: "Mother's CNIC" },
      { key: 'mother_contact', label: "Mother's contact" },
      { key: 'emergency_contact', label: 'Emergency contact' },
      { key: 'guardian_name', label: "Guardian's name" },
      { key: 'guardian_relation', label: 'Relation to student' },
      { key: 'guardian_cnic', label: "Guardian's CNIC" },
      { key: 'guardian_contact', label: "Guardian's contact" },
      { key: 'address', label: 'Home address', full: true, multiline: true },
    ],
  },
  {
    title: 'Academic history',
    fields: [
      { key: 'previous_school', label: 'Previous school' },
      { key: 'previous_class', label: 'Previous class' },
      { key: 'tc_number', label: 'TC number' },
    ],
  },
  {
    title: 'Fee',
    fields: [
      { key: 'monthly_fee', label: 'Monthly fee', type: 'number' },
      { key: 'admission_fee', label: 'Admission fee', type: 'number' },
    ],
  },
];

// A read-only field styled exactly like its editable counterpart (same grid slot),
// so the page doesn't reflow or look sparse when switching between view and edit.
function ViewField({ label, value, full, md = 3 }) {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={full ? 12 : 6} md={full ? 12 : md}>
      <Box
        sx={{
          height: '100%',
          px: 1.5, py: 1,
          borderRadius: 1.5,
          bgcolor: alpha(theme.palette.text.primary, 0.03),
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
          {value || '—'}
        </Typography>
      </Box>
    </Grid>
  );
}

export default function StudentDetail({ student, onBack, onSave, onDelete, paid, toggling, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(student);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft(student); setEditing(true); };
  const cancelEdit = () => { setDraft(student); setEditing(false); };
  const handleChange = (field) => (e) => setDraft(d => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const patch = {
      ...draft,
      monthly_fee: Number(draft.monthly_fee) || 0,
      admission_fee: draft.admission_fee === '' || draft.admission_fee == null ? null : Number(draft.admission_fee),
    };
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
        <SecureAvatar path={student.photo_path} name={student.name} size={36} fontSize={14} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>{student.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {[student.class_name && `Class ${student.class_name}`, student.section, student.admission_number].filter(Boolean).join(' · ') || 'Student profile'}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <ToggleStatusPill paid={paid} loading={toggling} onToggle={onToggle} />
        {!editing ? (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<EditRoundedIcon />} onClick={startEdit}>Edit</Button>
            <Button size="small" color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => onDelete(student)}>
              Delete
            </Button>
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
        {editing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <PhotoUpload photoPath={draft.photo_path} name={draft.name} onUploaded={(path) => setDraft(d => ({ ...d, photo_path: path }))} size={56} />
            <TextField label="Name" required size="small" value={draft.name || ''} onChange={handleChange('name')} sx={{ flex: 1, maxWidth: 320 }} />
          </Box>
        )}

        {SECTIONS.map((section, si) => (
          <Box key={section.title} sx={{ mt: si === 0 ? 0 : 2 }}>
            {si > 0 && <Divider sx={{ mb: 2 }} />}
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: 11 }}>
              {section.title}
            </Typography>
            <Grid container spacing={editing ? 2 : 1}>
              {section.fields.map(f => editing ? (
                <Grid item xs={12} sm={f.full ? 12 : 6} md={f.full ? 12 : 3} key={f.key}>
                  <TextField
                    label={f.label}
                    fullWidth
                    size="small"
                    type={f.type === 'select' ? undefined : (f.type || 'text')}
                    select={f.type === 'select'}
                    multiline={f.multiline}
                    value={draft[f.key] ?? ''}
                    onChange={handleChange(f.key)}
                    InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
                  >
                    {f.type === 'select' && f.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Grid>
              ) : (
                <ViewField
                  key={f.key}
                  label={f.label}
                  full={f.full}
                  value={section.title === 'Fee' && student[f.key] != null ? fmtRs(student[f.key]) : student[f.key]}
                />
              ))}
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: 11 }}>Documents</Typography>
        {editing ? (
          <Stack spacing={1.5}>
            <DocumentSlot label="Last school's certificate (TC)" path={draft.tc_certificate_path} onUploaded={(p) => setDraft(d => ({ ...d, tc_certificate_path: p }))} />
            <DocumentSlot label="Father's CNIC" path={draft.father_cnic_path} onUploaded={(p) => setDraft(d => ({ ...d, father_cnic_path: p }))} />
            <DocumentSlot label="Guardian's CNIC" hint="Only if guardian is different from father" path={draft.guardian_cnic_path} onUploaded={(p) => setDraft(d => ({ ...d, guardian_cnic_path: p }))} />
          </Stack>
        ) : (
          <Grid container spacing={1}>
            <ViewField label="Last school certificate (TC)" value={student.tc_certificate_path ? 'Uploaded' : null} md={4} />
            <ViewField label="Father's CNIC" value={student.father_cnic_path ? 'Uploaded' : null} md={4} />
            <ViewField label="Guardian's CNIC" value={student.guardian_cnic_path ? 'Uploaded' : null} md={4} />
          </Grid>
        )}
      </Paper>
    </Stack>
  );
}