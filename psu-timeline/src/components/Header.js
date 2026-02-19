// src/components/Header.js
// Displays the museum name, subtitle, and current mode indicator at the top.
// Also shows a "Touch to Explore" prompt when in auto-loop mode.

import React from 'react';

/**
 * Header component
 * @param {boolean} isLooping - Whether the timeline is in auto-loop mode
 */
export default function Header({ isLooping }) {
  return (
    <header style={styles.header}>
      {/* Left side: Museum branding */}
      <div style={styles.brandBlock}>
        {/* Small eyebrow text */}
        <p style={styles.eyebrow}>PENN STATE UNIVERSITY</p>

        {/* Main museum title using Playfair Display serif font */}
        <h1 style={styles.title}>
          All Sports Museum
        </h1>

        {/* Decorative gold underline beneath the title */}
        <div style={styles.titleUnderline} />

        {/* Subtitle */}
        <p style={styles.subtitle}>Athletic Heritage Timeline</p>
      </div>

      {/* Right side: Status indicator */}
      <div style={styles.statusBlock}>
        {isLooping ? (
          // Auto-loop mode — invite the visitor to interact
          <div style={styles.loopBadge}>
            <span style={styles.pulseDot} />
            <span style={styles.loopLabel}>LIVE TOUR</span>
          </div>
        ) : (
          // Interactive mode — show that the user is in control
          <div style={styles.interactiveBadge}>
            <span style={styles.interactiveIcon}>◈</span>
            <span style={styles.interactiveLabel}>INTERACTIVE</span>
          </div>
        )}

        {/* Touch-to-explore hint (only visible in loop mode) */}
        {isLooping && (
          <p style={styles.touchHint}>Touch anywhere to explore</p>
        )}
      </div>
    </header>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const styles = {
  header: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '28px 48px 0',            // top and side padding
  },

  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  eyebrow: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.25em',           // wide tracking for all-caps label
    color: 'rgba(192, 151, 79, 0.8)',  // muted gold
    textTransform: 'uppercase',
    marginBottom: '4px',
  },

  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(26px, 3.5vw, 44px)', // fluid size scales with screen width
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },

  titleUnderline: {
    width: '60px',
    height: '3px',
    background: 'linear-gradient(to right, #C0974F, rgba(192,151,79,0))',
    margin: '8px 0 6px',
    borderRadius: '2px',
  },

  subtitle: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.15em',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
  },

  statusBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },

  // Green-pulsing badge for auto-loop mode
  loopBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(91, 170, 104, 0.15)',
    border: '1px solid rgba(91, 170, 104, 0.3)',
    borderRadius: '20px',
    padding: '6px 14px',
  },

  // Animated green dot
  pulseDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#5baa68',
    boxShadow: '0 0 8px #5baa68',
    animation: 'shimmer 1.5s ease-in-out infinite', // keyframe in global.css
  },

  loopLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#5baa68',
  },

  // Blue badge for interactive/manual mode
  interactiveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(192, 151, 79, 0.12)',
    border: '1px solid rgba(192, 151, 79, 0.3)',
    borderRadius: '20px',
    padding: '6px 14px',
  },

  interactiveIcon: {
    fontSize: '12px',
    color: '#C0974F',
  },

  interactiveLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#C0974F',
  },

  touchHint: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.05em',
    animation: 'shimmer 3s ease-in-out infinite',
  },
};
