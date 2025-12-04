import { useEffect, useState, useRef } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { rootMargin: '100px', ...options } // Load 100px before visible
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [options]);

    return { targetRef, isIntersecting };
}
