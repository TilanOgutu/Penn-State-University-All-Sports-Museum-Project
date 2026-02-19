// src/hooks/useAutoplay.js
// Custom React hook that automatically advances through timeline events
// when in "loop mode" (no user interaction).

import { useEffect, useRef } from 'react';

/**
 * useAutoplay
 * @param {boolean}  isPlaying   - Whether auto-advance is active
 * @param {Function} onAdvance   - Callback to advance to the next event
 * @param {number}   interval    - Milliseconds between advances (default: 4000)
 */
export function useAutoplay(isPlaying, onAdvance, interval = 4000) {
  // Store the interval ID so we can clear it when paused or unmounted
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      // Start the auto-advance interval
      intervalRef.current = setInterval(() => {
        onAdvance();
      }, interval);
    } else {
      // Stop the interval when not in loop mode
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onAdvance, interval]); // Re-run whenever these change
}
