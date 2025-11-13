import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";

export interface UseSearchOptions<T> {
  /** The search function to execute with the debounced search term */
  searchFn: (searchTerm: string) => Promise<T> | T;
  /** Debounce delay in milliseconds (default: 500ms) */
  debounceDelay?: number;
  /** Initial search term (default: empty string) */
  initialSearchTerm?: string;
  /** Minimum characters before triggering search (default: 0) */
  minSearchLength?: number;
  /** Callback when search starts */
  onSearchStart?: () => void;
  /** Callback when search completes successfully */
  onSearchSuccess?: (results: T) => void;
  /** Callback when search fails */
  onSearchError?: (error: Error) => void;
}

export interface UseSearchReturn<T> {
  /** Current search term (unDebounced) */
  searchTerm: string;
  /** Set the search term */
  setSearchTerm: (term: string) => void;
  /** Debounced search term */
  debouncedSearchTerm: string;
  /** Search results */
  results: T | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Manually trigger search */
  triggerSearch: () => void;
  /** Clear search and results */
  clearSearch: () => void;
}

/**
 * A sophisticated search hook that combines debouncing with search execution
 *
 * This hook provides a complete search solution with:
 * - Automatic debouncing of search input
 * - Loading and error states
 * - Minimum search length validation
 * - Manual search triggering
 * - Lifecycle callbacks
 *
 * @example
 * ```tsx
 * const {
 *   searchTerm,
 *   setSearchTerm,
 *   results,
 *   isLoading
 * } = useSearch({
 *   searchFn: async (term) => {
 *     const response = await fetch(`/api/search?q=${term}`);
 *     return response.json();
 *   },
 *   debounceDelay: 500,
 *   minSearchLength: 2,
 * });
 *
 * return (
 *   <div>
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *     {isLoading && <p>Searching...</p>}
 *     {results && <ResultsList data={results} />}
 *   </div>
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSearch<T = any>({
  searchFn,
  debounceDelay = 500,
  initialSearchTerm = "",
  minSearchLength = 0,
  onSearchStart,
  onSearchSuccess,
  onSearchError,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [results, setResults] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Execute search function
  const executeSearch = useCallback(
    async (term: string) => {
      // Skip if below minimum length
      if (term.length < minSearchLength) {
        setResults(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      onSearchStart?.();

      try {
        const searchResults = await Promise.resolve(searchFn(term));
        setResults(searchResults);
        onSearchSuccess?.(searchResults);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Search failed");
        setError(error);
        onSearchError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchFn, minSearchLength, onSearchStart, onSearchSuccess, onSearchError]
  );

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm || debouncedSearchTerm === "") {
      executeSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, executeSearch]);

  // Manual search trigger
  const triggerSearch = useCallback(() => {
    executeSearch(searchTerm);
  }, [executeSearch, searchTerm]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setResults(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    results,
    isLoading,
    error,
    triggerSearch,
    clearSearch,
  };
}
