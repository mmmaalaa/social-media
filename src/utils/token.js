import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      tokenVersion: user.tokenVersion || 0,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = ({ token, secretKey = process.env.JWT_ACCESS_SECRET }) => {
  return jwt.verify(token, secretKey);
};