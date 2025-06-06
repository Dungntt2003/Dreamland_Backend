const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const currentDate = new Date();
    const datePrefix = currentDate
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    const uniqueSuffix = datePrefix + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
