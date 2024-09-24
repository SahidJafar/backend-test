declare namespace Express {
  export interface Request {
    user: {
      id: string
      name: string
      email: string
      password: string
      token: string
      refresh_token: string
    }
  }
}
