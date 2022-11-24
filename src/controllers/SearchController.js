const connection = require("../config/database");

class SearchController {
  // [/search]
  SearchProduct(req, res, next) {
    const keySearch = req.query.name;
    const size = req.query.size;
    // console.log("query: ", req.query);
    if (size == "less") {
      // render vào search
      let sql = `select* from product WHERE category LIKE '%${keySearch}%'  GROUP BY category LIMIT ${5}`;
      let sql2 = `select* from product WHERE name LIKE '%${keySearch}%' LIMIT ${3}`;
      connection.query(`${sql};${sql2}`, function (err, result) {
        err ? console.log(err) : res.json(result);
      });
    } else {
      // render vao product
      let sql = `select* from product WHERE name LIKE '%${keySearch}%' or category LIKE '%${keySearch}%' `;
      connection.query(sql, function (err, result) {
        err ? console.log(err) : res.json(result);
      });
    }
  }
}
module.exports = new SearchController();
