import { useEffect, useRef } from 'react';

export default function useIntersectionObserver(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
}
