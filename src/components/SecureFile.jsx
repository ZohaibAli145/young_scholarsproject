import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, IconButton, Paper, Typography, useTheme, alpha } from '@mui/material';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { supabase } from '../supabaseClient.js';

export const PHOTO_BUCKET = 'student-photos';
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const signedUrlCache = new Map();

export async function getSignedUrl(path) {
  if (!path) return null;
  if (signedUrlCache.has(path)) return signedUrlCache.get(path);
  const { data, error } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  if (error) {
    console.error('Signed URL fetch failed', error);
    return null;
  }
  signedUrlCache.set(path, data.signedUrl);
  setTimeout(() => signedUrlCache.delete(path), (SIGNED_URL_TTL - 60) * 1000);
  return data.signedUrl;
}

export async function openSignedDoc(path) {
  if (!path) return;
  const url = await getSignedUrl(path);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
  else alert('File open nahi ho saka. Storage setup check karo.');
}

export function SecureAvatar({ path, name, size = 28, fontSize = 12.5 }) {
  const theme = useTheme();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    if (path) getSignedUrl(path).then(u => { if (active) setUrl(u); });
    return () => { active = false; };
  }, [path]);

  return (
    <Avatar
      src={url || undefined}
      sx={{
        width: size, height: size, fontSize,
        fontWeight: 700,
        bgcolor: alpha(theme.palette.navy[800], 0.1),
        color: theme.palette.navy[800],
      }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </Avatar>
  );
}

export function PhotoUpload({ photoPath, name, onUploaded, size = 72 }) {
  const theme = useTheme();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;
      onUploaded(path);
    } catch (err) {
      console.error('Photo upload failed', err);
      alert('Photo upload nahi ho saka. Storage bucket "student-photos" (private) set up hai check karo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <SecureAvatar path={photoPath} name={name} size={size} fontSize={size / 3} />
        {uploading && (
          <CircularProgress
            size={size}
            thickness={2}
            sx={{ position: 'absolute', top: 0, left: 0, color: theme.palette.gold?.main }}
          />
        )}
      </Box>
      <Box>
        <Button size="small" variant="outlined" startIcon={<PhotoCameraRoundedIcon />} onClick={handlePick} disabled={uploading}>
          {photoPath ? 'Change photo' : 'Upload photo'}
        </Button>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
          JPG or PNG · stored privately, never a public link
        </Typography>
      </Box>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </Box>
  );
}

export function DocumentSlot({ label, hint, path, onUploaded }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(objectPath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;
      onUploaded(objectPath);
    } catch (err) {
      console.error('Document upload failed', err);
      alert(`${label} upload nahi ho saka. Storage bucket set up hai check karo.`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <InsertDriveFileRoundedIcon fontSize="small" sx={{ color: path ? 'success.main' : 'text.disabled' }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: path ? 'success.main' : 'text.secondary' }}>
          {path ? 'Uploaded' : (hint || 'Not uploaded yet')}
        </Typography>
      </Box>
      {path && (
        <IconButton size="small" onClick={() => openSignedDoc(path)} title="View">
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      )}
      <Button size="small" variant="outlined" onClick={handlePick} disabled={uploading}>
        {uploading ? '...' : path ? 'Replace' : 'Upload'}
      </Button>
      <input ref={fileRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFile} />
    </Paper>
  );
}