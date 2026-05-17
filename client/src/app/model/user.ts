import { Order } from "./order";

export enum Role {
  CUSTOMER = 'CUSTOMER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: Role;
  orders:Order[];
}
