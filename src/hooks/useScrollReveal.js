import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for scroll-reveal animations using IntersectionObserver.
 * @param {Object} options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - Only trigger once (default true)
 * @returns {{ ref: React.RefCallback, isVisible: boolean }}
 */
export default function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);
  const elementRef = useRef(null);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Use callback ref so we get notified when the DOM node is set
  const ref = useCallback((node) => {
    // Cleanup previous observer
    cleanup();
    elementRef.current = node;

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(node);
  }, [threshold, rootMargin, triggerOnce, cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { ref, isVisible };
}
