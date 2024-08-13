import instance from "../config/axios";

export const AuthService = {
  async login(userInfo) {
    const response = await instance.post("/auth/login", userInfo);
    return response.data;
  },
  async signup(userInfo) {
    const response = await instance.post("/auth/signup", userInfo);
    return response.data;
  },
  async getInfo(myId) {
    const response = await instance.get(`/user/${myId}`);
    return response.data;
  },
};
