import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { customLogger } from 'configs/logger';

export interface PerformanceConfig {
  debounceMs?: number;
  throttleMs?: number;
  maxRecalculations?: number;
  enableLogging?: boolean;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private recalculationCounts: Map<string, number> = new Map();
  private lastCalculationTimes: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Debounces a function to prevent excessive calls
   */
  public debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    context: string = 'unknown'
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        this.trackCalculation(context);
        func(...args);
      }, delay);
    };
  }

  /**
   * Throttles a function to limit execution frequency
   */
  public throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    context: string = 'unknown'
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        this.trackCalculation(context);
        func(...args);
      }
    };
  }

  /**
   * Tracks calculation frequency to identify performance issues
   */
  private trackCalculation(context: string): void {
    const count = this.recalculationCounts.get(context) || 0;
    this.recalculationCounts.set(context, count + 1);

    const now = Date.now();
    const lastTime = this.lastCalculationTimes.get(context) || 0;
    this.lastCalculationTimes.set(context, now);

    if (count > 100 && now - lastTime < 1000) {
      customLogger.warn(
        `High recalculation frequency detected for ${context}: ${count} times`
      );
    }
  }

  /**
   * Creates a memoized callback that prevents unnecessary re-renders
   */
  public createStableCallback<T extends (...args: any[]) => any>(
    callback: T,
    dependencies: any[] = [],
    context: string = 'unknown'
  ): T {
    return useCallback(callback, dependencies) as T;
  }

  /**
   * Creates a memoized value that only updates when dependencies change
   */
  public createStableValue<T>(
    factory: () => T,
    dependencies: any[] = [],
    context: string = 'unknown'
  ): T {
    return useMemo(factory, dependencies);
  }

  /**
   * Prevents excessive re-renders by tracking component updates
   */
  public useRenderTracker(componentName: string, props: any[] = []): void {
    const renderCount = useRef(0);
    const lastProps = useRef<any[]>([]);

    useEffect(() => {
      renderCount.current += 1;

      if (renderCount.current > 50) {
        customLogger.warn(
          `Component ${componentName} has rendered ${renderCount.current} times`
        );
      }

      // Check if props have actually changed
      const propsChanged = props.some(
        (prop, index) => prop !== lastProps.current[index]
      );
      if (!propsChanged && renderCount.current > 10) {
        customLogger.warn(
          `Component ${componentName} re-rendering without prop changes`
        );
      }

      lastProps.current = [...props];
    });
  }

  /**
   * Optimizes expensive calculations with caching
   */
  public useOptimizedCalculation<T>(
    calculation: () => T,
    dependencies: any[] = [],
    cacheKey?: string
  ): T {
    const cache = useRef<Map<string, { value: T; deps: any[] }>>(new Map());

    return useMemo(() => {
      const key = cacheKey || JSON.stringify(dependencies);
      const cached = cache.current.get(key);

      if (cached && this.arraysEqual(cached.deps, dependencies)) {
        return cached.value;
      }

      const result = calculation();
      cache.current.set(key, { value: result, deps: [...dependencies] });

      return result;
    }, dependencies);
  }

  /**
   * Compares arrays for equality
   */
  private arraysEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  /**
   * Creates a stable reference for objects to prevent unnecessary re-renders
   */
  public useStableObject<T extends object>(obj: T, deps: any[] = []): T {
    return useMemo(() => obj, deps);
  }

  /**
   * Optimizes list rendering with virtualization hints
   */
  public useListOptimization<T>(
    items: T[],
    keyExtractor: (item: T, index: number) => string | number,
    chunkSize: number = 50
  ): {
    visibleItems: T[];
    totalCount: number;
    loadMore: () => void;
  } {
    const [visibleCount, setVisibleCount] = useState(chunkSize);

    const visibleItems = useMemo(() => {
      return items.slice(0, visibleCount);
    }, [items, visibleCount]);

    const loadMore = useCallback(() => {
      setVisibleCount(prev => Math.min(prev + chunkSize, items.length));
    }, [items.length, chunkSize]);

    return {
      visibleItems,
      totalCount: items.length,
      loadMore,
    };
  }

  /**
   * Prevents excessive API calls
   */
  public useApiCallOptimization<T>(
    apiCall: () => Promise<T>,
    dependencies: any[] = [],
    debounceMs: number = 300
  ): [T | null, boolean, () => void] {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const lastCallRef = useRef<number>(0);

    const executeCall = useCallback(async () => {
      const now = Date.now();
      if (now - lastCallRef.current < debounceMs) {
        return;
      }

      lastCallRef.current = now;
      setLoading(true);

      try {
        const result = await apiCall();
        setData(result);
      } catch (error) {
        customLogger.error('API call failed:', error);
      } finally {
        setLoading(false);
      }
    }, [apiCall, debounceMs]);

    return [data, loading, executeCall];
  }

  /**
   * Resets performance tracking
   */
  public resetTracking(): void {
    this.recalculationCounts.clear();
    this.lastCalculationTimes.clear();
  }

  /**
   * Gets performance statistics
   */
  public getPerformanceStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.recalculationCounts.forEach((count, context) => {
      stats[context] = count;
    });
    return stats;
  }
}

// Export a default instance for easy use
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// React hooks for easy use
export const usePerformanceOptimizer = () => {
  return performanceOptimizer;
};
