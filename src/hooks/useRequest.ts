import { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

/**
 * 调接口hook
 * @param api 接口
 * @param defaultValue 默认值
 * @param options 配置项
 * @returns loading, error, data, request
 */
export default function useRequest<T, U = any>(
  api: (params?: U) => Promise<AxiosResponse<T>>,
  defaultValue = [] as unknown as T,
  options: {
    immediate?: boolean;
    defaultArgs?: U;
    clearDataBeforeRequest?: boolean;
  } = { immediate: false, clearDataBeforeRequest: false }
) {
  const { immediate, defaultArgs, clearDataBeforeRequest } = options;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>(defaultValue);
  const [error, setError] = useState(null);

  const request = useCallback((params?: U) => {
    setLoading(true);
    if (clearDataBeforeRequest) {
      setData(defaultValue);
    }
    api(params)
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (immediate) {
      request(defaultArgs);
    }
  }, []);

  return { loading, error, data, request };
}
