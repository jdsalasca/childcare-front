import { vi } from 'vitest';

// Mock the SecurityService with a simple factory function
vi.mock('configs/storageUtils', () => ({
  SecurityService: {
    getInstance: vi.fn(() => ({
      setEncryptedItem: vi.fn(),
      getEncryptedItem: vi.fn(),
    })),
  },
}));

describe('API', () => {
  it('should be importable without errors', async () => {
    // Test that the API module can be imported without errors
    const API = await import('../../models/API');
    expect(API).toBeDefined();
  });
});
