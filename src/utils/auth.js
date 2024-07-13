import API from "../models/api.js";

// src/utils/auth.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const login = async (username, password) => {
  try {
    console.log('Attempting login with:', username, password);
    const body = { username, password };
    const response =  true || API.post(API_BASE_URL, '/users/login', body);

    console.log('Response:', response);


    let data =  response;
    data.status = 200
    data.token= "mokedToken"
    if (data.status === 401) {
      console.error('Login failed:', data);
      throw new Error('Login failed');
    } else {
      console.log('Login data:', data);
      const { token } = data;
      return token;
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
