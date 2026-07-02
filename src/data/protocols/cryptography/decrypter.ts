export interface Decrypter {
  decrypt (encryptedValue: string): string | null
}