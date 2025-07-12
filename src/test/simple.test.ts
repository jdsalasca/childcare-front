import { describe, it, expect } from 'vitest'

describe('Simple Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should work with strings', () => {
    expect('hello').toBe('hello')
  })

  it('should work with arrays', () => {
    expect([1, 2, 3]).toEqual([1, 2, 3])
  })

  it('should work with objects', () => {
    expect({ name: 'test' }).toEqual({ name: 'test' })
  })

  it('should work with async functions', async () => {
    const result = await Promise.resolve('async result')
    expect(result).toBe('async result')
  })
}) 