// src/components/EventCard.js
// The large central card that displays the details of the currently selected event.
// Animates in each time the active event changes.
// Shows sport icon, year, title, description, and image (if available).

import React, { useEffect, useRef } from 'react';
import { getSportConfig } from '../utils/sportConfig';

/**
 * EventCard
 * @param {Object}  event      - The timeline event object to display
 * @param {boolean} isLooping  - Whether we're in auto-loop mode (affects subtitle)
 */
export default function EventCard({ event, isLooping }) {
  // Reference to the card DOM element so we can restart the animation
  const cardRef = useRef(null);

  // Every time the event changes, re-trigger the entrance animation
  // by removing and re-adding the animation class trick
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Force a reflow to restart the CSS animation from the beginning
    card.style.animation = 'none';
    void card.offsetHeight; // void operator suppresses ESLint warning; this triggers a DOM reflow to restart the CSS animation
    card.style.animation = '';
  }, [event?.id]); // Only re-run when the event id changes

  if (!event) return null;

  // Get the sport's color and icon from our config
  const { color, icon } = getSportConfig(event.sport);

  // Check if this event has a real image (not null/placeholder)
  const hasImage = event.image && event.image !== 'image.jpg' && event.image !== null;

  return (
    <div style={styles.container}>
      {/* The card itself — animates in from below */}
      <div ref={cardRef} style={{ ...styles.card, '--sport-color': color }}>

        {/* Top decorative bar using sport color */}
        <div style={{ ...styles.sportBar, background: color }} />

        {/* Content layout: text left, image right (if available) */}
        <div style={styles.contentRow}>

          {/* LEFT COLUMN: Text content */}
          <div style={styles.textColumn}>

            {/* Sport badge row */}
            <div style={styles.badgeRow}>
              {/* Sport icon */}
              <span style={styles.sportIcon}>{icon}</span>

              {/* Sport name badge */}
              <span style={{ ...styles.sportBadge, borderColor: color, color: color }}>
                {event.sport.toUpperCase()}
              </span>

              {/* Divider dot */}
              <span style={styles.dividerDot}>·</span>

              {/* Year shown in small label next to badge */}
              <span style={styles.yearBadge}>{event.year}</span>
            </div>

            {/* Large year display — the visual anchor of the card */}
            <div style={styles.bigYear}>{event.year}</div>

            {/* Event title */}
            <h2 style={styles.eventTitle}>{event.title}</h2>

            {/* Thin gold divider line */}
            <div style={{ ...styles.divider, background: `linear-gradient(to right, ${color}, transparent)` }} />

            {/* Event description */}
            <p style={styles.description}>{event.description}</p>

            {/* Bottom instruction text (changes based on mode) */}
            <p style={styles.hint}>
              {isLooping
                ? '← Touch the timeline below to explore →'
                : '← Use arrow buttons to navigate →'}
            </p>
          </div>

          {/* RIGHT COLUMN: Image (only renders if we have a valid image URL) */}
          {hasImage && (
            <div style={styles.imageColumn}>
              <div style={{ ...styles.imageFrame, borderColor: color }}>
                <img
                  src={event.image}
                  alt={event.title}
                  style={styles.image}
                  // Graceful fallback: hide image if it fails to load
                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                />
                {/* Subtle overlay gradient on image for polish */}
                <div style={styles.imageOverlay} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const styles = {
  container: {
    // Positioned in the center of the screen above the timeline bar
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '16px 48px',
  },

  card: {
    // The card uses a glassy dark surface
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    background: 'rgba(0, 20, 50, 0.75)',
    backdropFilter: 'blur(20px)',          // frosted glass effect
    WebkitBackdropFilter: 'blur(20px)',    // Safari prefix
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.05),
      0 24px 60px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(0, 0, 0, 0.3)
    `,
    // Entrance animation — defined in global.css
    animation: 'fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
  },

  // Thin colored bar at the very top of the card
  sportBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
  },

  contentRow: {
    display: 'flex',
    gap: '32px',
    padding: '32px 36px',
    alignItems: 'flex-start',
  },

  textColumn: {
    flex: 1,
    minWidth: 0, // allows text to truncate properly in flex
  },

  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },

  sportIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },

  sportBadge: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    padding: '3px 10px',
    border: '1px solid',             // color set inline via sport config
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)',
  },

  dividerDot: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '16px',
  },

  yearBadge: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.1em',
  },

  // Large background year number — decorative anchor element
  bigYear: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: 'clamp(64px, 10vw, 110px)',
    lineHeight: 0.85,
    color: 'rgba(255, 255, 255, 0.08)',  // very faint — background decoration
    letterSpacing: '-0.02em',
    marginBottom: '-10px',               // pulls title up into the number
    pointerEvents: 'none',
  },

  eventTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(20px, 2.5vw, 30px)',
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1.2,
    marginBottom: '14px',
    position: 'relative',               // sits on top of bigYear
    zIndex: 1,
  },

  divider: {
    height: '2px',
    borderRadius: '1px',
    marginBottom: '14px',
    width: '120px',
  },

  description: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: 'clamp(13px, 1.5vw, 16px)',
    fontWeight: 300,
    lineHeight: 1.65,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: '20px',
    maxWidth: '520px',
  },

  hint: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.25)',
    letterSpacing: '0.05em',
    animation: 'shimmer 3s ease-in-out infinite',
  },

  imageColumn: {
    flexShrink: 0,                      // image column doesn't shrink
    width: '220px',
  },

  imageFrame: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid',               // color set inline
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    aspectRatio: '3 / 4',              // portrait-ish photo frame
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',                // crop to fill the frame
    display: 'block',
  },

  // Subtle gradient overlay on image bottom
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,10,30,0.5) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
};
