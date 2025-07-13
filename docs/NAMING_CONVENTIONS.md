# File Naming Conventions

This document establishes consistent file naming conventions for the childcare-front project to improve maintainability and developer experience.

## General Principles

- **Consistency**: All files should follow the same naming pattern within their category
- **Clarity**: File names should clearly indicate their purpose and type
- **Discoverability**: Files should be easy to find and understand

## File Naming Rules

### React Components
- **Pattern**: PascalCase
- **Extension**: `.tsx` for TypeScript React components
- **Examples**:
  - `BillsUpload.tsx`
  - `CombinedBillsForm.tsx`
  - `StepComponentTwo.tsx`
  - `GuardianForm.tsx`

### Hooks and Custom Hooks
- **Pattern**: camelCase with `use` prefix
- **Extension**: `.ts` for TypeScript hooks
- **Examples**:
  - `useRegisterViewModelForm.ts`
  - `useViewModelStepGuardians.ts`
  - `useBillsViewModel.ts`
  - `useCustomNavigate.ts`

### Utilities and Services
- **Pattern**: camelCase
- **Extension**: `.ts` for TypeScript utilities
- **Examples**:
  - `errorHandler.ts`
  - `navigationService.ts`
  - `inputValidation.ts`
  - `performanceOptimizer.ts`

### Types and Interfaces
- **Pattern**: PascalCase
- **Extension**: `.ts` for TypeScript type definitions
- **Examples**:
  - `ContractInfo.ts`
  - `GuardianType.ts`
  - `Bill.ts`
  - `FormValues.ts`

### Constants and Configuration
- **Pattern**: camelCase
- **Extension**: `.ts` for TypeScript constants
- **Examples**:
  - `utilsAndConstants.ts`
  - `logger.ts`
  - `storageUtils.ts`

### Test Files
- **Pattern**: Same as source file with `.test` suffix
- **Extension**: `.tsx` or `.ts` depending on what's being tested
- **Examples**:
  - `GuardianForm.test.tsx`
  - `useBillsViewModel.test.ts`

## Directory Naming

### Component Directories
- **Pattern**: camelCase
- **Examples**:
  - `billsUpload/`
  - `formComponents/`
  - `viewModels/`
  - `modelView/`

### Feature Directories
- **Pattern**: camelCase
- **Examples**:
  - `bills/`
  - `contracts/`
  - `users/`
  - `homepage/`

## Migration Guidelines

When renaming files:

1. **Update the file extension** from `.js` to `.ts` or `.jsx` to `.tsx`
2. **Update import statements** in all files that reference the renamed file
3. **Update test files** to reference the new file name
4. **Update documentation** that references the old file name
5. **Verify the build** to ensure all imports are correctly resolved

## Examples of Corrected Files

### Before (Inconsistent)
```
src/components/bills/components/billsUpload/BillsUpload.jsx
src/components/bills/components/billsUpload/CombinedBillsForm.jsx
src/components/users/modelView/useRegisterViewModelForm.js
src/components/contracts/viewModels/useviewModelStepGuardians.ts
```

### After (Consistent)
```
src/components/bills/components/billsUpload/BillsUpload.tsx
src/components/bills/components/billsUpload/CombinedBillsForm.tsx
src/components/users/modelView/useRegisterViewModelForm.ts
src/components/contracts/viewModels/useViewModelStepGuardians.ts
```

## Enforcement

- **Linting**: ESLint rules should enforce these conventions
- **Pre-commit hooks**: Should check for naming consistency
- **Code review**: Reviewers should verify naming conventions
- **Documentation**: Keep this document updated with any changes

## Benefits

- **Improved maintainability**: Consistent naming makes the codebase easier to navigate
- **Better developer experience**: Clear naming reduces cognitive load
- **Reduced errors**: Consistent patterns prevent import issues
- **Professional appearance**: Consistent naming reflects code quality