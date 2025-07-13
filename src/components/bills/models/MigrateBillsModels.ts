interface InitialState {
  initial_day: Date | null;
  target_day: Date | null;
  total_cash_initial_day: number | null;
  total_cash_target_day: number | null;
  total_check_initial_day: number | null;
  total_check_target_day: number | null;
}

class MigrateBillsModels {
  static initialStateComponent: InitialState = {
    initial_day: null,
    target_day: null,
    total_cash_initial_day: null,
    total_cash_target_day: null,
    total_check_initial_day: null,
    total_check_target_day: null,
  };
}

export { MigrateBillsModels };
