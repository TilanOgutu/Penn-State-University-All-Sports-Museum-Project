// src/App.js
// ============================================================
// ROOT APPLICATION COMPONENT
// This is the top-level component that orchestrates everything:
//   - Loads the timeline data from the JSON file
//   - Manages which event is currently "active"
//   - Controls auto-loop vs interactive mode
//   - Tracks inactivity to return to loop mode
//   - Renders all child components
// ============================================================

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import Background   from './components/Background';
import Header       from './components/Header';
import EventCard    from './components/EventCard';
import Timeline     from './components/Timeline';
import DetailModal  from './components/DetailModal';

import { useInactivity } from './hooks/useInactivity';
import { useAutoplay }   from './hooks/useAutoplay';

// ── Constants ────────────────────────────────────────────────
// How long each event displays in auto-loop mode (ms)
const AUTOPLAY_INTERVAL = 4500;

// How long until inactivity triggers a return to loop mode (ms)
const INACTIVITY_TIMEOUT = 14000;

// ── Main App Component ───────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────

  // All timeline events loaded from JSON (sorted by year)
  const [events, setEvents] = useState([]);

  // Index into the events array of the currently shown event
  const [activeIndex, setActiveIndex] = useState(0);

  // Whether the app is in auto-loop mode (no user interaction)
  const [isLooping, setIsLooping] = useState(true);

  // The event currently shown in the detail modal (null = modal closed)
  const [modalEvent, setModalEvent] = useState(null);

  // Whether data is still loading
  const [isLoading, setIsLoading] = useState(true);

  // ── Data Loading ───────────────────────────────────────────
  useEffect(() => {
    // Fetch timeline data from the public folder
    // To add more events: edit /public/data/timeline.json
    fetch('/data/timeline.json')
      .then(res => res.json())
      .then(data => {
        // Sort events chronologically by year
        const sorted = [...data].sort((a, b) => a.year - b.year);
        setEvents(sorted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load timeline data:', err);
        setIsLoading(false);
      });
  }, []); // Empty array = run only once on mount

  // ── Auto-Loop Advance ──────────────────────────────────────
  // Wrapped in useCallback so the reference is stable for the hook
  const advanceToNext = useCallback(() => {
    setActiveIndex(prev => {
      // Wrap around to start when reaching the last event
      return prev >= events.length - 1 ? 0 : prev + 1;
    });
  }, [events.length]);

  // Start auto-play when in loop mode; stop it otherwise
  useAutoplay(isLooping && !modalEvent, advanceToNext, AUTOPLAY_INTERVAL);

  // ── Inactivity Detection ───────────────────────────────────
  // When user goes idle: return to loop mode
  const handleIdle = useCallback(() => {
    setModalEvent(null);  // close any open modal
    setIsLooping(true);
  }, []);

  // When user is active: stop loop mode
  const handleActive = useCallback(() => {
    // Only stop looping if a user interaction actually happened
    // (not just mouse movement — we check this in useInactivity)
  }, []);

  // Attach the inactivity detection hook
  useInactivity(handleIdle, handleActive, INACTIVITY_TIMEOUT);

  // ── Navigation Handlers ────────────────────────────────────

  // When user selects an event from the timeline dots
  const handleSelectEvent = useCallback((index) => {
    setIsLooping(false);              // stop auto-loop
    setActiveIndex(index);
    setModalEvent(null);              // close modal if switching events
  }, []);

  // Navigate to the previous event
  const handlePrev = useCallback(() => {
    setIsLooping(false);
    setActiveIndex(prev => (prev <= 0 ? events.length - 1 : prev - 1));
  }, [events.length]);

  // Navigate to the next event
  const handleNext = useCallback(() => {
    setIsLooping(false);
    setActiveIndex(prev => (prev >= events.length - 1 ? 0 : prev + 1));
  }, [events.length]);

  // When user clicks the main event card — open detail modal
  const handleCardClick = useCallback(() => {
    setIsLooping(false);
    if (events[activeIndex]) {
      setModalEvent(events[activeIndex]);
    }
  }, [events, activeIndex]);

  // Close the detail modal
  const handleModalClose = useCallback(() => {
    setModalEvent(null);
    // Inactivity timer will restart loop mode after INACTIVITY_TIMEOUT
  }, []);

  // The current active event object
  const activeEvent = useMemo(() => events[activeIndex], [events, activeIndex]);

  // ── Keyboard Navigation ────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (modalEvent) return; // modal handles its own keyboard events
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft')  handlePrev();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, modalEvent]);

  // ── Loading Screen ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={loadingStyles.screen}>
        <Background />
        <div style={loadingStyles.content}>
          <p style={loadingStyles.eyebrow}>PENN STATE UNIVERSITY</p>
          <h1 style={loadingStyles.title}>All Sports Museum</h1>
          <div style={loadingStyles.spinner} />
          <p style={loadingStyles.label}>Loading Timeline...</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    // Outer shell: full-screen flex column layout
    <div style={appStyles.shell}>

      {/* 1. Animated background (z-index: 0) */}
      <Background />

      {/* 2. Top header with museum branding */}
      <Header isLooping={isLooping} />

      {/* 3. Center: clickable event card */}
      <div style={appStyles.cardArea} onClick={handleCardClick}>
        <EventCard event={activeEvent} isLooping={isLooping} />

        {/* "Click for more" hint shown in non-loop mode */}
        {!isLooping && (
          <p style={appStyles.clickHint}>
            🔍 Click card for full details
          </p>
        )}
      </div>

      {/* 4. Bottom: timeline scrubber bar */}
      <Timeline
        events={events}
        activeIndex={activeIndex}
        onSelectEvent={handleSelectEvent}
        onPrev={handlePrev}
        onNext={handleNext}
        isLooping={isLooping}
        autoplayInterval={AUTOPLAY_INTERVAL}
      />

      {/* 5. Detail modal (conditionally rendered) */}
      {modalEvent && (
        <DetailModal event={modalEvent} onClose={handleModalClose} />
      )}
    </div>
  );
}

/* ============================================================
   App-level styles
   ============================================================ */
const appStyles = {
  // Full-screen flex column — header | card area | timeline
  shell: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },

  // The center region that expands to fill remaining space
  cardArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',                // indicate card is clickable
    position: 'relative',
  },

  // Small hint below the card
  clickHint: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.05em',
    position: 'absolute',
    bottom: '10px',
    animation: 'shimmer 3s ease-in-out infinite',
  },
};

/* Loading screen styles */
const loadingStyles = {
  screen: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
  },

  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },

  eyebrow: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '12px',
    letterSpacing: '0.3em',
    color: 'rgba(192,151,79,0.7)',
    textTransform: 'uppercase',
  },

  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '40px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '30px',
  },

  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid rgba(192,151,79,0.2)',
    borderTop: '3px solid #C0974F',
    animation: 'spin 0.8s linear infinite',
  },

  label: {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.1em',
    marginTop: '10px',
  },
};
