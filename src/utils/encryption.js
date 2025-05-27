import Crypto from "crypto-js";
export const encrypt = ({ data, secretKey = process.env.PHONE_SECRET }) => {
  return Crypto.AES.encrypt(data, secretKey).toString();
};

export const decrypt = ({ data, secretKey = process.env.PHONE_SECRET }) => {
  const bytes = Crypto.AES.decrypt(data, secretKey);
  return bytes.toString(Crypto.enc.Utf8);
};