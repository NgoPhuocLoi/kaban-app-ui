import axios from 'axios';
import queryString from 'query-string';

// const baseUrl = 'http://localhost:5000/api/v1';
const baseUrl = 'https://klaban-app.herokuapp.com/api/v1';
const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${getToken()}`,
    },
  };
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (!err.response) {
      alert(err);
    }
    throw err.response;
  },
);

export default axiosClient;
