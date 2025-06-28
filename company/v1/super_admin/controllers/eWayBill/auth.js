const axios = require("axios");
const globalError = require("../../../../../errors/global.error");
const crypto = require("crypto-js");
const fs = require("fs");
const publicKeyFilePath = "<Path to your public key file>";

function getPublicKey(filePath) {
  try {
    const publicKey = fs.readFileSync(filePath, "utf-8");
    const publicKeyPEM = publicKey
      .replace(/^-----BEGIN PUBLIC KEY-----\n/, "")
      .replace(/-----END PUBLIC KEY-----\n$/, "");
    const keyBytes = Buffer.from(publicKeyPEM, "base64");
    return crypto.createPublicKey({
      key: keyBytes,
      format: "der",
      type: "spki",
    });
  } catch (error) {
    console.error("Error reading public key:", error);
    return null;
  }
}

function encryptWithPublicKey(data, publicKey) {
  try {
    return crypto
      .publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(data, "utf8")
      )
      .toString("base64");
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
}

function createAESKey() {
  try {
    const secret = crypto.randomBytes(16);
    const appKey = Buffer.from(secret, "binary");
    return appKey;
  } catch (error) {
    console.error("Error generating AES key:", error);
    return null;
  }
}

// function decryptBySymmetricKeySEK(encryptedSek, appKey) {
//     try {
//         // Decode the base64-encoded encrypted SEK
//         const encryptedSekBytes = Buffer.from(encryptedSek, 'base64');

//         // Create AES key from the provided appKey
//         const aesKey = Buffer.from(appKey, 'base64');

//         // Decrypt the encrypted SEK using AES
//         const decipher = crypto.createDecipheriv('aes-128-ecb', aesKey, '');
//         let decryptedSekBytes = decipher.update(encryptedSekBytes, null, 'binary');
//         decryptedSekBytes += decipher.final('binary');

//         // Encode the decrypted SEK as base64
//         const decryptedSek = Buffer.from(decryptedSekBytes, 'binary').toString('base64');

//         return decryptedSek;
//     } catch (error) {
//         console.error("Error decrypting SEK:", error);
//         return null;
//     }
// }

const eWayAuth = async (req, res, next) => {
  try {
    const { user_name, password, client_id, client_secret, gst_in } = req.body;

    const publicKey = getPublicKey(publicKeyFilePath);
    if (!publicKey) {
      throw new Error("Public key not found or invalid.");
    }

    const encryptedPassword = encryptWithPublicKey(password, publicKey);
    if (!encryptedPassword) {
      throw new Error("Failed to encrypt password.");
    }

    const appKey = createAESKey();
    const encryptedAppKey = encryptWithPublicKey(appKey, publicKey);
    if (!encryptedAppKey) {
      throw new Error("Failed to encrypt app key.");
    }

    const payload = {
      action: "ACCESSTOKEN",
      user_name,
      password: encryptedPassword,
      app_key: encryptedAppKey,
    };

    const payloadJson = JSON.stringify(payload);

    const credentialsBase64 = Buffer.from(payloadJson).toString("base64");

    const encryptedPayload = encryptWithPublicKey(credentialsBase64, publicKey);
    if (!encryptedPayload) {
      throw new Error("Failed to encrypt payload.");
    }

    const response = await axios.post(
      url,
      { data: encryptedPayload },
      {
        headers: {
          "client-id": client_id,
          "client-secret": client_secret,
          gstin: gst_in,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;
    if (responseData.status === "1") {
      const authtoken = responseData.authtoken;
      // console.log("Authentication Token:", authtoken);
      return res.status(200).json({ data: authtoken });
    } else {
      return next(globalError(500, responseData.error));
    }
  } catch (error) {
    return next(globalError(500, error.message));
  }
};

module.exports = { eWayAuth };
