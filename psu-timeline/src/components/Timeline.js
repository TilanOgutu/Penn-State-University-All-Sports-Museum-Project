// src/components/Timeline.js

import React, { useRef, useEffect, useState } from 'react';
import { getSportConfig } from '../utils/sportConfig';

export default function Timeline({ events, onSelectEvent, isLooping }) {
  const trackRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const minYear = events[0]?.year || 1880;
  const maxYear = events[events.length - 1]?.year || 2020;
  const span = maxYear - minYear;

  const yearToPercent = (year) =>
    ((year - minYear) / span) * 100;

  // AUTO SCROLL LOOP
  useEffect(() => {
    if (!isLooping || !trackRef.current) return;

    let raf;

    const scroll = () => {
      trackRef.current.scrollLeft += 0.3;
      raf = requestAnimationFrame(scroll);
    };

    raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, [isLooping]);

  // CLICK TO ZOOM
  const handleZoom = () => {
    setZoom(prev => (prev >= 2.5 ? 1 : prev + 0.5));
  };

  return (
    <div style={styles.wrapper} onClick={handleZoom}>
      <div ref={trackRef} style={styles.trackWrapper}>
        <div
          style={{
            ...styles.track,
            transform: `scale(${zoom})`,
          }}
        >
          <div style={styles.line} />

          {events.map((event) => {
            const { color, icon } = getSportConfig(event.sport);

            return (
              <div
                key={event.id}
                style={{
                  ...styles.dotWrapper,
                  left: `${yearToPercent(event.year)}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(event);
                }}
              >
                <div
                  style={{
                    ...styles.dot,
                    background: color,
                  }}
                />
                <span style={styles.icon}>{icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '240px',
    transform: 'translateY(-50%)',
    zIndex: 10,
  },
  trackWrapper: {
    overflowX: 'auto',
    height: '100%',
    cursor: 'grab',
  },
  track: {
    position: 'relative',
    height: '100%',
    minWidth: '300%',
    transition: 'transform 0.3s ease',
  },
  line: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '3px',
    background: 'rgba(255,255,255,0.3)',
  },
  dotWrapper: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
  },
  icon: {
    fontSize: '14px',
    marginTop: '4px',
  },
};