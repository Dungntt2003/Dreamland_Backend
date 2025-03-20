const db = require("../models/index");

const getLikeList = async (userId) => {
  const likes = await db.Liked.findAll({
    where: {
      user_id: userId,
    },
  });
  return likes;
};

const createLike = async (likeData) => {
  const like = await db.Liked.create(likeData);
  return like;
};

const unLike = async (id) => {
  const like = await db.Liked.findByPk(id);
  if (!like) {
    throw new Error("Like not found");
  }
  await like.destroy();
  return like;
};

module.exports = { createLike, unLike, getLikeList };
