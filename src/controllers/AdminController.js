const connection = require("../config/database");
const authen = require("../middlewares/authenJwt");
const cloundinary = require("../config/cloudnary");
const { v4: uuidv4 } = require("uuid");

class AdminController {
  // [GET] /admin/
  adminUser(req, res, next) {
    // authen.verifyToken()
    let sql = `SELECT * FROM fashion_shop.user order by createAt desc  limit 10 offset ?`;
    connection.query(`${sql}`, [Number(req.query.page || 0)], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }

  // [GET] /admin/warehouse
  adminWarehouse(req, res, next) {
    // authen.verifyToken()
    let sql2 = `select * from product limit 10 offset ?`;

    connection.query(
      ` ${sql2}`,
      [Number(req.query.page || 0)],
      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json(result);
      }
    );
  }

  // [GET] /admin/count/user
  countUser(req, res, next) {
    let sql = `SELECT COUNT(*) as total FROM fashion_shop.user`;

    connection.query(`${sql}`, (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }

  // [GET] /admin/count/product
  countProduct(req, res, next) {
    let sql = `SELECT COUNT(*) as total FROM fashion_shop.product`;

    connection.query(`${sql}`, (err, result) => {
      err ? res.status(401).json("lỗi") : res.json(result);
    });
  }

  // [DELETE] /admin/delete/user/:${id}
  deleteUser(req, res, next) {
    // console.log("params: ", req.params);
    let sql = `DELETE FROM user where idUser = ? `;

    connection.query(`${sql}`, [req.params.id], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json("xóa user thành công");
    });
  }

  // [DELETE] /admin/delete/product/:${id}
  deleteProduct(req, res, next) {
    // console.log("params: ", req.params);
    let sql = `DELETE FROM product where idProduct = ? `;

    connection.query(`${sql}`, [req.params.id], (err, result) => {
      err ? res.status(401).json("lỗi") : res.json("xóa sản phẩm thành công");
    });
  }

  // [POST] /cloudinary-upload
  async uploadCloudinary(req, res, next) {
    try {
      let picture = req.body.picture;
      let imgPusher = [];
      if (picture) {
        for (let i = 0; i < picture.length; i++) {
          const result = await cloundinary.uploader.upload(picture[i], {
            folder: "imageProduct",
          });
          imgPusher.push(result.secure_url);
        }
      }

      let avatar = req.body.avatar;
      const avatarUrl = await cloundinary.uploader.upload(avatar[0], {
        folder: "imageProduct",
      });

      // console.log("pictures: ", imgPusher);
      // console.log("avatar: ", avatarUrl);

      res.json({ imgPusher, avatarUrl });
    } catch (error) {}
  }

  // [POST] /admin/add/product
  addProduct(req, res, next) {
    // console.log("data: ", req.body);
    const {
      name,
      price,
      sale,
      quantity,
      avatar,
      images,
      description,
      gender,
      category,
      color,
      size,
    } = req.body;
    const id = uuidv4();

    let sql = `INSERT INTO product (
      product.idProduct, product.name, product.avatar, product.category,
      product.color, product.description, product.gender,
      product.price, product.sale, product.quantity, product.size)
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
      ) `;

    let arr = [];
    images.map((img, i) => {
      let sql = ` INSERT INTO image_product
      (image_product.idImage, image_product.idProduct, image_product.url)
      VALUES  ("${id + i}", "${id}", "${img}")`;
      arr.push(sql);
    });

    let imageProduct = arr.join(";");

    connection.query(
      `${sql}; ${imageProduct}`,
      [
        id,
        name,
        avatar,
        category,
        color,
        description,
        gender,
        Number(price),
        Number(sale),
        Number(quantity),
        size,
      ],
      (err, result) => {
        err ? res.status(401).json("lỗi") : res.json(id);
      }
    );
  }
}

module.exports = new AdminController();
