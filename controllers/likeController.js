const { createLike, unLike, getLikeList } = require("../queries/likeQuery");

const getList = async (req, res) => {
  try {
    const likes = await getLikeList(req.params.user_id);
    res.status(200).json({
      message: "Get list like with user",
      likes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const postLike = async (req, res) => {
  try {
    const like = await createLike(req.body);
    res.status(200).json({
      message: "Like created successfully",
      like,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteLike = async (req, res) => {
  try {
    await unLike(req.params.id);
    res.status(200).json({
      message: "Like deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { postLike, deleteLike, getList };
