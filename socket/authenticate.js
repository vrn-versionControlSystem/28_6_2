const jwt = require("jsonwebtoken");
let connectedUsers = {};

// {
//   user: {
//     user_id: '655fdab3-e539-4879-a99f-4aa1e85ee5bc',
//     name: 'Alock Mehata',
//     mobile: 7388327450,
//     status: true,
//     type: 'super-admin',
//     email: 'alock@gmail.com',
//     createdAt: '2024-02-03T16:04:23.000Z'
//   },
//   type: 'super-admin',
//   authority: [ 'super-admin' ],
//   iat: 1732275551,
//   exp: 1732361951
// }

const authSocketMiddleware = async (socket, next) => {
  const token =
    socket.handshake.auth?.token || socket.handshake.headers?.authorization;
  try {
    if (!token) {
      return false;
    }
    const tokenString = token?.split(" ")[1];
    const validToken = await jwt.verify(tokenString, process.env.PRIVATEKEY);
    if (validToken) {
      //connectedUsers={
      //655fdab3-e539-4879-a99f-4aa1e85ee5bc:{
      // socketId:1,
      // username:"abc",
      // userType:super-admin,
      // id:'655fdab3-e539-4879-a99f-4aa1e85ee5bc'
      // }
      // }
      connectedUsers[validToken.user.user_id] = {
        socketId: socket.id,
        username: validToken.user.name,
        userType: validToken.authority[0],
        id: validToken.user.user_id,
      };
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const getConnectedUsers = () => connectedUsers;

module.exports = { authSocketMiddleware, getConnectedUsers };
