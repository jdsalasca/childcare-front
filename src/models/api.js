import axios from 'axios';

const makeRequest = async (url, method, endpoint, headers = {}, body, options = {}, withPayload = false) => {
  // Create headers for the request
  const myHeaders = {
    ...headers,
    Authorization: endpoint !== 'get-public-key' ? `Bearer ${localStorage.getItem('token')}` : undefined,
    'Content-Type': body instanceof FormData ? undefined : 'application/json',
  };

  body = body instanceof FormData ? body : JSON.stringify(body);

  const requestOptions = {
    url: `${url}${endpoint}`,
    method: method,
    headers: myHeaders,
    data: method === 'GET' && !withPayload ? null : body,
    ...options,
  };

  try {
    const response = await axios(requestOptions);

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

  async post(url, endpoint, body, options) {
    return await makeRequest(url, 'POST', endpoint, null, body, options);
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
