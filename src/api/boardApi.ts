import { Board } from '../interface';
import axiosClient from './axiosClient';

interface UpdateParams {
  icon?: string;
  title?: string;
  description?: string;
}

const boardApi = {
  create: () => axiosClient.post('/board'),
  getAll: () => axiosClient.get('/board'),
  updatePosition: (params: { boards: Board[] }) =>
    axiosClient.put('/board', params),
  getOne: (id: string) => axiosClient.get(`/board/${id}`),
  update: (id: string, params: UpdateParams) =>
    axiosClient.put(`/board/${id}`, params),
  getFavourites: () => axiosClient.get('/board/favourites'),
  updateFavouritePosition: (params: { boards: Board[] }) =>
    axiosClient.put('/board/favourites', params),
  delete: (id: string) => axiosClient.delete(`/board/${id}`),
};

export default boardApi;
