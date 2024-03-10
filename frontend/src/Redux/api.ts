import { PaginatedResponse } from "../Utils/request/types";
import { Register, Task, User } from "../types/task";

/**
 * A fake function that returns an empty object casted to type T
 * @returns Empty object as type T
 */
export function Type<T>(): T {
  return {} as T;
}

export interface JwtTokenObtainPair {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IRegister {
  username: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
  passwordV2: string;
}

const routes = {
  // Auth Endpoints
  login: {
    method: "POST",
    path: "/api/v1/auth/login/",
    noAuth: true,
    TRes: Type<JwtTokenObtainPair>(),
    TBody: Type<LoginCredentials>(),
  },

  token_refresh: {
    path: "/api/v1/auth/token/refresh/",
    method: "POST",
    TRes: Type<JwtTokenObtainPair>(),
    TBody: Type<{ refresh: JwtTokenObtainPair["refresh"] }>(),
  },

  token_verify: {
    path: "/api/v1/auth/token/verify",
    method: "POST",
  },

  // User

  createUser: {
    method: "POST",
    noAuth: true,
    path: "/api/v1/users/register/",
    TRes: Type<Register>(),
  },

  // User
  currentUser: {
    path: "/api/v1/users/me/",
    TRes: Type<User>(),
  },

  deleteUser: {
    method: "DELETE",
    path: "/api/v1/users/{uuid}/",
    TRes: Type<Record<string, never>>(),
  },

  partialUpdateUser: {
    method: "PATCH",
    path: "/api/v1/users/{uuid}/",
    TRes: Type<User>(),
    TBody: Type<Partial<User>>(),
  },

  updateUser: {
    method: "PUT",
    path: "/api/v1/users/",
  },

  // Tasks

  createTask: {
    method: "POST",
    path: "/api/v1/tasks/",
    TBody: Type<Task>(),
    TRes: Type<Task>(),
  },

  getTasks: {
    method: "GET",
    path: "/api/v1/tasks/",
    TRes: Type<PaginatedResponse<Task>>(),
  },

  getTask: {
    method: "GET",
    path: "/api/v1/tasks/{uuid}/",
    TRes: Type<Task>(),
  },

  updateTask: {
    method: "PUT",
    path: "/api/v1/tasks/{uuid}/",
    TRes: Type<Task>(),
    TBody: Type<Partial<Task>>(),
  },

  deleteTask: {
    method: "DELETE",
    path: "/api/v1/tasks/{uuid}/",
    TRes: Type<Record<string, never>>(),
  },
} as const;

export default routes;
