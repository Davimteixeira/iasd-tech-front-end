export interface User {
  readonly id?: number;
  email: string;
  password?: string;
}

export interface AuthResponse {
  readonly access: string;
  readonly refresh: string;
}
