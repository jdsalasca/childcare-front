import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SecurityService } from 'configs/storageUtils';


// Define the base URL for the API with fallback
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/childadmin';

// Alternative URLs for different environments:
// Production: 'https://www.educandochildcare.com/childadmin'
// Development: 'http://localhost:8000/childadmin'
// Define the types for the makeRequest function parameters
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RequestOptions = {
    params?: Record<string, any>; // Define as needed
    [key: string]: any; // Allow other options
};

export interface ApiResponse<T> {
  httpStatus: number;
  response: T;
}

export class ApiResponseModel<T = any> implements ApiResponse<T> {
    httpStatus: number;
    response: T;
    message: string | null;

    /**
     * Creates an instance of ApiResponseModel.
     * 
     * @param {number} httpStatus - The HTTP status code of the response.
     * @param {T} response - The response data.
     * @param {string | null} message - An optional message.
     */
    constructor(httpStatus: number, response: T, message: string);
    
    /**
     * Creates an instance of ApiResponseModel.
     * 
     * @param {number} httpStatus - The HTTP status code of the response.
     * @param {string | null} message - An optional message.
     */
    constructor(httpStatus: number, message: string);
    
    constructor(httpStatus: number, responseOrMessage?: T | string | null, message: string | null = null) {
        this.httpStatus = httpStatus;

        if (typeof responseOrMessage === 'string') {
            this.message = responseOrMessage;
            this.response = null as any; // or a default value if needed
        } else {
            this.message = message;
            this.response = responseOrMessage as T;
        }
    }
}
// Change the return type to have httpStatus as number | undefined
type ErrorData = {
    response: any;
    httpStatus?: number; // Allow httpStatus to be undefined
};

// Make the makeRequest method generic using <T>
const makeRequest = async <T>(
    url: string,
    method: HttpMethod,
    endpoint: string,
    headers: Record<string, string> = {},
    body?: any,
    options: RequestOptions = {},
    withPayload: boolean = false
): Promise<ApiResponse<T>> => {
    // Debug: Log the URL construction
    const fullUrl = `${url}${endpoint}`;

    // Create headers for the request
    const myHeaders: Record<string, string | undefined> = {
        ...headers,
        Authorization: endpoint !== 'get-public-key' ? `Bearer ${ SecurityService.getInstance().getDecryptedItem("token")}` : undefined,
        'Content-Type': body instanceof FormData ? undefined : 'application/json',
    };

    body = body instanceof FormData ? body : JSON.stringify(body);

    const requestOptions: AxiosRequestConfig = {
        ...options,
        method: method,
        headers: myHeaders,
        url: fullUrl,
        params: options.params, // Include params in the request options
        data: method === 'GET' && !withPayload ? null : body,
    };

    try {
        const response: AxiosResponse<T> = await axios(requestOptions);

        if (response.status === 401) {
            window.location.href = './session-expired';
            return { response: null, httpStatus: 401 } as ApiResponse<T>;
        }

        return { response: response.data, httpStatus: response.status } as ApiResponse<T>;
    } catch (error) {
        let errorData: ErrorData = { response: null, httpStatus: 404 }; // Initialize response to null, httpStatus is optional

        if (axios.isAxiosError(error) && error.response) {
            errorData.httpStatus = error.response.status; // This is where the error was occurring

            if (error.response.status === 404) {
                console.error('Record not found:', error.response.data);
                errorData.response = error.response.data; // Error data for 404
            } else if (error.response.status === 401) {
                window.location.href = './session-expired';
                return { response: null, httpStatus: 401 } as ApiResponse<T>;
            } else {
                console.error(`Error ${error.response.status}:`, error.response.data);
                errorData.response = error.response.data; // General error data
            }
        } else {
            // Handle network errors or other unexpected errors
            console.error('Network or other error:', error instanceof Error ? error.message : 'Unknown error');
            errorData.response = error instanceof Error ? error.message : 'Unknown error';
        }

        // Optionally re-throw the error if needed for further handling
        throw errorData;
    }
};

// API object now can infer the type <T> from the makeRequest
const API = {
    get<T>(url: string, endpoint: string, options: RequestOptions = {}, withPayload: boolean = false) {
        return makeRequest<T>(url, 'GET', endpoint, {}, {}, options, withPayload);
    },

    post<T>(url: string, endpoint: string, body: any, options?: RequestOptions) {
        return makeRequest<T>(url, 'POST', endpoint, {}, body, options);
    },

    put<T>(url: string, endpoint: string, body: any, options?: RequestOptions) {
        return makeRequest<T>(url, 'PUT', endpoint, {}, body, options);
    },

    patch<T>(url: string, endpoint: string, body: any, options?: RequestOptions) {
        return makeRequest<T>(url, 'PATCH', endpoint, {}, body, options);
    },

    delete<T>(url: string, endpoint: string, options?: RequestOptions) {
        return makeRequest<T>(url, 'DELETE', endpoint, {}, null, options);
    },
};

export default API;
