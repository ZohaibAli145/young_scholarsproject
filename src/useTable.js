import { useEffect, useState, useCallback } from 'react';
import { supabase, supabaseReady } from './supabaseClient.js';

/**
 * Generic hook for a Supabase table. Falls back to local in-memory state
 * (seeded with demoRows) when Supabase isn't configured yet, so the UI is
 * fully clickable in demo mode before a database is connected.
 */
export function useTable(tableName, demoRows = []) {
  const [rows, setRows] = useState(demoRows);
  const [loading, setLoading] = useState(supabaseReady);

  const fetchAll = useCallback(async () => {
    if (!supabaseReady) return;
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
    if (!error && data) setRows(data);
    setLoading(false);
  }, [tableName]);

  useEffect(() => {
    if (!supabaseReady) return;
    fetchAll();
    const channel = supabase
      .channel(`realtime:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tableName, fetchAll]);

  const addRow = useCallback(async (row) => {
    if (!supabaseReady) {
      setRows(prev => [{ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }, ...prev]);
      return { error: null };
    }
    const { error } = await supabase.from(tableName).insert(row);
    if (!error) fetchAll(); // update immediately, don't wait on Realtime being configured
    return { error };
  }, [tableName, fetchAll]);

  const updateRow = useCallback(async (id, patch) => {
    if (!supabaseReady) {
      setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
      return { error: null };
    }
    const { error } = await supabase.from(tableName).update(patch).eq('id', id);
    if (!error) fetchAll();
    return { error };
  }, [tableName, fetchAll]);

  const deleteRow = useCallback(async (id) => {
    if (!supabaseReady) {
      setRows(prev => prev.filter(r => r.id !== id));
      return { error: null };
    }
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (!error) fetchAll();
    return { error };
  }, [tableName, fetchAll]);

  return { rows, loading, addRow, updateRow, deleteRow, refresh: fetchAll };
}

export const fmtRs = (n) => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

export const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const lastMonth = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};