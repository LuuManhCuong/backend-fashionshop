const HomeControllers = require("../controllers/HomeControllers");
const AccountControllers = require("../controllers/AccountControllers");
const BlogController = require("../controllers/BlogController");
const ShopControllers = require("../controllers/ShopController");
const AdminController = require("../controllers/AdminController");
const SearchController = require("../controllers/SearchController");
const authenJwt = require("../middlewares/authenJwt");
const uploadCloud = require("../config/cloudnary");

function router(app) {
  app.route("/search").get(SearchController.SearchProduct);

  // account router
  app.route("/register").post(AccountControllers.register);
  app.route("/login").post(AccountControllers.login);
  app.route("/refresh").post(AccountControllers.refreshToken);
  app.route("/logout").post(authenJwt.verifyToken, AccountControllers.logout);
  app
    .route("/update/user/:id")
    .patch(authenJwt.verifyToken, AccountControllers.updateUser);

  // home router
  app.route("/").get(HomeControllers.home);
  app.route("/bestSale/").get(HomeControllers.bestSale);

  // shop / product router
  app.route("/shop").get(ShopControllers.shop);
  app.route("/shop/count").get(ShopControllers.countProduct);
  app.route("/shop/getPrice").get(ShopControllers.getPrice);
  app.route("/shop/detail/:id").get(ShopControllers.productDetail);
  app.route("/shop/detail/info/:id").get(ShopControllers.productDetailInfo);

  // cart router
  app.route("/cart/add/").post(authenJwt.verifyToken, ShopControllers.cartAdd);
  app
    .route("/cart/:idUser")
    .get(authenJwt.verifyToken, ShopControllers.getCart);
  app
    .route("/cart/delete/:idCart")
    .delete(authenJwt.verifyToken, ShopControllers.cartDelete);
  app
    .route("/cart/update/incart/:idProduct")
    .patch(authenJwt.verifyToken, ShopControllers.inCart);

  // blog router
  app.route("/blog").get(BlogController.blog).post(BlogController.createBlog);
  app.route("/blog/count").get(BlogController.countBlog);
  app.route("/blog/detail/:id").get(BlogController.blogDetail);

  // admin router
  app.route("/admin").get(authenJwt.verifyAdmin, AdminController.adminUser);
  app
    .route("/admin/count/user")
    .get(authenJwt.verifyAdmin, AdminController.countUser);
  app
    .route("/admin/delete/user/:id")
    .delete(authenJwt.verifyAdmin, AdminController.deleteUser);
  app
    .route("/admin/delete/product/:id")
    .delete(authenJwt.verifyAdmin, AdminController.deleteProduct);

  app
    .route("/admin/warehouse")
    .get(authenJwt.verifyAdmin, AdminController.adminWarehouse);
  app
    .route("/admin/count/product")
    .get(authenJwt.verifyAdmin, AdminController.countProduct);

  app
    .route("/admin/add/product")
    .post(authenJwt.verifyAdmin, AdminController.addProduct);

  app.route("/cloudinary-upload").post(AdminController.uploadCloudinary);

  // comment
  app
    .route("/create/comment")
    .post(authenJwt.verifyToken, BlogController.createComment);
  app.route("/comment/:idFeedback").get(BlogController.getComment);
  // add/delete user like vào bảng like_post
  app.route("/like").post(authenJwt.verifyToken, ShopControllers.like);
  app.route("/dislike").delete(authenJwt.verifyToken, ShopControllers.dislike);
  // increase/decrease trong bảng product
  app
    .route("/setlike/:idProduct")
    .patch(authenJwt.verifyToken, ShopControllers.setLike);

  // get all user liked accouding idProduct
  app
    .route("/like/:idProduct")
    .get(authenJwt.verifyToken, ShopControllers.getLike);

    // get all product mà user đã like
    app
    .route("/like/product/:idUser")
    .get(authenJwt.verifyToken, ShopControllers.getProductLiked);


  // * router
  app.route("*").get((req, res) => {
    res.status(400).json("t ko tìm thấy trang m muốn");
  });
}

module.exports = router;
