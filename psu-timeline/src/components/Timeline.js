// src/components/Timeline.js
// Renders the horizontal scrubber bar at the bottom of the screen.
// Shows decade markers, event dots on the timeline, navigation arrows,
// and a progress bar for the auto-advance countdown.

import React, { useRef, useEffect } from 'react';
import { getSportConfig, DECADE_MARKERS } from '../utils/sportConfig';

/**
 * Timeline component
 * @param {Array}    events          - All timeline events (sorted by year)
 * @param {number}   activeIndex     - Index of the currently selected event
 * @param {Function} onSelectEvent   - Called with event index when user clicks a dot
 * @param {Function} onPrev          - Navigate to previous event
 * @param {Function} onNext          - Navigate to next event
 * @param {boolean}  isLooping       - Whether auto-loop is active
 * @param {number}   autoplayInterval - Milliseconds between auto-advances (for progress bar)
 */
export default function Timeline({
  events,
  activeIndex,
  onSelectEvent,
  onPrev,
  onNext,
  isLooping,
  autoplayInterval = 4000,
}) {
  // Reference to the scrollable timeline track, so we can auto-scroll to active dot
  const trackRef = useRef(null);
  // Reference to the active dot element so we can scroll it into view
  const activeDotRef = useRef(null);

  // Find the year range for calculating dot positions
  const minYear = events[0]?.year || 1880;
  const maxYear = events[events.length - 1]?.year || 2000;
  const yearSpan = maxYear - minYear;

  // Scroll the active dot into view whenever activeIndex changes
  useEffect(() => {
    if (activeDotRef.current && trackRef.current) {
      activeDotRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',   // center the active dot horizontally
      });
    }
  }, [activeIndex]);

  /**
   * Convert a year to a percentage position along the timeline track.
   * @param {number} year
   * @returns {string} CSS percentage string e.g. "34.5%"
   */
  function yearToPercent(year) {
    return `${((year - minYear) / yearSpan) * 100}%`;
  }

  return (
    <div style={styles.wrapper}>

      {/* Auto-advance progress bar — fills left to right, then resets */}
      {isLooping && (
        <div style={styles.progressTrack}>
          <div
            key={activeIndex} // Reset animation each time activeIndex changes
            style={{
              ...styles.progressBar,
              animation: `progressFill ${autoplayInterval}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Main timeline container */}
      <div style={styles.container}>

        {/* LEFT: Previous arrow button */}
        <button
          style={styles.navButton}
          onClick={onPrev}
          aria-label="Previous event"
        >
          <span style={styles.navArrow}>‹</span>
        </button>

        {/* CENTER: Scrollable timeline track */}
        <div style={styles.trackWrapper}>
          <div ref={trackRef} style={styles.track}>

            {/* The horizontal line the dots sit on */}
            <div style={styles.line} />

            {/* DECADE MARKERS — thin vertical ticks with year labels */}
            {DECADE_MARKERS.map(decade => (
              // Only render decades within our data range
              decade >= minYear && decade <= maxYear ? (
                <div
                  key={decade}
                  style={{ ...styles.decadeMark, left: yearToPercent(decade) }}
                >
                  <div style={styles.decadeTick} />
                  <span style={styles.decadeLabel}>{decade}</span>
                </div>
              ) : null
            ))}

            {/* EVENT DOTS — one per event, clickable */}
            {events.map((event, index) => {
              const { color, icon } = getSportConfig(event.sport);
              const isActive = index === activeIndex;

              return (
                <div
                  key={event.id}
                  // Attach ref only to the active dot for scroll-into-view
                  ref={isActive ? activeDotRef : null}
                  style={{
                    ...styles.dotWrapper,
                    left: yearToPercent(event.year),
                  }}
                  onClick={() => onSelectEvent(index)}
                  aria-label={`${event.year}: ${event.title}`}
                  role="button"
                  tabIndex={0}
                  // Keyboard support: Enter or Space to select
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectEvent(index);
                  }}
                >
                  {/* Outer ring that appears on active dot */}
                  {isActive && (
                    <span style={{ ...styles.pulseRing, borderColor: color }} />
                  )}

                  {/* The dot itself */}
                  <span
                    style={{
                      ...styles.dot,
                      background: isActive ? color : 'rgba(255,255,255,0.25)',
                      borderColor: isActive ? color : 'rgba(255,255,255,0.15)',
                      transform: isActive ? 'scale(1.5)' : 'scale(1)',
                      boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                    }}
                  />

                  {/* Sport icon label that appears above the dot */}
                  <span
                    style={{
                      ...styles.dotLabel,
                      opacity: isActive ? 1 : 0.4,
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                      fontSize: isActive ? '14px' : '11px',
                    }}
                  >
                    {icon}
                  </span>

                  {/* Year tooltip that shows on hover and for active dot */}
                  <span
                    style={{
                      ...styles.yearTooltip,
                      color: isActive ? color : 'rgba(255,255,255,0.5)',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {event.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Next arrow button */}
        <button
          style={styles.navButton}
          onClick={onNext}
          aria-label="Next event"
        >
          <span style={styles.navArrow}>›</span>
        </button>
      </div>

      {/* Bottom: Event counter e.g. "12 / 26" */}
      <div style={styles.counter}>
        <span style={styles.counterActive}>{activeIndex + 1}</span>
        <span style={styles.counterSep}>/</span>
        <span style={styles.counterTotal}>{events.length}</span>
        <span style={styles.counterLabel}>EVENTS</span>
      </div>
    </div>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const styles = {
  wrapper: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(0, 8, 25, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '10px',
  },

  // The progress bar track (full width container)
  progressTrack: {
    height: '2px',
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },

  // The animated fill bar
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: 'linear-gradient(to right, #C0974F, #e8c17a)',
    width: 0,                          // starts at 0, filled by animation
    borderRadius: '0 2px 2px 0',
  },

  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    height: '90px',
    gap: '8px',
  },

  // Left/right arrow navigation buttons
  navButton: {
    flexShrink: 0,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid rgba(192, 151, 79, 0.3)',
    background: 'rgba(192, 151, 79, 0.1)',
    color: '#C0974F',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    // Hover handled via inline mouseover/mouseout in a real app;
    // for simplicity we rely on CSS :hover pseudo-class
  },

  navArrow: {
    fontSize: '28px',
    lineHeight: 1,
    marginTop: '-2px',                // optical vertical centering
  },

  // The scrollable container for the timeline
  trackWrapper: {
    flex: 1,
    overflow: 'hidden',               // clips the track; scrolling handled programmatically
    position: 'relative',
  },

  // The actual scrollable inner track
  track: {
    position: 'relative',
    height: '90px',
    minWidth: '100%',
    overflowX: 'auto',                // allow horizontal scroll if needed
    overflowY: 'hidden',
  },

  // The horizontal line
  line: {
    position: 'absolute',
    top: '50%',
    left: '20px',
    right: '20px',
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2) 5%, rgba(255,255,255,0.2) 95%, transparent)',
    transform: 'translateY(-50%)',
  },

  // Container for each decade tick + label
  decadeMark: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',            // decade marks don't intercept clicks
  },

  decadeTick: {
    width: '1px',
    height: '12px',
    background: 'rgba(255,255,255,0.2)',
    marginBottom: '4px',
  },

  decadeLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '10px',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.05em',
  },

  // Wrapper for the clickable dot area (larger hit target)
  dotWrapper: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px',                   // extra click area around the dot
    gap: '3px',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },

  // Expanding ring animation on active dot
  pulseRing: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    animation: 'pulseRing 1.5s ease-out infinite',
    pointerEvents: 'none',
  },

  // The dot circle
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1,
  },

  // Sport emoji above the dot
  dotLabel: {
    fontSize: '11px',
    transition: 'all 0.3s ease',
    lineHeight: 1,
  },

  // Year number below the dot
  yearTooltip: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '9px',
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  // Bottom event counter (e.g. "12 / 26 EVENTS")
  counter: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '4px',
    paddingTop: '2px',
  },

  counterActive: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: '18px',
    color: '#C0974F',
    lineHeight: 1,
  },

  counterSep: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },

  counterTotal: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: '18px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1,
  },

  counterLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '10px',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: '0.15em',
    marginLeft: '4px',
  },
};
