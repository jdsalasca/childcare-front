# Fix Issue #12: Replace 'any' types with proper TypeScript types

## Description
This PR addresses issue #12 by replacing excessive use of `any` types with proper TypeScript types throughout the codebase.

## Changes Made
- **API.ts**: Replaced `any` types with proper `RequestBody` type
- **AppModels.ts**: Replaced `any` types with proper `ToastRef` and `ToastMessage` interfaces
- **useBillsViewModel.ts**: Replaced `any` types with proper interfaces for `BillType`, `ClosedMoneyData`, and `Child`

## Type Safety Improvements
- Added proper interfaces for better IDE support
- Improved compile-time error checking
- Enhanced type safety across the codebase
- Better autocomplete and IntelliSense support

## Testing
- All existing functionality should work as expected
- Type safety improved without breaking existing code
- Better IDE support and autocomplete

## Files Changed
- `src/models/API.ts`
- `src/models/AppModels.ts`
- `src/components/bills/viewModels/useBillsViewModel.ts`

Closes #12