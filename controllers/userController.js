const { createUser, checkUserExist } = require("../queries/userQuery");
const bcrypt = require("bcrypt");

const createNewUser = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      business_info_front:
        req.files && req.files.front_image
          ? req.files.front_image[0].filename
          : null,
      business_info_end:
        req.files && req.files.back_image
          ? req.files.back_image[0].filename
          : null,
      ava: req.files && req.files.ava ? req.files.ava[0].filename : null,
    };

    const newUser = await createUser(userData);
    if (newUser.message) {
      return res.status(400).json({ error: newUser.message });
    }
    res.status(200).json({
      message: "User created successfully",
      data: {
        name: newUser.name,
        email: newUser.email,
        front_image: newUser.business_info_front
          ? `uploads/${newUser.business_info_front}`
          : null,
        back_image: newUser.business_info_end
          ? `uploads/${newUser.business_info_end}`
          : null,
        ava: newUser.ava ? `uploads/${newUser.ava}` : null,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
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
    if (!userExist)
      return res.status(400).json({ error: "Tài khoản không tồn tại" });

    const checkPassword = await bcrypt.compare(
      userData.password,
      userExist.password
    );
    if (!checkPassword)
      return res.status(400).json({
        error: "Mật khẩu không đúng",
      });
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
