import axios from 'axios';
export const BASE_URL = 'http://localhost:8000/childadmin';  // Replace with your actual API base URL
//export const BASE_URL = 'https://www.educandochildcare.com/childadmin';  // Replace with your actual API base URL
//export const BASE_URL = 'http://192.168.1.20:8000/childadmin';  // Replace with your actual API base URL


const makeRequest = async (url, method, endpoint, headers = {}, body, options = {}, withPayload = false) => {
  // Create headers for the request
  const myHeaders = {
    ...headers,
    Authorization: endpoint !== 'get-public-key' ? `Bearer ${localStorage.getItem('token')}` : undefined,
    'Content-Type': body instanceof FormData ? undefined : 'application/json',
  };

  body = body instanceof FormData ? body : JSON.stringify(body);

  const requestOptions = {
    ...options,
    mode: 'cors',
    method: method,
    headers: myHeaders,
    url: `${url}${endpoint}`,
    data: method === 'GET' && !withPayload ? null : body,
  };

  try {
    const response = await axios(requestOptions);
    
    if (response.status === 401) {
      window.location = '/info/session-expired';
      return { response: null, httpStatus: 401 };
    }

    return { response: response.data, httpStatus: response.status };
  } catch (error) {
    let errorData = { response: null, httpStatus: null };

    if (error.response) {
      errorData.httpStatus = error.response.status;

      if (error.response.status === 404) {
        console.error('Record not found:', error.response.data);
        errorData.response = error.response.data; // Error data for 404
      } else if (error.response.status === 401) {
        window.location = '/info/session-expired';
        return { response: null, httpStatus: 401 };
      } else {
        console.error(`Error ${error.response.status}:`, error.response.data);
        errorData.response = error.response.data; // General error data
      }
    } else {
      // Handle network errors or other unexpected errors
      console.error('Network or other error:', error.message);
      errorData.response = error.message;
    }

    // Optionally re-throw the error if needed for further handling
    throw errorData;
  }
};


const API = {
  get(url, endpoint, options, withPayload = false) {
    return makeRequest(url, 'GET', endpoint, null, {}, options, withPayload);
  },

  post(url, endpoint, body, options) {
    return  makeRequest(url, 'POST', endpoint, null, body, options, false);
  },

  put(url, endpoint, body, options) {
    return makeRequest(url, 'PUT', endpoint, null, body, options);
  },

  patch(url, endpoint, body, options) {
    return makeRequest(url, 'PATCH', endpoint, null, body, options);
  },

  delete(url, endpoint, options) {
    return makeRequest(url, 'DELETE', endpoint, null, null, options);
  },
};

export default API;
