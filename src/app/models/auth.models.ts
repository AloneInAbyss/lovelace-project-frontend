export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  identity: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
  message?: string;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errors?: { [key: string]: string };
}
