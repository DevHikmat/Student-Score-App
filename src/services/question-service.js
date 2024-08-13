import instance from "../config/axios";

export const QuestionService = {
  async addQuestion(formdata) {
    const response = await instance.post("/question", formdata);
    return response.data;
  },
  async getOneQuestion(id) {
    const response = await instance.get(`/question/${id}`);
    return response.data;
  },
  async updQuestion(id, formdata) {
    const response = await instance.put(`/question/${id}`, formdata);
    return response.data;
  },
  async delQuestion(id) {
    const response = await instance.delete(`/question/${id}`);
    return response.data;
  },
};
