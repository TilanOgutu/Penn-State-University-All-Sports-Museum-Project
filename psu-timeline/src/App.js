// src/App.js

import React, { useState, useEffect, useCallback } from 'react';

import Background from './components/Background';
import Header from './components/Header';
import Timeline from './components/Timeline';
import DetailModal from './components/DetailModal';

import { useInactivity } from './hooks/useInactivity';

const INACTIVITY_TIMEOUT = 14000;

export default function App() {
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isLooping, setIsLooping] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/timeline.json')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => a.year - b.year);
        setEvents(sorted);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleIdle = useCallback(() => {
    setActiveEvent(null);
    setIsLooping(true);
  }, []);

  const handleActive = useCallback(() => {
    setIsLooping(false);
  }, []);

  useInactivity(handleIdle, handleActive, INACTIVITY_TIMEOUT);

  const handleSelectEvent = useCallback((event) => {
    setIsLooping(false);
    setActiveEvent(event);
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveEvent(null);
  }, []);

  if (isLoading) {
    return (
      <div style={loadingStyles.screen}>
        <Background />
        <div style={loadingStyles.content}>
          <h1 style={loadingStyles.title}>All Sports Museum</h1>
          <div style={loadingStyles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <Background />
      <Header isLooping={isLooping} />

      {/* CENTERPIECE TIMELINE */}
      <Timeline
        events={events}
        onSelectEvent={handleSelectEvent}
        isLooping={isLooping}
      />

      {/* MODAL */}
      {activeEvent && (
        <DetailModal event={activeEvent} onClose={handleModalClose} />
      )}
    </div>
  );
}

const styles = {
  shell: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
};

const loadingStyles = {
  screen: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    textAlign: 'center',
  },
  title: {
    color: 'white',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.2)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};