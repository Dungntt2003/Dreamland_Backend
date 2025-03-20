const express = require("express");
const router = express.Router();
const {
  postLike,
  deleteLike,
  getList,
} = require("../controllers/likeController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/:user_id", authenticateToken, getList);
router.post("/", authenticateToken, postLike);
router.delete("/:id", authenticateToken, deleteLike);

module.exports = router;
