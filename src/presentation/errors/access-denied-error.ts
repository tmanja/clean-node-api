export class AccessDeniedErrror extends Error {
  constructor () {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}