const {
  getDetail,
  getHotels,
  createNew,
  createNewRoom,
} = require("../controllers/hotelController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadImg");

router.get("/", getHotels);
router.get("/:id", getDetail);
router.post("/room", authenticateToken, upload.single("image"), createNewRoom);
router.post("/", authenticateToken, upload.array("images", 5), createNew);

module.exports = router;
