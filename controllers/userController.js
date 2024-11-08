const { createUser, checkUserExist } = require("../queries/userQuery");

const createNewUser = async (req, res) => {
  try {
    const userData = req.body;
    const business_info_front = req.files.front_image
      ? req.files.front_image[0].filename
      : null;
    const business_info_end = req.files.back_image
      ? req.files.back_image[0].filename
      : null;
    const ava = req.files.ava ? req.files.ava[0].filename : null;
    const newUser = await createUser(userData);
    if (newUser.message) {
      return res.status(400).json({ error: newUser.message });
    }
    res.status(200).json({
      message: "User created successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
        front_image: business_info_front
          ? `uploads/${business_info_front}`
          : null,
        back_image: business_info_end ? `uploads/${business_info_end}` : null,
        ava: ava ? `uploads/${ava}` : null,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error:
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Đã xảy ra lỗi",
    });
  }
};

const checkLogin = async (req, res) => {
  try {
    const userData = req.body;
    const userExist = await checkUserExist(userData);
    if (!userExist) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    } else
      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: {
          id: userExist.id,
          name: userExist.name,
          email: userExist.email,
          front_image: userExist.front_image
            ? `uploads/${userExist.front_image}`
            : null,
          back_image: userExist.back_image
            ? `uploads/${userExist.back_image}`
            : null,
          ava: userExist.ava ? `uploads/${userExist.ava}` : null,
          role: userExist.role,
        },
      });
  } catch (error) {
    res.status(400).json({
      error:
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Đã xảy ra lỗi",
    });
  }
};
module.exports = { createNewUser, checkLogin };
