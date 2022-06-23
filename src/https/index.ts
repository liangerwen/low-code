import { IParams, parseUrlParams } from "../utils/query";

interface GetConfig {
  params: IParams;
  headers?: HeadersInit;
}

interface PostConfig {
  body: BodyInit;
  headers?: HeadersInit;
}

export default {
  get<T>(url: string, { params, headers }: GetConfig) {
    return fetch(parseUrlParams(url, params), {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }).then<T>((res) => res.json());
  },
  post<T>(url: string, { body, headers }: PostConfig) {
    return fetch(url, {
      body,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }).then<T>((res) => res.json());
  },
};
