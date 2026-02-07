import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  failure_reason: string | null;
  created_at: string;
}

export const useLoginAttempts = (email: string) => {
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [recentAttempts, setRecentAttempts] = useState<LoginAttempt[]>([]);
  const [isCheckingLockout, setIsCheckingLockout] = useState(false);

  const checkLockout = useCallback(async () => {
    if (!email) {
      setIsLocked(false);
      setLockoutRemaining(0);
      return;
    }

    setIsCheckingLockout(true);
    try {
      const { data: locked, error: lockError } = await supabase
        .rpc('is_account_locked', { check_email: email });

      if (lockError) {
        console.error('Error checking lockout:', lockError);
        return;
      }

      setIsLocked(locked || false);

      if (locked) {
        const { data: remaining, error: remainingError } = await supabase
          .rpc('get_lockout_remaining', { check_email: email });

        if (!remainingError && remaining) {
          setLockoutRemaining(remaining);
        }
      } else {
        setLockoutRemaining(0);
      }
    } catch (error) {
      console.error('Error checking lockout:', error);
    } finally {
      setIsCheckingLockout(false);
    }
  }, [email]);

  const logAttempt = async (success: boolean, failureReason?: string, userId?: string) => {
    try {
      await supabase
        .from('admin_login_attempts')
        .insert({
          email,
          user_id: userId || null,
          success,
          failure_reason: failureReason || null,
          user_agent: navigator.userAgent,
        });

      // Recheck lockout status after logging
      await checkLockout();
    } catch (error) {
      console.error('Error logging attempt:', error);
    }
  };

  const fetchRecentAttempts = useCallback(async () => {
    if (!email) {
      setRecentAttempts([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_login_attempts')
        .select('id, email, success, failure_reason, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent attempts:', error);
        return;
      }

      setRecentAttempts(data || []);
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
    }
  }, [email]);

  // Check lockout status when email changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (email && email.includes('@')) {
        checkLockout();
        fetchRecentAttempts();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [email, checkLockout, fetchRecentAttempts]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutRemaining]);

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isLocked,
    lockoutRemaining,
    formatLockoutTime,
    recentAttempts,
    logAttempt,
    checkLockout,
    isCheckingLockout,
  };
};
