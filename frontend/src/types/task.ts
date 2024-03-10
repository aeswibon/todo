export interface User {
  id?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export type statusType = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  uuid?: string;
  title?: string;
  description?: string;
  due_date?: string;
  status?: statusType;
}
