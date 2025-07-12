# Testing Guide

## Overview

This document provides comprehensive information about the testing setup and practices for the Childcare Management Application.

## Testing Stack

- **Test Runner**: Vitest (fast, Vite-native test runner)
- **Testing Library**: React Testing Library (for component testing)
- **Mocking**: Vitest's built-in mocking capabilities
- **Coverage**: Vitest coverage reports
- **Environment**: jsdom (browser-like environment for React components)

## Setup

### Dependencies

The following testing dependencies are installed:

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^26.1.0",
    "happy-dom": "^18.0.1",
    "vitest-canvas-mock": "latest"
  },
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0"
  }
}
```

### Configuration

- **Vitest Config**: `vitest.config.ts`
- **Test Setup**: `src/test/setup.ts`
- **Test Utilities**: `src/test/utils.ts`

## Test Scripts

```bash
# Run all tests
yarn test

# Run tests with UI
yarn test:ui

# Run tests once (CI mode)
yarn test:run

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

## Test Structure

### Directory Organization

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   ├── utils.ts               # Testing utilities and mocks
│   ├── api/
│   │   └── API.test.ts        # API layer tests
│   ├── components/
│   │   └── Login.test.tsx     # Component tests
│   └── utils/
│       └── validations.test.ts # Utility function tests
```

### Test Categories

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Multiple components working together
3. **API Tests**: HTTP requests and responses
4. **Utility Tests**: Helper functions and validation logic

## Testing Patterns

### Component Testing

```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import MyComponent from '../../components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    renderWithProviders(<MyComponent />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Updated Text')).toBeInTheDocument()
    })
  })
})
```

### API Testing

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mockApiResponse, mockApiError } from '../utils'
import API from '../../models/API'

vi.mock('axios')

describe('API', () => {
  it('should make successful GET request', async () => {
    const mockData = { id: 1, name: 'test' }
    // Mock implementation
    
    const result = await API.get('/endpoint')
    expect(result).toEqual(mockApiResponse(mockData))
  })
})
```

### Utility Testing

```typescript
import { describe, it, expect } from 'vitest'
import { Validations } from '../../utils/validations'

describe('Validations', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(Validations.isValidEmail('test@example.com')).toBe(true)
      expect(Validations.isValidEmail('invalid-email')).toBe(false)
    })
  })
})
```

## Test Utilities

### `renderWithProviders`

Renders React components with all necessary providers (Router, QueryClient, i18n):

```typescript
import { renderWithProviders } from '../test/utils'

renderWithProviders(<MyComponent />, {
  initialEntries: ['/specific-route'],
  queryClient: customQueryClient
})
```

### Mock Data Factories

Pre-built mock data for consistent testing:

```typescript
import { mockUser, mockChild, mockContract } from '../test/utils'

const testUser = mockUser
const testChild = { ...mockChild, name: 'Custom Name' }
```

### API Response Mocks

```typescript
import { mockApiResponse, mockApiError } from '../test/utils'

// Success response
mockApiResponse({ data: 'success' }, 200)

// Error response
mockApiError('Error message', 400)
```

## Mocking Strategies

### External Dependencies

```typescript
// Mock entire modules
vi.mock('axios')
vi.mock('react-router-dom')

// Mock specific functions
vi.mock('../../utils/functions', () => ({
  Functions: {
    formatDate: vi.fn(() => '2024-01-01')
  }
}))
```

### Component Dependencies

```typescript
// Mock child components
vi.mock('../../components/ChildComponent', () => ({
  default: () => <div>Mocked Child Component</div>
}))
```

### Browser APIs

```typescript
// Mock window methods
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost:3000' },
  writable: true
})
```

## Coverage Configuration

Coverage thresholds are set in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

## Best Practices

### 1. Test Structure

- Use descriptive test names
- Group related tests with `describe` blocks
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking

- Mock external dependencies
- Use factories for consistent test data
- Clean up mocks in `beforeEach`/`afterEach`

### 3. Assertions

- Use specific matchers (`toBeInTheDocument`, `toHaveTextContent`)
- Test user interactions, not implementation details
- Use `waitFor` for async operations

### 4. Component Testing

- Test from user's perspective
- Focus on behavior, not implementation
- Use `screen` queries for better accessibility

## Common Test Scenarios

### Form Testing

```typescript
it('should submit form with valid data', async () => {
  renderWithProviders(<LoginForm />)
  
  fireEvent.change(screen.getByLabelText('Username'), {
    target: { value: 'testuser' }
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Login' }))
  
  await waitFor(() => {
    expect(mockApiCall).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    })
  })
})
```

### Error Handling

```typescript
it('should display error message on API failure', async () => {
  mockAPI.mockRejectedValueOnce(mockApiError('Network error'))
  
  renderWithProviders(<MyComponent />)
  fireEvent.click(screen.getByRole('button'))
  
  await waitFor(() => {
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})
```

### Loading States

```typescript
it('should show loading spinner during API call', async () => {
  const slowPromise = new Promise(resolve => 
    setTimeout(() => resolve(mockApiResponse({})), 1000)
  )
  mockAPI.mockReturnValueOnce(slowPromise)
  
  renderWithProviders(<MyComponent />)
  fireEvent.click(screen.getByRole('button'))
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

## Troubleshooting

### Common Issues

1. **Module not found**: Check import paths and aliases
2. **Mocking issues**: Ensure mocks are hoisted properly
3. **Async test failures**: Use `waitFor` for async operations
4. **Component not rendering**: Check if all providers are included

### Debugging Tests

```typescript
// Add debugging output
screen.debug() // Shows current DOM state

// Log specific elements
console.log(screen.getByRole('button'))

// Check what's available
screen.logTestingPlaygroundURL()
```

## Performance Considerations

- Use `vi.clearAllMocks()` in `beforeEach` to prevent test pollution
- Mock heavy dependencies (API calls, large libraries)
- Use `vi.spyOn` for partial mocking
- Consider using `happy-dom` for faster DOM operations

## Continuous Integration

Tests are configured to run in CI with:

```bash
yarn test:run --coverage
```

This provides:
- Test results
- Coverage reports
- Exit codes for CI/CD integration

## Future Enhancements

1. **E2E Testing**: Add Playwright for end-to-end testing
2. **Visual Testing**: Consider screenshot testing for UI components
3. **Performance Testing**: Add performance benchmarks
4. **Accessibility Testing**: Integrate a11y testing tools

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mocking Strategies](https://vitest.dev/guide/mocking.html) 