import { ErrorHandler } from '../../utils/errorHandler';

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.info = originalConsoleInfo;
});

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.handleError(error);
      
      expect(result).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle string errors', () => {
      const error = 'Test error string';
      const result = ErrorHandler.handleError(error);
      
      expect(result).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle unknown error types', () => {
      const error = { custom: 'error' };
      const result = ErrorHandler.handleError(error);
      
      expect(result).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('handleWarning', () => {
    it('should handle warning messages', () => {
      const warning = 'Test warning';
      const result = ErrorHandler.handleWarning(warning);
      
      expect(result).toBeDefined();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('handleInfo', () => {
    it('should handle info messages', () => {
      const info = 'Test info';
      const result = ErrorHandler.handleInfo(info);
      
      expect(result).toBeDefined();
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('isError', () => {
    it('should return true for Error objects', () => {
      const error = new Error('Test error');
      expect(ErrorHandler.isError(error)).toBe(true);
    });

    it('should return false for non-Error objects', () => {
      expect(ErrorHandler.isError('string')).toBe(false);
      expect(ErrorHandler.isError({})).toBe(false);
      expect(ErrorHandler.isError(null)).toBe(false);
      expect(ErrorHandler.isError(undefined)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error objects', () => {
      const error = new Error('Test error message');
      expect(ErrorHandler.getErrorMessage(error)).toBe('Test error message');
    });

    it('should handle string errors', () => {
      const error = 'Test string error';
      expect(ErrorHandler.getErrorMessage(error)).toBe('Test string error');
    });

    it('should handle unknown error types', () => {
      const error = { custom: 'error' };
      expect(ErrorHandler.getErrorMessage(error)).toBe('Unknown error occurred');
    });
  });
});