export interface CredentialModel {
  email: string,
  password: string
}

export interface Authentication {
  auth (credential: CredentialModel): Promise<string | null>
}
