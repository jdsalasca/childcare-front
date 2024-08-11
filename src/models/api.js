import axios from 'axios';
//export const BASE_URL = 'localhost:8000';  // Replace with your actual API base URL
export const BASE_URL = 'https://www.educandochildcare.com/childadmin';  // Replace with your actual API base URL

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
    mode: "cors",
    method: method,
    headers: myHeaders,
    url: `${url}${endpoint}`,
    data: method === 'GET' && !withPayload ? null : body,
  };

  try {
    console.log("requestOptions", requestOptions);
   const response = await axios(requestOptions);
   //const response = await axios(`${url}${endpoint}`, body);

    if (response.status === 401) {
      window.location = '/info/session-expired';
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error during request:', error);
    throw error;
  }
};

const API = {
  get(url, endpoint, options, withPayload = false) {
    return makeRequest(url, 'GET', endpoint, null, {}, options, withPayload);
  },

  post(url, endpoint, body, options) {
    return  makeRequest(url, 'POST', endpoint, null, body, options);
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
