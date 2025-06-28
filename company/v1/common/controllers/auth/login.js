const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../../../models/user.model");
const globalError = require("../../../../../errors/global.error");
const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY || "0123456789abcdef0123456789abcdef";

const decryptPassword = (encryptedPassword) => {
  console.log("Encrypted Password:", encryptedPassword);
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);

  console.log("Decrypted Password:", bytes.toString(CryptoJS.enc.Utf8));
  return bytes.toString(CryptoJS.enc.Utf8);
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user: { ...user },
      type: user.type,
      authority: [user.type],
    },
    process.env.PRIVATEKEY,
    { expiresIn: "1d" } // short-lived
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
    },
    process.env.PRIVATEKEY,
    { expiresIn: "7d" } // long-lived
  );
};

const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existUser = await User.findOne({
      where: { email, deleted: false },
      attributes: [
        "user_id",
        "name",
        "mobile",
        "status",
        "type",
        "email",
        "password",
        "createdAt",
      ],
    });

    if (!existUser) {
      return next(globalError(404, "User not found"));
    }
    req.user = existUser.toJSON();
    return next();
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

// const isPasswordValid = async (req, res, next) => {
//   try {
//     let isPasswordCorrect = await bcrypt.compare(
//       req.body.password,
//       req?.user.password
//     );
//     if (!isPasswordCorrect) {
//       return next(globalError(401, "Invalid Credentials"));
//     }
//     const {
//       // eslint-disable-next-line no-unused-vars
//       password,
//       ...otherData
//     } = req.user;
//     const token = jwt.sign(
//       {
//         user: { ...otherData },
//         type: otherData.type,
//         authority: [otherData.type],
//       },
//       process.env.PRIVATEKEY,
//       { expiresIn: "1d" }
//     );
//     res.status(200).json({
//       success: true,
//       token,
//       data: { ...otherData },
//       authority: [otherData.type],
//     });
//   } catch (error) {
//     return next(globalError(500, error.message));
//   }
// };

const isPasswordValid = async (req, res, next) => {
  try {
    const { password: storedPassword } = req.user;
    const { password: inputPassword } = req.body;

    let isPasswordCorrect = false;

    console.log("Stored Password:", storedPassword);

    if (storedPassword.startsWith("U2FsdGVk")) {
      const decryptedPassword = decryptPassword(storedPassword);
      isPasswordCorrect = inputPassword === decryptedPassword;
    } else {
      isPasswordCorrect = await bcrypt.compare(inputPassword, storedPassword);
    }

    if (!isPasswordCorrect) {
      return next(globalError(401, "Invalid Credentials"));
    }

    const { password, ...otherData } = req.user;
    const accessToken = generateAccessToken(otherData);
    const refreshToken = generateRefreshToken(otherData);

    // const token = jwt.sign(
    //   {
    //     user: { ...otherData },
    //     type: otherData.type,
    //     authority: [otherData.type],
    //   },
    //   process.env.PIRVATEKEY,
    //   { expiresIn: "1d" }
    // );

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
      data: { ...otherData },
      authority: [otherData.type],
    });
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.PRIVATEKEY);
    const newAccessToken = generateAccessToken({
      user_id: decoded.userId,
      type: decoded.type,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = { getUserByEmail, isPasswordValid, refreshToken };
