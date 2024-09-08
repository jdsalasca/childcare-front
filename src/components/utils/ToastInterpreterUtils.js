import { useRef } from 'react'
import { ApiModels } from '../../models/ApiModels'
/**
 * This class provides methods for interpreting toast messages based on the response data.
 */
export const ToastInterpreterUtils = {
  toastBackendInterpreter: (
    toast,
    response = ApiModels.defaultResponseModel,
    okMessage,
    errorMessage
  ) => {
    if (response.httpStatus === 200) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: okMessage,
        life: 3000
      })
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      })
    }
  },
      /**
     * Displays a toast message based on the response status and severity.
     * 
     * @param {Object} toast - The toast reference (e.g., `toast.current`).
     * @param {string} severity - The severity of the toast message ('success', 'info', 'warn', or 'error').
     * @param {string} message - The message to be shown in the toast.
     * @example
     * ToastInterpreterUtils.toastInterpreter(toast, response, 'success', 'Data saved successfully.');
     */
      toastInterpreter: (toast, severity = 'info', message = '', duration = 3000) => {
        // Validate severity to ensure it matches one of the allowed values
        const allowedSeverities = ['success', 'info', 'warn', 'error'];
        if (!allowedSeverities.includes(severity)) {
            console.warn(`Invalid severity level: ${severity}. Defaulting to 'info'.`);
            severity = 'info';
        }

        // Show toast message based on the provided severity and message
        toast.current.show({
            severity: severity,
            summary: severity.charAt(0).toUpperCase() + severity.slice(1), // Capitalize first letter
            detail: message,
            life: duration
        });
    }

  
}
