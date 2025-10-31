export interface RegisterResponse {
  username: string;
  email: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}
