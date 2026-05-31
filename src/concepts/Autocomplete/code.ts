export const useDebounceCode = `import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes or the component unmounts
    // This is the core LLD concept of debouncing!
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`;

export const mockApiCode = `/**
 * Simulates a network API search call with cancelability via AbortSignal
 * @param query The search string
 * @param signal AbortSignal from AbortController
 * @param delay Simulated network latency in ms
 */
export const searchProductsMockApi = (
  query: string,
  signal?: AbortSignal,
  delay: number = 600
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // Check if already aborted before doing work
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timer = setTimeout(() => {
      const allItems = [
        'React state management',
        'React performance optimization',
        'Vite build configuration',
        'TypeScript utility types',
        'CSS grid systems',
        'Intersection Observer infinite scroll',
        'Low-level system design patterns',
        'Singleton pattern toast manager',
        'Drag and drop kanban columns',
        'Recursive directory folder structure',
        'Debounce vs Throttle functions',
        'Keyboard accessibility guidelines',
        'Glassmorphic layout styles'
      ];

      const filtered = allItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );

      resolve(filtered);
    }, delay);

    // Listen to abort signals to cancel the query
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
};`;

export const autocompleteComponentCode = `import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { searchProductsMockApi } from './mockApi';

export const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, string[]>>({});
  const [logs, setLogs] = useState<string[]>([]);
  
  const debouncedQuery = useDebounce(query, 400);
  const activeRequestRef = useRef<AbortController | null>(null);

  // Core LLD state machine & side effects
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // 1. Check local cache (Design pattern: Flyweight / Cache)
    if (cache[debouncedQuery]) {
      setResults(cache[debouncedQuery]);
      log(\`Cache HIT for query: "\${debouncedQuery}"\`);
      return;
    }

    // 2. Abort any previous active request (Request Cancellation pattern)
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      log(\`ABORTED previous request for query\`);
    }

    // 3. Spawn a new AbortController
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setLoading(true);
    log(\`INITIATED API request for query: "\${debouncedQuery}"\`);

    searchProductsMockApi(debouncedQuery, controller.signal)
      .then((data) => {
        // Update local cache
        setCache(prev => ({ ...prev, [debouncedQuery]: data }));
        setResults(data);
        log(\`SUCCESS fetched results for: "\${debouncedQuery}"\`);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          log(\`CATCH: Request aborted successfully\`);
        } else {
          log(\`ERROR: Failed to fetch\`);
        }
      })
      .finally(() => {
        // Only clear loading state if this is the active controller
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const log = (msg: string) => {
    setLogs(prev => [\`[\${new Date().toLocaleTimeString()}] \${msg}\`, ...prev].slice(0, 10));
  };

  return (
    <div className="autocomplete-widget">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Type to search..." 
      />
      {loading && <div className="spinner" />}
      <ul className="results">
        {results.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
};`;
