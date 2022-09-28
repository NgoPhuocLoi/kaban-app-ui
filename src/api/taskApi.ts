import { Task } from '../interface';
import axiosClient from './axiosClient';

interface UpdateTaskPositionParams {
  sourceList: Task[];
  desList: Task[];
  sourceSectionId: string;
  desSectionId: string;
}

const taskApi = {
  create: (boardId: string, sectionId: string) =>
    axiosClient.post(`/board/${boardId}/task`, { sectionId }),
  updatePosition: (boardId: string, params: UpdateTaskPositionParams) =>
    axiosClient.put(`/board/${boardId}/task/update-position`, params),
  update: (boardId: string, taskId: string, params: any) =>
    axiosClient.put(`/board/${boardId}/task/${taskId}`, params),
  delete: (boardId: string, taskId: string) =>
    axiosClient.delete(`/board/${boardId}/task/${taskId}`),
};

export default taskApi;
