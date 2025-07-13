# Childcare Frontend Application

## Overview
A comprehensive React-based frontend application for managing childcare operations, including billing, contracts, deposits, and user management.

## Features

### Core Functionality
- **Authentication & Authorization** - Secure login/logout with token-based authentication
- **Billing Management** - Create, edit, and manage bills for childcare services
- **Contract Management** - Multi-step contract creation and management
- **Deposit Management** - Handle deposits and cash register operations
- **User Management** - User registration and profile management

### Technical Features
- **TypeScript** - Full type safety and better development experience
- **React Router** - Client-side routing with navigation service
- **Error Boundaries** - Graceful error handling and recovery
- **Performance Optimization** - Debouncing, throttling, and memoization
- **Accessibility** - WCAG compliant with ARIA attributes and keyboard navigation
- **Input Validation** - Comprehensive validation and sanitization
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/jdsalasca/childcare-front.git
cd childcare-front

# Install dependencies
npm install
# or
yarn install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_BASE_URL=http://localhost:3000
VITE_ENV=development
VITE_SECRET_KEY=your-secret-key
```

### Development
```bash
# Start development server
npm run dev
# or
yarn dev

# Run tests
npm run test
# or
yarn test

# Build for production
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── bills/         # Billing related components
│   ├── contracts/     # Contract management components
│   ├── deposits/      # Deposit and cash register components
│   ├── providers/     # Context providers
│   └── utils/         # Utility components
├── configs/           # Configuration files
├── context/           # React context providers
├── models/            # TypeScript interfaces and types
├── utils/             # Utility functions
├── test/              # Test files
└── docs/              # Documentation
```

## Architecture

### Component Architecture
- **Functional Components** - Modern React with hooks
- **Custom Hooks** - Reusable logic extraction
- **Context Providers** - State management and dependency injection
- **Error Boundaries** - Graceful error handling

### State Management
- **React Context** - Global state management
- **Local State** - Component-specific state with useState
- **Custom Hooks** - Complex state logic encapsulation

### Navigation
- **React Router** - Client-side routing
- **Navigation Service** - Centralized navigation logic
- **Breadcrumbs** - User navigation feedback

## Key Components

### Authentication
- **Login Component** - User authentication interface
- **AuthContext** - Authentication state management
- **Token Management** - Secure token storage and retrieval

### Billing System
- **Bills Component** - Main billing interface
- **BillsUpload** - File upload functionality
- **BillsViewModel** - Business logic for billing operations

### Contract Management
- **Contracts Component** - Contract creation and management
- **Step Components** - Multi-step contract creation process
- **Contract Validation** - Form validation and data integrity

### Error Handling
- **ErrorBoundary** - React error boundary implementation
- **ErrorHandler** - Centralized error handling utilities
- **Custom Logger** - Structured logging system

## Utilities

### Performance Optimization
```typescript
import { PerformanceOptimizer } from '../utils/PerformanceOptimizer';

const optimizer = PerformanceOptimizer.getInstance();
const debouncedFunction = optimizer.debounce(myFunction, 300);
```

### Accessibility
```typescript
import { AccessibilityUtils } from '../utils/AccessibilityUtils';

const ariaLabel = AccessibilityUtils.createAriaLabel('Submit', 'form');
```

### Input Validation
```typescript
import { InputValidation } from '../utils/InputValidation';

const isValid = InputValidation.validateEmail('user@example.com');
```

## Testing Strategy

### Test Types
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Component interaction testing
- **E2E Tests** - Complete user workflow testing

### Coverage Goals
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

## Code Quality

### Linting
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Pre-commit Hooks
- Code formatting
- Linting
- Type checking
- Test execution

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Environment Variables
- `VITE_BASE_URL` - API base URL
- `VITE_ENV` - Environment (development/production)
- `VITE_SECRET_KEY` - Encryption key for sensitive data

## Security

### Authentication
- Token-based authentication
- Secure token storage with encryption
- Automatic token refresh

### Data Protection
- Input sanitization
- XSS prevention
- CSRF protection

### Error Handling
- Secure error messages
- No sensitive data in error logs
- Graceful error recovery

## Performance

### Optimization Techniques
- **Code Splitting** - Lazy loading of components
- **Memoization** - React.memo and useMemo
- **Debouncing** - Input and API call optimization
- **Throttling** - Event handler optimization

### Bundle Optimization
- Tree shaking
- Dead code elimination
- Asset optimization

## Accessibility

### WCAG Compliance
- **Level AA** - Minimum compliance target
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader** - ARIA labels and descriptions
- **Color Contrast** - WCAG AA contrast ratios

### Features
- Skip links
- Focus management
- Semantic HTML
- ARIA attributes

## Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Write tests
4. Update documentation
5. Submit pull request

### Code Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests
- Update documentation

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Test Failures
```bash
# Clear test cache
npm run test -- --clearCache
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

## Support

### Documentation
- [Component Documentation](./components/README.md)
- [API Documentation](./api/README.md)
- [Testing Guide](./testing/README.md)

### Contact
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: Security advisories

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.