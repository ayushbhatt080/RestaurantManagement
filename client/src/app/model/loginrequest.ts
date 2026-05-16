export interface LoginRequest {
  username: string;
  password: string;
  captchaToken: string;
}

export interface AssignManagerRequest {
 restaurantId:string;
user:number
}
