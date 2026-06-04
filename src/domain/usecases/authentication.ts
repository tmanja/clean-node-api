export interface Credentials {
  email: string,
  password: string
}

export interface Authentication {
  auth (credentials: Credentials): Promise<string | null>
}
