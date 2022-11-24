const jwt = require("jsonwebtoken");

class authen {
  createAccessToken(data) {
    const accessToken = jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    return accessToken;
  }

  createRefreshToken(data) {
    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_TOKEN_KEY, {
      expiresIn: "365d",
    });
    return refreshToken;
  }

  verifyToken(req, res, next) {
    const token = req.headers.token;
    // console.log("token: ", token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
          res.status(403).json("token ko hợp lệ");
        } else {
          req.user = user;
          // console.log("user: ", user);
          next();
        }
      });
    } else {
      res.status(401).json("m chưa được xác thực, vui lòng thử lại");
    }
  }

  verifyAdmin(req, res, next) {
    const token = req.headers.token;
    // console.log("token: ", token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
          res.status(403).json("token ko hợp lệ");
        } else {
          req.user = user;
          // tự xóa tài khoản: check xem có phải id của mình hoặc admin ko
          if (req.user.idUser === req.params.id || req.user.isAdmin == 1) {
            // if (req.user.isAdmin == 1) {
            next();
          } else {
            res.status(403).json("m ko dc làm điều này");
          }
        }
      });
    } else {
      res.status(401).json("m chưa được xác thực, vui lòng thử lại");
    }
  }
}

module.exports = new authen();
