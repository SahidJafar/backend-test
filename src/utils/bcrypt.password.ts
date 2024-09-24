import bcrypt from "bcrypt"

export const hashPassword = async (password: string): Promise<string> => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err != null || err !== undefined) reject(err)
      resolve(hash)
    })
  })
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err != null || err !== undefined) reject(err)
      resolve(result)
    })
  })
}
