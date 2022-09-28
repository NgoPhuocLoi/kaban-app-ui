import axiosClient from './axiosClient';

const sectionApi = {
  create: (boardId: string) => {
    return axiosClient.post(`/board/${boardId}/section`);
  },
  update: (boardId: string, sectionId: string, params: any) =>
    axiosClient.put(`/board/${boardId}/section/${sectionId}`, params),
  delete: (boardId: string, sectionId: string) =>
    axiosClient.delete(`/board/${boardId}/section/${sectionId}`),
};

export default sectionApi;
