import React, { useMemo, useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid, Stack, InputAdornment, Chip, useTheme,
  Stepper, Step, StepLabel, MenuItem,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useTable, fmtRs, currentMonth } from '../useTable.js';
import MotionTableRow from '../components/MotionTableRow.jsx';
import { useNotifications } from '../components/NotificationsProvider.jsx';
import ToggleStatusPill from '../components/ToggleStatusPill.jsx';
import { SecureAvatar, PhotoUpload, DocumentSlot, PHOTO_BUCKET } from '../components/SecureFile.jsx';
import { supabase } from '../supabaseClient.js';
import StudentDetail from './StudentDetail.jsx';

const empty = {
  name: '', photo_path: '', dob: '', gender: '', b_form_number: '', blood_group: '',
  class_name: '', section: '', roll_number: '', admission_date: '', admission_number: '',
  father_name: '', father_cnic: '', father_occupation: '', contact: '',
  mother_name: '', mother_cnic: '', mother_contact: '',
  guardian_name: '', guardian_relation: '', guardian_cnic: '', guardian_contact: '',
  address: '', emergency_contact: '',
  previous_school: '', previous_class: '', tc_number: '',
  tc_certificate_path: '', father_cnic_path: '', guardian_cnic_path: '',
  monthly_fee: '', admission_fee: '',
};

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const STEPS = [
  { key: 'basic', label: 'Basic info' },
  { key: 'parent', label: 'Parent / Guardian' },
  { key: 'academic', label: 'Academic history' },
  { key: 'documents', label: 'Documents' },
  { key: 'fee', label: 'Fee' },
];

function Field({ label, field, form, onChange, type = 'text', required, select, options, sm = 6, md = 3, ...rest }) {
  return (
    <Grid item xs={12} sm={sm} md={md}>
      <TextField
        label={label} fullWidth size="small" type={type} required={required} select={select}
        value={form[field]} onChange={onChange(field)}
        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        {...rest}
      >
        {select && options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </TextField>
    </Grid>
  );
}

export default function Students() {
  const theme = useTheme();
  const { rows, addRow, updateRow, deleteRow } = useTable('students', []);
  const { rows: feePayments, addRow: addFeePayment, deleteRow: deleteFeePayment } = useTable('fee_payments', []);
  const { notify, confirmDelete } = useNotifications();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [togglingFeeIds, setTogglingFeeIds] = useState(new Set());

  const paidStudentIds = useMemo(() => {
    const cm = currentMonth();
    return new Set(feePayments.filter(p => p.month === cm).map(p => p.student_id));
  }, [feePayments]);

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const isLastStep = activeStep === STEPS.length - 1;
  const isFirstStep = activeStep === 0;
  const goNext = () => {
    if (activeStep === 0 && !form.name.trim()) { notify('Student ka naam likho pehle.', 'error'); return; }
    setActiveStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setActiveStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.monthly_fee) { notify('Monthly fee zaroori hai.', 'error'); return; }
    setSaving(true);
    const { error } = await addRow({
      ...form,
      monthly_fee: Number(form.monthly_fee) || 0,
      admission_fee: form.admission_fee === '' ? null : Number(form.admission_fee),
    });
    if (error) notify('Student add nahi ho saka.', 'error');
    else notify(`${form.name} add ho gaya.`, 'success');
    setForm(empty);
    setActiveStep(0);
    setSaving(false);
  };

  const handleDelete = async (r) => {
    const ok = await confirmDelete(r.name);
    if (!ok) return false;
    const filesToRemove = [r.photo_path, r.tc_certificate_path, r.father_cnic_path, r.guardian_cnic_path].filter(Boolean);
    if (filesToRemove.length) await supabase.storage.from(PHOTO_BUCKET).remove(filesToRemove);
    const { error } = await deleteRow(r.id);
    if (error) { notify('Delete nahi ho saka.', 'error'); return false; }
    notify('Student remove ho gaya.', 'success');
    return true;
  };

  const handleDeleteFromDetail = async (r) => {
    const ok = await handleDelete(r);
    if (ok) setSelectedId(null);
  };

  const handleUpdateStudent = async (id, patch) => {
    const { error } = await updateRow(id, patch);
    if (error) { notify('Update nahi ho saka.', 'error'); return false; }
    notify('Student update ho gaya.', 'success');
    return true;
  };

  const handleToggleFee = async (student) => {
    const cm = currentMonth();
    setTogglingFeeIds(prev => new Set(prev).add(student.id));
    const existing = feePayments.find(p => p.student_id === student.id && p.month === cm);
    if (existing) {
      const { error } = await deleteFeePayment(existing.id);
      if (error) notify('Status update nahi ho saka.', 'error');
      else notify(`${student.name} — is month pending mark ho gaya.`, 'success');
    } else {
      const { error } = await addFeePayment({
        student_id: student.id,
        student_name: student.name,
        month: cm,
        amount: Number(student.monthly_fee) || 0,
        paid_on: new Date().toISOString().slice(0, 10),
      });
      if (error) notify('Status update nahi ho saka.', 'error');
      else notify(`${student.name} — is month paid mark ho gaya.`, 'success');
    }
    setTogglingFeeIds(prev => { const next = new Set(prev); next.delete(student.id); return next; });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      (r.name || '').toLowerCase().includes(q) ||
      (r.class_name || '').toLowerCase().includes(q) ||
      (r.father_name || '').toLowerCase().includes(q) ||
      (r.admission_number || '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const selectedStudent = selectedId ? rows.find(r => r.id === selectedId) : null;

  if (selectedStudent) {
    return (
      <StudentDetail
        student={selectedStudent}
        onBack={() => setSelectedId(null)}
        onSave={(patch) => handleUpdateStudent(selectedStudent.id, patch)}
        onDelete={handleDeleteFromDetail}
        paid={paidStudentIds.has(selectedStudent.id)}
        toggling={togglingFeeIds.has(selectedStudent.id)}
        onToggle={() => handleToggleFee(selectedStudent)}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2.5 }}>Add student</Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {STEPS.map(s => <Step key={s.key}><StepLabel>{s.label}</StepLabel></Step>)}
        </Stepper>
        <Box component="form" onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PhotoUpload photoPath={form.photo_path} name={form.name} onUploaded={(path) => setForm(f => ({ ...f, photo_path: path }))} />
              </Grid>
              <Field label="Name" field="name" form={form} onChange={handleChange} required />
              <Field label="Date of birth" field="dob" form={form} onChange={handleChange} type="date" />
              <Field label="Gender" field="gender" form={form} onChange={handleChange} select options={GENDERS} />
              <Field label="B-Form number" field="b_form_number" form={form} onChange={handleChange} />
              <Field label="Blood group" field="blood_group" form={form} onChange={handleChange} select options={BLOOD_GROUPS} md={2} />
              <Field label="Class" field="class_name" form={form} onChange={handleChange} md={2} />
              <Field label="Section" field="section" form={form} onChange={handleChange} md={2} />
              <Field label="Roll number" field="roll_number" form={form} onChange={handleChange} md={2} />
              <Field label="Admission number" field="admission_number" form={form} onChange={handleChange} md={3} />
              <Field label="Admission date" field="admission_date" form={form} onChange={handleChange} type="date" md={3} />
            </Grid>
          )}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Field label="Father's name" field="father_name" form={form} onChange={handleChange} />
              <Field label="Father's CNIC" field="father_cnic" form={form} onChange={handleChange} placeholder="xxxxx-xxxxxxx-x" />
              <Field label="Father's occupation" field="father_occupation" form={form} onChange={handleChange} />
              <Field label="Father's contact" field="contact" form={form} onChange={handleChange} />
              <Field label="Mother's name" field="mother_name" form={form} onChange={handleChange} />
              <Field label="Mother's CNIC" field="mother_cnic" form={form} onChange={handleChange} placeholder="xxxxx-xxxxxxx-x" />
              <Field label="Mother's contact" field="mother_contact" form={form} onChange={handleChange} />
              <Field label="Emergency contact" field="emergency_contact" form={form} onChange={handleChange} />
              <Field label="Guardian's name" field="guardian_name" form={form} onChange={handleChange} />
              <Field label="Relation to student" field="guardian_relation" form={form} onChange={handleChange} />
              <Field label="Guardian's CNIC" field="guardian_cnic" form={form} onChange={handleChange} placeholder="xxxxx-xxxxxxx-x" />
              <Field label="Guardian's contact" field="guardian_contact" form={form} onChange={handleChange} />
              <Field label="Home address" field="address" form={form} onChange={handleChange} sm={12} md={12} multiline />
            </Grid>
          )}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Field label="Previous school" field="previous_school" form={form} onChange={handleChange} md={4} />
              <Field label="Previous class" field="previous_class" form={form} onChange={handleChange} md={4} />
              <Field label="Transfer certificate (TC) number" field="tc_number" form={form} onChange={handleChange} md={4} />
            </Grid>
          )}
          {activeStep === 3 && (
            <Stack spacing={1.5}>
              <DocumentSlot label="Last school's certificate (TC)" hint="School leaving / transfer certificate" path={form.tc_certificate_path} onUploaded={(path) => setForm(f => ({ ...f, tc_certificate_path: path }))} />
              <DocumentSlot label="Father's CNIC" path={form.father_cnic_path} onUploaded={(path) => setForm(f => ({ ...f, father_cnic_path: path }))} />
              <DocumentSlot label="Guardian's CNIC" hint="Only if guardian is different from father" path={form.guardian_cnic_path} onUploaded={(path) => setForm(f => ({ ...f, guardian_cnic_path: path }))} />
            </Stack>
          )}
          {activeStep === 4 && (
            <Grid container spacing={2}>
              <Field label="Monthly fee" field="monthly_fee" form={form} onChange={handleChange} type="number" required md={3} />
              <Field label="Admission fee (one-time)" field="admission_fee" form={form} onChange={handleChange} type="number" md={3} />
            </Grid>
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={goBack} disabled={isFirstStep} sx={{ visibility: isFirstStep ? 'hidden' : 'visible' }}>Back</Button>
            {isLastStep ? (
              <Button type="submit" variant="contained" disabled={saving} sx={{ height: 40, px: 4 }}>{saving ? 'Adding…' : 'Add student'}</Button>
            ) : (
              <Button variant="contained" onClick={goNext} sx={{ height: 40, px: 4 }}>Next</Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small" placeholder="Search by name, class, father's name, admission #…" value={query}
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
              <TableCell>Class / Section</TableCell>
              <TableCell>Father's name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">Monthly fee</TableCell>
              <TableCell>This month</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((r, idx) => (
              <MotionTableRow
                key={r.id}
                index={idx}
                onClick={() => setSelectedId(r.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <SecureAvatar path={r.photo_path} name={r.name} />
                    {r.name}
                  </Box>
                </TableCell>
                <TableCell>{[r.class_name, r.section].filter(Boolean).join(' - ') || '—'}</TableCell>
                <TableCell>{r.father_name || '—'}</TableCell>
                <TableCell>{r.contact || '—'}</TableCell>
                <TableCell align="right">{fmtRs(r.monthly_fee)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <ToggleStatusPill paid={paidStudentIds.has(r.id)} loading={togglingFeeIds.has(r.id)} onToggle={() => handleToggleFee(r)} />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton size="small" onClick={() => handleDelete(r)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </MotionTableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                {rows.length === 0 ? 'No students yet.' : 'No matches for this search.'}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}