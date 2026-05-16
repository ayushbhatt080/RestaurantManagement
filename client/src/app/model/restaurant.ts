import { MenuItem } from './menu-item';
import { User } from './user';

export interface Restaurant {
  
  id:number;

  name:string;

  location:string;

  address:string;

  cusine:string;

  email:string;

  phoneNumber:number;

  phNumber?: number;

  manager?: User;

  menuItems: MenuItem[];
}
