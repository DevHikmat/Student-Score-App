import instance from "../config/axios";

export const QuizService = {
  async addQuiz(formdata) {
    const response = await instance.post("/quiz", formdata);
    return response.data;
  },
  async getAll() {
    const response = await instance.get("/quiz");
    return response.data;
  },
  async getOne(id) {
    const response = await instance.get(`/quiz/${id}`);
    return response.data;
  },
  async delQuiz(id) {
    const response = await instance.delete(`/quiz/${id}`);
    return response.data;
  },
  async updQuiz(id, formdata) {
    const response = await instance.put(`/quiz/${id}`, formdata);
    return response.data;
  },
  async getExamQuiz(id) {
    const response = await instance.get(`/quiz/exam/${id}`);
    return response.data;
  },
};
