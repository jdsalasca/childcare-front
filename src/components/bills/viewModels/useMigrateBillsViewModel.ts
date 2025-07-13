import { useState } from 'react';

interface MigrateBillsViewModel {
  migrateBills: boolean;
  migrateBillsMessage: boolean;
  migrateBillsError: boolean;
  migrateBillsSuccess: boolean;
  migrateBillsLoading: boolean;
}

const useMigrateBillsViewModel = () => {
  const [migrateBillsViewModel] = useState<MigrateBillsViewModel>({
    migrateBills: false,
    migrateBillsMessage: false,
    migrateBillsError: false,
    migrateBillsSuccess: false,
    migrateBillsLoading: false,
  });

  return {
    migrateBillsViewModel,
  };
};

export { useMigrateBillsViewModel };
