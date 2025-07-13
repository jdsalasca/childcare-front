import { CashOnHandWithDetails } from 'types/cashOnHandByDay';
import API, { ApiResponse, BASE_URL } from './API';

export const DailyCashRecordsAPI = {
  getAllDates: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await API.get<string[]>(BASE_URL, '/daily-cash/dates');
      return response;
    } catch (error) {
      console.error('Error fetching dates:', error);
      throw error;
    }
  },
  getAllRecordByDate: async (
    date: string
  ): Promise<ApiResponse<CashOnHandWithDetails[]>> => {
    try {
      const response = await API.get<CashOnHandWithDetails[]>(
        BASE_URL,
        `/daily-cash/details_by_date/details`,
        { params: { date } }
      );
      return response;
    } catch (error) {
      console.error('Error fetching records by date:', error);
      throw error;
    }
  },
  // Migration APIs
  normalMigration: async (
    initial_date: string,
    target_date: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await API.post(
        BASE_URL,
        `/daily-cash/migrate/normal`,
        { target_date: target_date },
        { params: { initial_date } }
      );
      return response;
    } catch (error) {
      console.error('Error performing normal migration:', error);
      throw error;
    }
  },

  mergeMigration: async (
    initial_date: string,
    target_date: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await API.post(
        BASE_URL,
        `/daily-cash/migrate/merge`,
        { target_date: target_date },
        { params: { initial_date } }
      );
      return response;
    } catch (error) {
      console.error('Error performing merge migration:', error);
      throw error;
    }
  },

  overwriteMigration: async (
    initial_date: string,
    target_date: string
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await API.post(
        BASE_URL,
        `/daily-cash/migrate/overwrite`,
        { target_date: target_date },
        { params: { initial_date, target_date } }
      );
      return response;
    } catch (error) {
      console.error('Error performing overwrite migration:', error);
      throw error;
    }
  },
};
