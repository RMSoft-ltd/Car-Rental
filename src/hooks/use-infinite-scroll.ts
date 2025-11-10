import { useEffect, useState, useRef } from "react";

interface UseInfiniteScrollProps<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[];
  observerTarget: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for implementing infinite scroll with intersection observer
 * Replaces multiple useEffect patterns with a single, reusable hook
 */
export function useInfiniteScroll<T>({
  items,
  isLoading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Update displayed items when source items change
  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return { displayedItems, observerTarget };
}
