import { useState, useCallback, useReducer, useMemo } from 'react';

// Unified state management types
export interface StateAction<T> {
  type: string;
  payload?: T;
  error?: Error;
}

export interface StateConfig<T> {
  initialState: T;
  reducer?: (state: T, action: StateAction<T>) => T;
}

// Default reducer for simple state updates
const defaultReducer = <T>(state: T, action: StateAction<T>): T => {
  switch (action.type) {
    case 'SET':
      return action.payload as T;
    case 'UPDATE':
      return { ...state, ...action.payload };
    case 'RESET':
      return action.payload as T;
    case 'ERROR':
      console.error('State error:', action.error);
      return state;
    default:
      return state;
  }
};

// Unified state management hook
export const useUnifiedState = <T>(
  config: StateConfig<T>
) => {
  const { initialState, reducer = defaultReducer } = config;
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback((newState: T) => {
    dispatch({ type: 'SET', payload: newState });
  }, []);

  const updateState = useCallback((partialState: Partial<T>) => {
    dispatch({ type: 'UPDATE', payload: partialState as T });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialState });
  }, [initialState]);

  const setError = useCallback((error: Error) => {
    dispatch({ type: 'ERROR', error });
  }, []);

  const stateValue = useMemo(() => state, [state]);

  return {
    state: stateValue,
    setState,
    updateState,
    resetState,
    setError,
    dispatch,
  };
};

// Specialized hooks for common patterns
export const useLoadingState = () => {
  return useUnifiedState({
    initialState: {
      loading: false,
      loadingMessage: '',
      error: null as Error | null,
    },
  });
};

export const useFormState = <T>(initialFormData: T) => {
  return useUnifiedState({
    initialState: {
      data: initialFormData,
      errors: {} as Record<string, string>,
      isValid: false,
      isDirty: false,
    },
  });
};

export const useListState = <T>(initialItems: T[] = []) => {
  return useUnifiedState({
    initialState: {
      items: initialItems,
      selectedItems: [] as T[],
      searchTerm: '',
      filters: {} as Record<string, any>,
    },
  });
};