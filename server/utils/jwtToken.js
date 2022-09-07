const jwt = require("jsonwebtoken");

const generateTokens = {
  accessToken: (payload) => {
    return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
      expiresIn: "1h",
    });
  },

  refreshToken: (payload) => {
    return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
      expiresIn: "1d",
    });
  },
};

module.exports = generateTokens;
