# Component Documentation

## Overview
This document provides detailed information about the React components used in the childcare frontend application.

## Component Categories

### Authentication Components

#### Login Component
**File**: `src/components/utils/Login.tsx`

**Purpose**: Handles user authentication and login functionality.

**Props**:
```typescript
interface LoginProps {
  onLogin?: (token: string) => void;
  redirectTo?: string;
}
```

**Features**:
- Email and password validation
- Error handling and display
- Loading states
- Accessibility support
- Responsive design

**Usage**:
```typescript
import Login from '../components/utils/Login';

<Login onLogin={handleLogin} redirectTo="/dashboard" />
```

### Billing Components

#### Bills Component
**File**: `src/components/bills/Bills.tsx`

**Purpose**: Main billing interface for managing childcare bills.

**Props**:
```typescript
interface BillsProps {
  children?: React.ReactNode;
  onBillUpdate?: (bill: Bill) => void;
}
```

**Features**:
- Bill creation and editing
- File upload functionality
- Date-based filtering
- Export capabilities
- Error boundary protection

**Usage**:
```typescript
import Bills from '../components/bills/Bills';

<Bills onBillUpdate={handleBillUpdate} />
```

#### BillsUpload Component
**File**: `src/components/bills/components/billsUpload/BillsUpload.tsx`

**Purpose**: Handles file uploads for billing documents.

**Props**:
```typescript
interface BillsUploadProps {
  onUpload: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}
```

**Features**:
- Drag and drop support
- File type validation
- Size limit enforcement
- Progress tracking
- Error handling

### Contract Components

#### Contracts Component
**File**: `src/components/contracts/Contracts.tsx`

**Purpose**: Main contract management interface.

**Props**:
```typescript
interface ContractsProps {
  onContractCreate?: (contract: Contract) => void;
  onContractUpdate?: (contract: Contract) => void;
}
```

**Features**:
- Multi-step contract creation
- Form validation
- Document generation
- Status tracking
- Search and filtering

#### Step Components
**Files**: `src/components/contracts/steps/StepComponent*.tsx`

**Purpose**: Individual steps in the contract creation process.

**Common Features**:
- Form validation
- Data persistence
- Navigation controls
- Progress indication
- Error handling

### Deposit Components

#### DepositsMenu Component
**File**: `src/components/deposits/DepositsMenu.tsx`

**Purpose**: Navigation menu for deposit-related operations.

**Features**:
- Menu navigation
- Role-based access control
- Responsive design
- Accessibility support

#### CashRegister Component
**File**: `src/components/deposits/cashRegister/CashRegister.tsx`

**Purpose**: Cash register functionality for deposit management.

**Props**:
```typescript
interface CashRegisterProps {
  onTransaction?: (transaction: Transaction) => void;
  initialBalance?: number;
}
```

**Features**:
- Transaction recording
- Balance tracking
- Receipt generation
- Error boundary protection
- Audit trail

### Provider Components

#### NavigationProvider Component
**File**: `src/components/providers/NavigationProvider.tsx`

**Purpose**: Provides navigation context to child components.

**Props**:
```typescript
interface NavigationProviderProps {
  children: React.ReactNode;
}
```

**Features**:
- Navigation service integration
- Route management
- History tracking
- Breadcrumb support

#### AuthProvider Component
**File**: `src/context/AuthContext.tsx`

**Purpose**: Manages authentication state and token handling.

**Props**:
```typescript
interface AuthProviderProps {
  children: React.ReactNode;
}
```

**Features**:
- Token management
- Authentication state
- Login/logout functionality
- Secure storage

### Utility Components

#### ErrorBoundary Component
**File**: `src/components/utils/ErrorBoundary.tsx`

**Purpose**: Catches and handles React component errors gracefully.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Features**:
- Error catching
- Fallback UI
- Error logging
- Recovery options
- Development debugging

## Component Patterns

### Functional Components with Hooks
All components use functional components with React hooks for state management and side effects.

```typescript
const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

### Custom Hooks
Complex logic is extracted into custom hooks for reusability.

```typescript
const useMyCustomHook = (dependencies) => {
  // Hook logic
  return { data, loading, error, actions };
};
```

### Error Boundaries
Critical components are wrapped with error boundaries for graceful error handling.

```typescript
<ErrorBoundary>
  <CriticalComponent />
</ErrorBoundary>
```

## Styling

### Tailwind CSS
Components use Tailwind CSS for styling with utility classes.

```typescript
<div className="flex items-center justify-between p-4 bg-white shadow-sm">
  <h1 className="text-xl font-semibold text-gray-900">Title</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

### Responsive Design
Components are designed to be responsive across different screen sizes.

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid content */}
</div>
```

## Accessibility

### ARIA Attributes
Components include proper ARIA attributes for screen reader support.

```typescript
<button
  aria-label="Submit form"
  aria-describedby="form-help"
  onClick={handleSubmit}
>
  Submit
</button>
```

### Keyboard Navigation
All interactive elements support keyboard navigation.

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    handleClick();
  }
};
```

### Focus Management
Components manage focus appropriately for accessibility.

```typescript
useEffect(() => {
  if (isVisible) {
    elementRef.current?.focus();
  }
}, [isVisible]);
```

## Performance

### Memoization
Components use React.memo and useMemo for performance optimization.

```typescript
const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

### Lazy Loading
Large components are lazy loaded to improve initial load time.

```typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

## Testing

### Unit Tests
Each component has corresponding unit tests.

```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### Integration Tests
Components are tested in integration with other components.

```typescript
describe('Component Integration', () => {
  it('should work with other components', () => {
    render(
      <Provider>
        <ComponentA />
        <ComponentB />
      </Provider>
    );
    // Test integration
  });
});
```

## Best Practices

### Props Interface
All components have well-defined TypeScript interfaces for props.

```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  callback?: (data: any) => void;
}
```

### Default Props
Components use default props for optional values.

```typescript
const MyComponent: React.FC<MyComponentProps> = ({
  optional = 'default',
  callback = () => {},
}) => {
  // Component logic
};
```

### Error Handling
Components handle errors gracefully with proper error boundaries and try-catch blocks.

### Documentation
All components include JSDoc comments for better documentation.

```typescript
/**
 * MyComponent - A component that does something
 * @param props - Component props
 * @returns JSX element
 */
const MyComponent: React.FC<MyComponentProps> = (props) => {
  // Component implementation
};
```