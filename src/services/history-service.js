import instance from "../config/axios";

export const HistoryService = {
  async addHistory(formdata) {
    const response = await instance.post(`/history`, formdata);
    return response.data;
  },
  async updHistory(id, formdata) {
    const response = await instance.put(`/history/${id}`, formdata);
    return response.data;
  },
  async delHistory(id) {
    const response = await instance.delete(`/history/${id}`);
    return response.data;
  },
};
