// src/components/DetailModal.js
// Full-screen modal overlay that shows expanded event details
// when a user clicks/taps an event dot on the timeline.
// Closes on backdrop click, Escape key, or Close button.

import React, { useEffect } from 'react';
import { getSportConfig } from '../utils/sportConfig';

/**
 * DetailModal
 * @param {Object}   event     - The event object to display in detail
 * @param {Function} onClose   - Called when the modal should be dismissed
 */
export default function DetailModal({ event, onClose }) {
  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const { color, icon } = getSportConfig(event.sport);
  const hasImage = event.image && event.image !== 'image.jpg' && event.image !== null;

  // Prevent click events inside the modal from bubbling up to the backdrop
  function handleModalClick(e) {
    e.stopPropagation();
  }

  return (
    // Backdrop: clicking it closes the modal
    <div style={styles.backdrop} onClick={onClose}>

      {/* Modal panel: clicking inside does NOT close the modal */}
      <div style={styles.modal} onClick={handleModalClick}>

        {/* Decorative colored stripe at top */}
        <div style={{ ...styles.topBar, background: `linear-gradient(to right, ${color}, transparent)` }} />

        {/* Close button (top right corner) */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <span style={styles.closeBtnX}>✕</span>
        </button>

        {/* CONTENT LAYOUT */}
        <div style={styles.content}>

          {/* Left column: all text information */}
          <div style={styles.leftCol}>

            {/* Sport badge */}
            <div style={styles.sportRow}>
              <span style={styles.bigIcon}>{icon}</span>
              <div>
                <span style={{ ...styles.sportTag, color, borderColor: color }}>
                  {event.sport.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Giant year display */}
            <div style={styles.yearDisplay}>
              <span style={styles.yearGhost}>{event.year}</span>
            </div>

            {/* Event title */}
            <h2 style={styles.title}>{event.title}</h2>

            {/* Colored divider */}
            <div style={{ ...styles.divider, background: `linear-gradient(to right, ${color}, rgba(255,255,255,0.1))` }} />

            {/* Full description */}
            <p style={styles.description}>{event.description}</p>

            {/* Metadata row (sport + year in pill form) */}
            <div style={styles.metaRow}>
              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>SPORT</span>
                <span style={styles.metaValue}>{event.sport}</span>
              </div>
              <div style={styles.metaDivider} />
              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>YEAR</span>
                <span style={{ ...styles.metaValue, color }}>{event.year}</span>
              </div>
            </div>
          </div>

          {/* Right column: image (if available) */}
          {hasImage && (
            <div style={styles.rightCol}>
              <div style={{ ...styles.imageFrame, borderColor: color }}>
                <img
                  src={event.image}
                  alt={event.title}
                  style={styles.image}
                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                />
                {/* Bottom gradient overlay on image */}
                <div style={styles.imageOverlay} />
                {/* Year watermark on image */}
                <span style={{ ...styles.imageYear, color }}>{event.year}</span>
              </div>
            </div>
          )}

          {/* If no image: show a decorative year panel instead */}
          {!hasImage && (
            <div style={styles.noImagePanel}>
              <div style={{ ...styles.yearCircle, borderColor: color }}>
                <span style={{ ...styles.yearCircleText, color }}>{event.year}</span>
              </div>
              <span style={styles.noImageIcon}>{icon}</span>
            </div>
          )}
        </div>

        {/* Bottom instruction */}
        <p style={styles.closeHint}>Press ESC or click outside to close</p>
      </div>
    </div>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const styles = {
  // Full-screen semi-transparent backdrop
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 5, 20, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 100,                          // on top of everything else
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease both',  // keyframe in global.css
    padding: '40px',
  },

  // The modal panel itself
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: '820px',
    maxHeight: '80vh',
    background: 'linear-gradient(145deg, #001a3d, #000f25)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: `
      0 0 0 1px rgba(255,255,255,0.05),
      0 40px 80px rgba(0,0,0,0.7),
      0 10px 30px rgba(0,0,0,0.5)
    `,
    animation: 'fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both',
  },

  topBar: {
    height: '4px',
    width: '100%',
  },

  // Close button in top-right corner
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.2s ease',
  },

  closeBtnX: {
    fontSize: '14px',
    lineHeight: 1,
  },

  content: {
    display: 'flex',
    gap: '40px',
    padding: '32px 40px',
    alignItems: 'flex-start',
    overflowY: 'auto',               // allow scrolling within modal if content is tall
    maxHeight: 'calc(80vh - 80px)',  // account for topBar + hint height
  },

  leftCol: {
    flex: 1,
    minWidth: 0,
  },

  sportRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },

  bigIcon: {
    fontSize: '36px',
    lineHeight: 1,
  },

  sportTag: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    padding: '4px 12px',
    border: '1px solid',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)',
  },

  // Ghost year display — large faint number behind title
  yearDisplay: {
    overflow: 'hidden',
    marginBottom: '-16px',           // pulls title up into the ghost year
  },

  yearGhost: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: 'clamp(80px, 12vw, 140px)',
    color: 'rgba(255,255,255,0.06)',
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    display: 'block',
  },

  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(22px, 3vw, 34px)',
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1.2,
    position: 'relative',
    zIndex: 1,
    marginBottom: '16px',
  },

  divider: {
    height: '2px',
    width: '100px',
    borderRadius: '1px',
    marginBottom: '18px',
  },

  description: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: 'clamp(14px, 1.6vw, 17px)',
    fontWeight: 300,
    lineHeight: 1.75,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '28px',
  },

  // Metadata pills row (Sport | Year)
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '14px 20px',
    width: 'fit-content',
  },

  metaPill: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    padding: '0 16px',
  },

  metaDivider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255,255,255,0.1)',
  },

  metaLabel: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },

  metaValue: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '15px',
    fontWeight: 600,
    color: '#FFFFFF',
  },

  // Right column with image
  rightCol: {
    flexShrink: 0,
    width: '240px',
  },

  imageFrame: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid',
    boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
    aspectRatio: '3 / 4',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,10,30,0.7) 0%, transparent 50%)',
    pointerEvents: 'none',
  },

  // Year watermark on bottom-left of the image
  imageYear: {
    position: 'absolute',
    bottom: '12px',
    left: '14px',
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: '28px',
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
  },

  // Decorative panel shown when no image is available
  noImagePanel: {
    flexShrink: 0,
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.07)',
    minHeight: '200px',
  },

  yearCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
  },

  yearCircleText: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: '32px',
    lineHeight: 1,
  },

  noImageIcon: {
    fontSize: '40px',
  },

  closeHint: {
    textAlign: 'center',
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '11px',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.05em',
    padding: '10px 0 14px',
  },
};
