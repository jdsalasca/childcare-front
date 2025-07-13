# State Management Guide

## Overview

This document outlines the unified state management patterns used throughout the childcare-front application. The goal is to provide consistent, predictable, and maintainable state management across all components.

## Unified State Management Pattern

### Core Principles

1. **Consistency**: All state management follows the same patterns
2. **Type Safety**: Full TypeScript support with proper typing
3. **Performance**: Optimized with useCallback and useMemo
4. **Error Handling**: Centralized error handling for state operations
5. **Maintainability**: Clear, predictable state updates

### Available Hooks

#### `useUnifiedState<T>`

The core state management hook that provides a unified interface for all state operations.

```typescript
const { state, setState, updateState, resetState, setError } = useUnifiedState({
  initialState: { count: 0, name: '' }
});
```

**Methods:**
- `setState(newState)`: Replace entire state
- `updateState(partialState)`: Merge partial state
- `resetState()`: Reset to initial state
- `setError(error)`: Handle state errors

#### `useLoadingState`

Specialized hook for loading states with error handling.

```typescript
const { state, setState, updateState } = useLoadingState();
// state: { loading: boolean, loadingMessage: string, error: Error | null }
```

#### `useFormState<T>`

Specialized hook for form state management.

```typescript
const { state, setState, updateState } = useFormState(initialFormData);
// state: { data: T, errors: Record<string, string>, isValid: boolean, isDirty: boolean }
```

#### `useListState<T>`

Specialized hook for list state management.

```typescript
const { state, setState, updateState } = useListState(initialItems);
// state: { items: T[], selectedItems: T[], searchTerm: string, filters: Record<string, any> }
```

## Migration Guide

### Before (Inconsistent Patterns)

```typescript
// Different patterns across components
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

// Inconsistent error handling
try {
  setLoading(true);
  const result = await apiCall();
  setData(result);
} catch (err) {
  setError(err);
} finally {
  setLoading(false);
}
```

### After (Unified Pattern)

```typescript
// Consistent pattern across all components
const { state, setState, updateState, setError } = useLoadingState();

// Unified error handling
const handleApiCall = async () => {
  try {
    setState({ loading: true, loadingMessage: 'Loading...', error: null });
    const result = await apiCall();
    setState({ loading: false, data: result, error: null });
  } catch (err) {
    setError(err as Error);
  }
};
```

## Best Practices

### 1. Use Specialized Hooks

Prefer specialized hooks over the generic `useUnifiedState` when possible:

```typescript
// ✅ Good - Use specialized hook
const { state, setState } = useLoadingState();

// ❌ Avoid - Generic hook for simple cases
const { state, setState } = useUnifiedState({
  initialState: { loading: false, loadingMessage: '', error: null }
});
```

### 2. Consistent Error Handling

Always use the built-in error handling:

```typescript
// ✅ Good - Use setError
const handleError = (error: Error) => {
  setError(error);
};

// ❌ Avoid - Manual error state management
const [error, setError] = useState(null);
```

### 3. Type Safety

Always provide proper TypeScript types:

```typescript
// ✅ Good - Proper typing
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const { state, setState } = useUnifiedState<UserState>({
  initialState: { user: null, isAuthenticated: false }
});

// ❌ Avoid - Any types
const { state, setState } = useUnifiedState<any>({
  initialState: { user: null, isAuthenticated: false }
});
```

### 4. Performance Optimization

Use the memoized state value and callbacks:

```typescript
// ✅ Good - Use memoized state
const { state } = useUnifiedState({ initialState: { data: [] } });
const memoizedData = useMemo(() => state.data, [state.data]);

// ❌ Avoid - Direct state access in expensive operations
const expensiveOperation = () => {
  return state.data.map(item => expensiveTransform(item));
};
```

## Migration Checklist

When migrating existing components to the unified state management pattern:

- [ ] Replace `useState` with appropriate unified state hook
- [ ] Replace manual error handling with `setError`
- [ ] Update all state update calls to use unified methods
- [ ] Add proper TypeScript types
- [ ] Test state transitions and error scenarios
- [ ] Update component tests to use new state patterns

## Examples

### Authentication State

```typescript
// src/context/AuthContext.tsx
const { state, setState } = useUnifiedState({
  initialState: { token: null as string | null }
});
```

### Form State

```typescript
// src/components/forms/UserForm.tsx
const { state, setState, updateState } = useFormState({
  name: '',
  email: '',
  phone: ''
});
```

### List State

```typescript
// src/components/bills/BillsList.tsx
const { state, setState, updateState } = useListState<Bill>([]);
```

## Benefits

1. **Consistency**: All components follow the same state management patterns
2. **Maintainability**: Easier to understand and modify state logic
3. **Type Safety**: Full TypeScript support prevents runtime errors
4. **Performance**: Optimized with proper memoization
5. **Error Handling**: Centralized error handling reduces bugs
6. **Testing**: Easier to test state transitions and error scenarios

## Future Enhancements

- Add middleware support for state transformations
- Implement state persistence patterns
- Add state debugging tools
- Create more specialized hooks for common patterns