const {
  updateUser,
  getUser,
  updateAva,
  updatePass,
} = require("../queries/userQuery");

const getUserInfo = async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  if (id != req.user.id) {
    return res.status(403).json({
      message: "Unauthorized to view other user's information",
    });
  } else if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    message: "OK",
    user: user,
  });
};

const updateUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    if (id != req.user.id)
      return res.status(403).json({
        message: "Unauthorized to update other user's information",
      });
    const userData = req.body;
    // console.log(userData);
    const count = await updateUser(id, userData);
    if (count > 0) {
      return res.status(200).json({
        message: "User information updated successfully",
      });
    } else
      return res.status(400).json({
        message: "Users not found or no changes made",
      });
  } catch (error) {
    return res.status(404).json({
      error:
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Đã xảy ra lỗi",
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (req.file) {
      const avatar = req.file.filename;
      const id = req.params.id;
      const count = await updateAva(id, avatar);
      if (count > 0) {
        return res.status(200).json({
          message: "Avatar updated successfully",
        });
      } else
        return res.status(400).json({
          message: "Users not found or no changes made",
        });
    } else
      return res.status(404).json({
        message: "No file uploaded",
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error:
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Error",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const id = req.params.id;
    const count = await updatePass(id, password);
    if (count > 0) {
      return res.status(200).json({
        message: "Password updated successfully",
      });
    } else
      return res.status(400).json({
        message: "Users not found or no changes made",
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error:
        error.errors && error.errors.length > 0
          ? error.errors[0].message
          : "Error",
    });
  }
};

module.exports = { updateUserInfo, getUserInfo, updateAvatar, updatePassword };
