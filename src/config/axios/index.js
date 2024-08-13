import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { ResponseError } from "./errors";

const instance = axios.create();

const onRequest = (config) => {
  const access_token = localStorage.getItem("token") || "";
  config.baseURL = `${BASE_URL}`;

  config.headers.Accept = "application/json";
  if (access_token) {
    config.headers.token = `${access_token}`;
  }
  return config;
};

const onRequestError = async (error) => {
  new ResponseError(error);
  return Promise.reject(error);
};

const onResponse = (response) => {
  return response;
};

const onResponseError = (error) => {
  new ResponseError(error);
  return Promise.reject(error);
};

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

export default instance;
