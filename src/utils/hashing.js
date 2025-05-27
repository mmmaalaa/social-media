import bcrypt from "bcrypt";
export const hash = ({plaintext, rounds = Number(process.env.SALT_ROUNDS)})=>{
  return bcrypt.hashSync(plaintext, rounds)
}

export const compareHash = ({plaintext, hash})=>{
  return bcrypt.compareSync(plaintext, hash)
}