import instance from "../config/axios";

export const GroupService = {
  async addGroup(formdata) {
    const response = await instance.post("/group", formdata);
    return response.data;
  },
  async getAll() {
    const response = await instance.get("/group");
    return response.data;
  },
  async updGroup(grId, formdata) {
    const response = await instance.put(`/group/${grId}`, formdata);
    return response.data;
  },
  async delGroup(grId) {
    const response = await instance.delete(`/group/${grId}`);
    return response.data;
  },
};
