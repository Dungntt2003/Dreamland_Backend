const express = require("express");
const router = express.Router();
const {
  getList,
  getDetail,
  insertNewDish,
  insertRes,
} = require("../controllers/restaurantController");
const upload = require("../middlewares/uploadImg");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getList);
router.get("/:id", authenticateToken, getDetail);
router.post("/", authenticateToken, upload.array("images", 5), insertRes);
router.post("/dish", authenticateToken, upload.single("image"), insertNewDish);

module.exports = router;
