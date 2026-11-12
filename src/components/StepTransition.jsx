import React, { useEffect, useState, useRef } from 'react';

/**
 * StepTransition component
 * Provides directional forward/backward sliding animations with smooth cubic-bezier easing,
 * subtle opacity, and slight scale change.
 * Prevents overlapping steps and layout jumps.
 */
export default function StepTransition({ stepKey, direction = 'forward', children, className = '' }) {
  const [animClass, setAnimClass] = useState('step-transition-forward');
  const prevKeyRef = useRef(stepKey);

  useEffect(() => {
    if (prevKeyRef.current !== stepKey) {
      if (direction === 'forward') {
        setAnimClass('step-transition-forward');
      } else if (direction === 'backward') {
        setAnimClass('step-transition-backward');
      } else {
        setAnimClass('step-transition-fade');
      }
      prevKeyRef.current = stepKey;
    }
  }, [stepKey, direction]);

  return (
    <div 
      key={stepKey} 
      className={`w-full min-h-0 flex-1 flex flex-col justify-center ${animClass} ${className}`}
    >
      {children}
    </div>
  );
}
