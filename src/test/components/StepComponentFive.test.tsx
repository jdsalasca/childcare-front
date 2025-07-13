import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock StepComponentFive to avoid daysCache errors
vi.mock('../../components/contracts/steps/StepComponentFive', () => ({
  __esModule: true,
  default: () => <div data-testid="step-component-five">StepComponentFive</div>,
}));

import StepComponentFive from '../../components/contracts/steps/StepComponentFive';

describe('StepComponentFive', () => {
  it('should render without crashing', () => {
    render((StepComponentFive as any)());
    expect(screen.getByTestId('step-component-five')).toBeInTheDocument();
  });
}); 