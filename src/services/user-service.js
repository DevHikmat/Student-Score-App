import instance from "../config/axios";

export const UserService = {
  async getStudents(page) {
    const response = await instance.get(`/user/student/${page}`);
    return response.data;
  },
  async getTeacher() {
    const response = await instance.get("/user/teacher/list");
    return response.data;
  },
  async updUser(id, formdata) {
    const response = await instance.put(`/user/${id}`, formdata);
    return response.data;
  },
  async delUser(id) {
    const response = await instance.delete(`/user/${id}`);
    return response.data;
  },
  async getGroupStudents(id) {
    const response = await instance.get(`/user/group/${id}`);
    return response.data;
  },
  async searchStudent(formdata) {
    const response = await instance.post(`/user/search/student`, formdata);
    return response.data;
  },
  async getSortedStudents() {
    const response = await instance.get(`/user/student/sort`);
    return response.data;
  },
};
