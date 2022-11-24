const connection = require("../config/database");
const account = require("../middlewares/account");
const authen = require("../middlewares/authenJwt");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");

// lưu trữ các refresh token

let refreshTokenArr = [];
const AccountControllers = {
  //   [POST] /register
  register: async (req, res, next) => {
    const id = uuidv4();
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.json("điền thiếu thông tin rồi kìa");
    }
    const hashPassword = account.createPassword(req.body.password);

    let sql =
      "INSERT INTO user (idUser, username, password, email) VALUES (?, ?, ?, ?) ";

    connection.query(
      sql,
      [id, req.body.username, hashPassword, req.body.email],
      function (err, results) {
        if (err) {
          res.send("vui lòng nhập đầy đủ thông tin");
        }
        res.status(200).json("thêm user thành công");
      }
    );
  },

  //   [POST] /login
  login: async (req, res, next) => {
    const sql = "select * from user where user.username = ? limit 1";
    connection.query(sql, [req.body.username], (err, results) => {
      if (err) {
        throw err;
        // console.log("lỗi");
      }
      if (results[0]) {
        let checkPassword = account.checkPassword(
          req.body.password,
          results[0].password
        );

        const dataToken = {
          idUser: results[0].idUser,
          isAdmin: results[0].isAdmin,
        };

        // kiểm tra password sau khi hash và kiểm tra so vs DB
        if (
          checkPassword === true ||
          req.body.password === results[0].password
        ) {
          let accessToken = authen.createAccessToken(dataToken);
          let refreshToken = authen.createRefreshToken(dataToken);

          refreshTokenArr.push(refreshToken);

          let { password, ...orther } = results[0];
          // lưu refreshToken vào httpOnly
          // access token lưu vào redux-store và chỉ dùng cho api request
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // khi deloy thì sửa lại true
            secure: false,
            path: "/",
            sameSite: "strict",
          });

          return res.status(200).json({ ...orther, accessToken });
        } else {
          return res.status(403).json({ err: "sai mật khẩu" });
        }
      } else {
        return res.status(403).json({ err: "ko tìm thấy user" });
      }
    });
  },

  // [POST] /logout
  logout: (req, res) => {
    console.log("ck", req.cookies);
    res.clearCookie("refreshToken");
    refreshTokenArr = refreshTokenArr.filter(
      (token) => token !== req.cookies.refreshToken
    );

    res.json("logout thành công");
  },

  // [POST]  /refresh
  refreshToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res
        .status(401)
        .json("m chưa đăng nhập kìa, quay lại đăng nhập đi");
    }
    if (!refreshTokenArr.includes(refreshToken)) {
      return res.status(403).json("token này có gì đó sai sai");
    }
    // trả về user bao gồm id và isAmin đc giải mã từ token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY, (err, user) => {
      if (err) {
        return console.log("lỗi rồi kìa: ", err);
      }
      refreshTokenArr.filter((token) => token !== refreshToken);
      // rồi truyền user đó vào thằng dưới để tạo token mới
      const { idUser, isAdmin, ...rest } = user;
      const newAccessToken = authen.createAccessToken({ idUser, isAdmin });
      const newRefreshToken = authen.createRefreshToken({ idUser, isAdmin });
      refreshTokenArr.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        // khi deloy thì sửa lại true
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json(newAccessToken);
    });
  },

  // [PATCH] /update/user/:id
  updateUser(req, res, next) {
    // console.log("params: ", req.params);
    // console.log("body: : ", req.body);
    const {
      username,
      email,
      password,
      address,
      gender,
      nationally,
      phone,
      isAdmin,
      avatar,
    } = req.body;

    let sql = `UPDATE user
    SET user.username = ?, 
    user.email = ?,
    user.password = ?,
    user.phone = ?,
    user.address= ?,
    user.gender = ?,
    user.nationally = ?,
    user.isAdmin = ?,
    user.avatar =?
    WHERE user.idUser = ?;
    `;

    connection.query(
      `${sql}`,
      [
        username,
        email,
        password,
        phone,
        address,
        gender,
        nationally,
        isAdmin,
        avatar,
        req.params.id,
      ],

      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json("sửa user thành công");
      }
    );
  },
};

module.exports = AccountControllers;
