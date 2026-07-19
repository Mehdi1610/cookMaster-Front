import { UserResponse } from "./userResponse.model";
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}