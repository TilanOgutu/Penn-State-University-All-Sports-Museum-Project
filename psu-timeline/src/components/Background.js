// src/components/Background.js
// Renders the full-screen animated background.
// Creates depth with layered gradients and a subtle animated grid pattern.
// No props required — purely decorative.

import React from 'react';

export default function Background() {
  return (
    <div style={styles.root}>
      {/* Deep navy base gradient */}
      <div style={styles.baseLayer} />

      {/* Animated diagonal light sweep */}
      <div style={styles.sweepLayer} />

      {/* Subtle dot grid texture */}
      <div style={styles.gridLayer} />

      {/* Bottom vignette to blend into the timeline bar */}
      <div style={styles.bottomVignette} />

      {/* Top vignette for depth */}
      <div style={styles.topVignette} />

      {/* Decorative gold accent lines — left side */}
      <div style={{ ...styles.accentLine, left: '6%' }} />
      <div style={{ ...styles.accentLine, left: '6.3%', opacity: 0.3 }} />

      {/* Decorative gold accent lines — right side */}
      <div style={{ ...styles.accentLine, right: '6%', left: 'auto' }} />
      <div style={{ ...styles.accentLine, right: '6.3%', left: 'auto', opacity: 0.3 }} />
    </div>
  );
}

/* ============================================================
   Inline styles — kept here for co-location with component
   ============================================================ */
const styles = {
  root: {
    position: 'fixed',
    inset: 0,                       // shorthand for top/right/bottom/left: 0
    zIndex: 0,                      // behind all other content
    pointerEvents: 'none',          // never captures mouse events
  },

  // Rich dark navy-to-midnight gradient
  baseLayer: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse at 20% 20%, #002a5e 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, #001535 0%, transparent 50%),
      linear-gradient(160deg, #001228 0%, #000d1e 40%, #001535 100%)
    `,
  },

  // Slow-moving diagonal light sweep using CSS animation
  sweepLayer: {
    position: 'absolute',
    inset: 0,
    background: `
      linear-gradient(
        105deg,
        transparent 30%,
        rgba(192, 151, 79, 0.03) 50%,
        transparent 70%
      )
    `,
    backgroundSize: '200% 200%',
    animation: 'slowPan 20s ease infinite', // keyframe defined in global.css
  },

  // Subtle dot pattern for texture (SVG data URI)
  gridLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',       // spacing between dots
    opacity: 0.5,
  },

  // Fades the bottom into the timeline bar
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    background: 'linear-gradient(to bottom, transparent, rgba(0, 10, 25, 0.95))',
  },

  // Subtle top shadow for depth
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    background: 'linear-gradient(to top, transparent, rgba(0, 5, 15, 0.6))',
  },

  // Thin vertical gold lines as decorative framing elements
  accentLine: {
    position: 'absolute',
    top: '10%',
    bottom: '140px',                // stops above the timeline bar
    width: '1px',
    background: 'linear-gradient(to bottom, transparent, rgba(192, 151, 79, 0.5), transparent)',
  },
};
