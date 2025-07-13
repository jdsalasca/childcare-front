import { PerformanceOptimizer } from '../../utils/PerformanceOptimizer';

describe('PerformanceOptimizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = PerformanceOptimizer.debounce(mockFn, 100);

      // Call multiple times quickly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Function should be called only once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = PerformanceOptimizer.throttle(mockFn, 100);

      // Call multiple times quickly
      throttledFn();
      throttledFn();
      throttledFn();

      // Function should be called immediately (first call)
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Fast forward time
      jest.advanceTimersByTime(100);

      // Call again
      throttledFn();

      // Function should be called again
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    it('should memoize function results', () => {
      const mockFn = jest.fn((a: number, b: number) => a + b);
      const memoizedFn = PerformanceOptimizer.memoize(mockFn);

      // First call
      const result1 = memoizedFn(1, 2);
      expect(result1).toBe(3);
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Second call with same arguments
      const result2 = memoizedFn(1, 2);
      expect(result2).toBe(3);
      expect(mockFn).toHaveBeenCalledTimes(1); // Should not call again

      // Call with different arguments
      const result3 = memoizedFn(2, 3);
      expect(result3).toBe(5);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('trackRender', () => {
    it('should track component renders', () => {
      const componentName = 'TestComponent';
      
      PerformanceOptimizer.trackRender(componentName);
      
      // In a real scenario, this would log render information
      // For now, we just test that it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('measurePerformance', () => {
    it('should measure function performance', () => {
      const mockFn = jest.fn(() => 'test');
      const result = PerformanceOptimizer.measurePerformance(mockFn, 'testFunction')();
      
      expect(result).toBe('test');
      expect(mockFn).toHaveBeenCalled();
    });
  });
});