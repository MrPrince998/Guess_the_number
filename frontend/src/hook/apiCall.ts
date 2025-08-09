import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

// Enhanced interfaces for better type safety
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
}

// Generic payload interface
interface ApiPayload {
  [key: string]: any;
}

// Token management
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Axios instance with better configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_BACKEND_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// GET Hook with better error handling
export const useGet = <T>(
  key: string | string[],
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
): UseQueryResult<T, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<T>>(url);
      return response.data.data || (response.data as T);
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });
};

// POST/PUT/DELETE Hook with better typing
export const useMutationApi = <TData = unknown, TVariables = ApiPayload>(
  method: "post" | "put" | "delete" | "patch",
  url: string,
  options?: {
    invalidateKeys?: string[];
    onSuccessCallback?: (data: TData) => void;
    onErrorCallback?: (error: AxiosError<ApiError>) => void;
  }
): UseMutationResult<TData, AxiosError<ApiError>, TVariables> => {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: async (data?: TVariables) => {
      let response;

      switch (method) {
        case "post":
          response = await axiosInstance.post<ApiResponse<TData>>(url, data);
          break;
        case "put":
          response = await axiosInstance.put<ApiResponse<TData>>(url, data);
          break;
        case "patch":
          response = await axiosInstance.patch<ApiResponse<TData>>(url, data);
          break;
        case "delete":
          response = await axiosInstance.delete<ApiResponse<TData>>(url);
          break;
        default:
          throw new Error(`Invalid method: ${method}`);
      }

      return response.data.data as TData;
    },
    onSuccess: (data) => {
      // Invalidate queries
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      // Custom success callback
      options?.onSuccessCallback?.(data);
    },
    onError: (error) => {
      console.error(`${method.toUpperCase()} request failed:`, error);
      options?.onErrorCallback?.(error);
    },
  });
};

// Simplified wrapper hooks
export const PostHook = <TData = unknown, TVariables = ApiPayload>(
  method: "post" | "put" | "delete" | "patch",
  url: string,
  key?: string[]
) => {
  return useMutationApi<TData, TVariables>(method, url, {
    invalidateKeys: key,
  });
};

export const GetHook = <T>(
  key: string | string[],
  url: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  return useGet<T>(key, url, options);
};

// Export utilities
export { axiosInstance };

export const getErrorMessage = (error: AxiosError<ApiError>): string => {
  return error.response?.data?.message || error.message || "An error occurred";
};
