import { ApiResponse } from '@models/API';
import { Toast } from 'primereact/toast'; // Adjust this import based on your actual Toast type
import { ApiModels } from '../../models/ApiModels';

type ToastSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'secondary'
  | 'contrast';

/**
 * This class provides methods for interpreting toast messages based on the response data.
 */
export const ToastInterpreterUtils = {
  /**
   * This method is used to interpret the toast messages based on the response data from the backend.
   * @param {Toast} toast - The toast reference (e.g., `toast.current`)
   * @param {ApiResponseModel} response - The response object
   * @param {string} okMessage - The message to display if the response is successful
   * @param {string} errorMessage - The message to display if the response is not successful
   * @returns {void}
   */
  toastBackendInterpreter: (
    toast: React.RefObject<Toast>,
    response: ApiResponse<any> = ApiModels.defaultResponseModel,
    okMessage: string,
    errorMessage: string
  ): void => {
    if (response.httpStatus === 200) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: okMessage,
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: 'info',
        summary: 'Info',
        detail: errorMessage,
        life: 3000,
      });
    }
  },

  /**
   * Displays a toast message based on the response status and severity.
   *
   * @param {Toast} toast - The toast reference (e.g., `toast.current`).
   * @param {ToastSeverity} severity - The severity of the toast message.
   * @param {string} title - The title of the toast message.
   * @param {string} message - The message to be shown in the toast.
   * @param {number} duration - The duration the toast is shown for.
   * @example
   * ToastInterpreterUtils.toastInterpreter(toast, response, 'success', 'Data saved successfully.');
   */
  toastInterpreter: (
    toast: React.RefObject<Toast>,
    severity: ToastSeverity = 'info',
    title: string = severity.charAt(0).toUpperCase() + severity.slice(1),
    message: string = '',
    duration: number = 3000
  ): void => {
    // Validate severity to ensure it matches one of the allowed values
    const allowedSeverities: ToastSeverity[] = [
      'success',
      'info',
      'warn',
      'error',
      'contrast',
      'secondary',
    ];
    if (!allowedSeverities.includes(severity)) {
      console.warn(
        `Invalid severity level: ${severity}. Defaulting to 'info'.`
      );
      severity = 'info';
    }

    // Show toast message based on the provided severity and message
    toast.current?.show({
      severity: severity,
      summary: title,
      detail: message,
      life: duration,
    });
  },
};
