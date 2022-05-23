export interface ITodo {
  id: number;
  title: string;
  description: string;
  status: string;
  user_id: number;
  due_time: string;
}

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  firstname: string;
  created_at: string;
}
