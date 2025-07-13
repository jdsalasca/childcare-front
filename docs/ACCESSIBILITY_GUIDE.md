# Accessibility Guide

## Overview

This document outlines the comprehensive accessibility features implemented in the childcare-front application to ensure compliance with WCAG 2.1 guidelines and provide an inclusive user experience for all users, including those with disabilities.

## Accessibility Features Implemented

### 1. ARIA Labels and Roles

All interactive elements have proper ARIA labels and roles:

```typescript
// Example: Accessible form inputs
<InputTextWrapper
  name="username"
  control={control}
  label={t('userNameOrEmail')}
  aria-describedby="username-error"
/>
```

### 2. Keyboard Navigation

Full keyboard navigation support with proper focus management:

```typescript
// Example: Keyboard navigation handlers
const keyboardHandlers = accessibility.createKeyboardNavigationHandlers(
  () => handleEnter(), // Enter key
  () => handleEscape(), // Escape key
  () => handleSpace()   // Space key
);
```

### 3. Screen Reader Support

Comprehensive screen reader support with live regions and announcements:

```typescript
// Example: Screen reader announcements
const announcements = accessibility.createScreenReaderAnnouncements();
announcements.announce('Form submitted successfully', 'polite');
```

### 4. Focus Management

Proper focus trapping and management for modals and dialogs:

```typescript
// Example: Focus management
const focusManagement = accessibility.createFocusManagement();
focusManagement.trapFocus(modalRef);
```

## Accessibility Components

### AccessibleWrapper

The core accessibility wrapper component that provides comprehensive accessibility features:

```typescript
<AccessibleWrapper
  role="main"
  aria-label="Main content area"
  focusable={true}
  skipLink={true}
>
  {children}
</AccessibleWrapper>
```

### Specialized Components

#### AccessibleForm
```typescript
<AccessibleForm
  aria-label="User registration form"
  onSubmit={handleSubmit}
>
  {/* Form content */}
</AccessibleForm>
```

#### AccessibleSection
```typescript
<AccessibleSection
  aria-label="Bills management section"
  aria-labelledby="bills-heading"
>
  {/* Section content */}
</AccessibleSection>
```

#### AccessibleCard
```typescript
<AccessibleCard
  aria-label="Bill card"
  aria-describedby="bill-description"
>
  {/* Card content */}
</AccessibleCard>
```

#### AccessibleList
```typescript
<AccessibleList
  aria-label="Bills list"
  aria-labelledby="bills-list-heading"
>
  {/* List items */}
</AccessibleList>
```

## Accessibility Utilities

### AccessibilityUtils Class

The `AccessibilityUtils` class provides comprehensive accessibility utilities:

#### Input Accessibility
```typescript
const inputProps = accessibility.createInputAccessibilityProps(
  'Username field',
  true, // required
  false, // invalid
  'username-error' // described by
);
```

#### Button Accessibility
```typescript
const buttonProps = accessibility.createButtonAccessibilityProps(
  'Submit form',
  false, // pressed
  false  // expanded
);
```

#### Dropdown Accessibility
```typescript
const dropdownProps = accessibility.createDropdownAccessibilityProps(
  'Select option',
  false, // expanded
  true   // required
);
```

#### Checkbox Accessibility
```typescript
const checkboxProps = accessibility.createCheckboxAccessibilityProps(
  'Accept terms',
  false, // checked
  true   // required
);
```

### Keyboard Navigation

Comprehensive keyboard navigation support:

```typescript
const keyboardHandlers = accessibility.createKeyboardNavigationHandlers(
  () => handleEnter(),    // Enter key
  () => handleEscape(),   // Escape key
  () => handleSpace(),    // Space key
  () => handleArrowUp(),  // Arrow Up
  () => handleArrowDown(), // Arrow Down
  () => handleArrowLeft(), // Arrow Left
  () => handleArrowRight() // Arrow Right
);
```

### Focus Management

Advanced focus management utilities:

```typescript
const focusManagement = accessibility.createFocusManagement();

// Focus first element
focusManagement.focusFirstElement(containerRef);

// Trap focus
const cleanup = focusManagement.trapFocus(modalRef);
```

### Screen Reader Support

Live regions and announcements for screen readers:

```typescript
const announcements = accessibility.createScreenReaderAnnouncements();

// Announce to screen readers
announcements.announce('Form submitted successfully', 'polite');
announcements.announce('Error occurred', 'assertive');
```

## WCAG 2.1 Compliance

### Level A Compliance

- ✅ **1.1.1 Non-text Content**: All images have alt text
- ✅ **1.3.1 Info and Relationships**: Proper semantic HTML structure
- ✅ **1.3.2 Meaningful Sequence**: Logical tab order
- ✅ **2.1.1 Keyboard**: Full keyboard navigation
- ✅ **2.1.2 No Keyboard Trap**: Focus management prevents traps
- ✅ **2.4.1 Bypass Blocks**: Skip links implemented
- ✅ **2.4.2 Page Titled**: Descriptive page titles
- ✅ **3.2.1 On Focus**: No unexpected focus changes
- ✅ **4.1.1 Parsing**: Valid HTML structure
- ✅ **4.1.2 Name, Role, Value**: Proper ARIA attributes

### Level AA Compliance

- ✅ **1.4.3 Contrast (Minimum)**: Sufficient color contrast
- ✅ **1.4.4 Resize Text**: Text can be resized up to 200%
- ✅ **2.4.6 Headings and Labels**: Descriptive headings
- ✅ **2.4.7 Focus Visible**: Clear focus indicators
- ✅ **3.1.2 Language of Parts**: Language attributes
- ✅ **3.2.2 On Input**: No unexpected input changes
- ✅ **4.1.3 Status Messages**: Live regions for status updates

### Level AAA Compliance (Partial)

- ✅ **1.4.6 Contrast (Enhanced)**: High contrast mode support
- ✅ **2.1.3 Keyboard (No Exception)**: All functionality keyboard accessible
- ✅ **2.4.8 Location**: Breadcrumb navigation
- ✅ **3.1.3 Unusual Words**: Glossary for technical terms
- ✅ **3.2.4 Consistent Identification**: Consistent labeling

## Testing Accessibility

### Automated Testing

Use the following tools to test accessibility:

```bash
# Run accessibility tests
npm run test:accessibility

# Run Lighthouse accessibility audit
npm run lighthouse:accessibility
```

### Manual Testing

#### Keyboard Navigation Test
1. Navigate through the entire application using only Tab key
2. Verify all interactive elements are reachable
3. Test Enter and Space key functionality
4. Verify Escape key closes modals/dialogs

#### Screen Reader Test
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Navigate through all pages
3. Verify all content is announced properly
4. Test form interactions

#### Color Contrast Test
1. Use browser developer tools
2. Check contrast ratios meet WCAG requirements
3. Test with high contrast mode

## Best Practices

### 1. Always Use Semantic HTML

```typescript
// ✅ Good
<button type="submit" aria-label="Submit form">
  Submit
</button>

// ❌ Avoid
<div onClick={handleSubmit} role="button">
  Submit
</div>
```

### 2. Provide Alternative Text

```typescript
// ✅ Good
<img src="logo.png" alt="Company logo" />

// ❌ Avoid
<img src="logo.png" />
```

### 3. Use ARIA Labels Appropriately

```typescript
// ✅ Good
<input aria-label="Search" aria-describedby="search-help" />

// ❌ Avoid
<input aria-label="Click here to search" />
```

### 4. Test with Screen Readers

Always test with actual screen reader software to ensure proper functionality.

### 5. Maintain Focus Order

Ensure logical tab order throughout the application.

## Common Accessibility Issues and Solutions

### Issue: Missing ARIA Labels
**Solution**: Use `AccessibleWrapper` components or add proper ARIA attributes.

### Issue: Keyboard Navigation Not Working
**Solution**: Use `AccessibilityUtils.createKeyboardNavigationHandlers()`.

### Issue: Screen Reader Not Announcing Changes
**Solution**: Use `AccessibilityUtils.createScreenReaderAnnouncements()`.

### Issue: Focus Trapping in Modals
**Solution**: Use `AccessibilityUtils.createFocusManagement().trapFocus()`.

## Accessibility Checklist

When implementing new features, ensure:

- [ ] All interactive elements have proper ARIA labels
- [ ] Keyboard navigation works for all functionality
- [ ] Screen readers can access all content
- [ ] Color contrast meets WCAG requirements
- [ ] Focus indicators are visible
- [ ] Error messages are announced to screen readers
- [ ] Form validation provides accessible feedback
- [ ] Modal dialogs trap focus properly
- [ ] Skip links are implemented for main content
- [ ] Page titles are descriptive and unique

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Accessibility Testing Tools](https://www.w3.org/WAI/ER/tools/)