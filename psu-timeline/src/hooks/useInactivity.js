// src/hooks/useInactivity.js
// Custom React hook that tracks user inactivity.
// After `timeout` milliseconds of no mouse/touch/keyboard activity,
// it calls the `onIdle` callback — which triggers the auto-loop mode.

import { useEffect, useRef, useCallback } from 'react';

/**
 * useInactivity
 * @param {Function} onIdle     - Called when user goes idle
 * @param {Function} onActive   - Called when user becomes active again
 * @param {number}   timeout    - Milliseconds of inactivity before calling onIdle
 */
export function useInactivity(onIdle, onActive, timeout = 12000) {
  // Store the timer ID so we can clear it on new activity
  const timerRef = useRef(null);

  // Wrap onActive in useCallback to keep reference stable across renders
  const handleActivity = useCallback(() => {
    // Cancel any pending idle timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Notify that user is active
    onActive();

    // Start a fresh idle timer
    timerRef.current = setTimeout(() => {
      onIdle();
    }, timeout);
  }, [onIdle, onActive, timeout]);

  useEffect(() => {
    // Events that count as "user activity"
    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'wheel'];

    // Attach all activity listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start the initial idle timer when the component mounts
    timerRef.current = setTimeout(onIdle, timeout);

    // Cleanup: remove all listeners and cancel timer on unmount
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleActivity, onIdle, timeout]);
}
