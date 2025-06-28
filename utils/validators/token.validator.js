const jwt = require("jsonwebtoken");
const globalError = require("../../errors/global.error");

const jwtValidator = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return next(globalError(401, "You need to sign in!"));
    }

    const tokenString = token.split(" ")[1];

    const validToken = await jwt.verify(tokenString, process.env.PRIVATEKEY);
    if (validToken) {
      const currentServerTime = Math.floor(Date.now() / 1000);
      const tokenExpirationTime = validToken.exp;

      if (tokenExpirationTime < currentServerTime) {
        return next(globalError(401, "Your token has been expired"));
      } else {
        req.jwtTokenDecryptData = { ...validToken };
        return next();
      }
    } else {
      return next(globalError(401, "Sending invalid token"));
    }
  } catch (error) {
    return next(globalError(401, "Your token has been expired"));
  }
};

module.exports = jwtValidator;
