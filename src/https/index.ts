import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "@/utils/auth";
import { Message } from "@arco-design/web-react";

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const {
      data: res,
      config: { baseURL },
      request: { responseURL },
    } = response;
    // 第三方公共api
    if (responseURL && !responseURL.startsWith(baseURL)) {
      return response;
    }
    // 自己的api
    if (res.code !== 20000) {
      Message.error({
        content: res.msg || "Error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.msg || "Error"));
    }
    return response;
  },
  (error) => {
    Message.error({
      content: error.msg || "Request Error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
