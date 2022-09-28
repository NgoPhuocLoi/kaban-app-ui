import axiosClient from './axiosClient';

interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
}
interface LoginParams {
  username: string;
  password: string;
}

const authApi = {
  login: (params: LoginParams) => axiosClient.post('/auth/login', params),
  register: (params: RegisterParams) =>
    axiosClient.post('/auth/register', params),
  verifyToken: () => axiosClient.post('/auth/verify-token'),
};

export default authApi;
