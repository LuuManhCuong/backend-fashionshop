const connection = require("../config/database");
const authen = require("../middlewares/authenJwt");
const cloudinary = require("../config/cloudnary");

const { v4: uuidv4 } = require("uuid");

class BlogControllers {
  // [GET] /blog
  blog(req, res, next) {
    // authen.verifyToken()
    let sql = `SELECT *, DATE_FORMAT(blog.createAt, '%y/%m/%d') as timeCreate 
    FROM fashion_shop.blog 
    where blog.category = ? LIMIT 4 OFFSET ?`;

    let sql2 = `SELECT *, DATE_FORMAT(blog.createAt, '%y/%m/%d') as timeCreate 
    FROM fashion_shop.blog  
    ORDER BY blog.createAt DESC limit 3`;
    connection.query(
      `${sql}; ${sql2}`,
      [req.query.category, Number(req.query.page || 0)],
      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json(result);
      }
    );
  }

  // [GET] /blog/count
  countBlog(req, res, next) {
    // console.log(req.query.category);
    let sql = `SELECT COUNT(*) as total FROM fashion_shop.blog where blog.category = ?`;

    connection.query(`${sql}`, [req.query.category], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }

  // [POST] /blog
  async createBlog(req, res, next) {
    // console.log(req.body);

    const date = new Date();
    let getDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    // console.log(req.body);

    const { category, content, title, image, idAuthor, author } = req.body;

    const id = uuidv4();
    let sql = `INSERT INTO  blog 
    (idblog,title,content,category,createAt,image,idAuthor, author)
    value (?,?,?,?,?,?,?,?)`;

    connection.query(
      `${sql}`,
      [id, title, content, category, getDate, image, idAuthor, author],
      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json("");
      }
    );
  }

  // [GET] /blog/detail/:id
  blogDetail(req, res, next) {
    // console.log(req.query.category);
    let sql = `SELECT * FROM fashion_shop.blog where blog.idblog = ?`;

    connection.query(`${sql}`, [req.params.id], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }

  // [POST] /create/comment/()
  createComment(req, res, next) {
    const date = new Date();
    let getDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    // console.log(getDate);

    const id = uuidv4();
    let sql = `INSERT INTO fashion_shop.feedback 
    (
      feedback.id,
      feedback.idFeedback,
      feedback.idUser,
      feedback.comment, 
      feedback.createAt
      )
    VALUES (?, ?, ?, ?, ? )`;
    const { idUser, idFeedback } = req.query;

    connection.query(
      `${sql}`,
      [id, idFeedback, idUser, req.body.comment, getDate],
      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json("comment thanh cong!");
      }
    );
  }

  // [GET] /comment/:idFeedback
  getComment(req, res, next) {
    // console.log("idFeedback: ", req.params);
    let sql = `SELECT user.avatar, 
    user.username, 
    feedback.comment, 
    feedback.createAt,
    DATE_FORMAT(feedback.createAt, '%T %M %d %Y') as timeCreate
    FROM fashion_shop.feedback 
    inner join fashion_shop.user 
    on feedback.idUser=user.idUser 
    where idFeedback = ?
    order by createAt desc`;

    connection.query(`${sql}`, [req.params.idFeedback], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }
}

module.exports = new BlogControllers();
