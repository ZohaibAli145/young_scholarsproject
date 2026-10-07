import { useEffect, useState, useCallback } from 'react';
import { supabase, supabaseReady } from './supabaseClient.js';

export function useAuth() {
  // When Supabase isn't configured yet (demo mode), there's nothing to
  // authenticate against, so we treat the app as "logged in" to demo mode.
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseReady);

  useEffect(() => {
    if (!supabaseReady) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabaseReady) return { error: null };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabaseReady) return;
    await supabase.auth.signOut();
  }, []);

  return {
    // In demo mode (no DB configured) we skip the login gate entirely.
    isAuthed: !supabaseReady || Boolean(session),
    userEmail: session?.user?.email || null,
    loading,
    signIn,
    signOut,
  };
}