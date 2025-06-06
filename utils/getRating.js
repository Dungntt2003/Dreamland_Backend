async function updateRatingForModel(model) {
  const records = await model.findAll({
    where: {
      rate: null,
    },
  });

  for (const record of records) {
    const randomRating = parseFloat((Math.random() * 4 + 1).toFixed(1));

    record.rate = randomRating;
    await record.save();

    console.log(`Updated ${record.name}: rating=${randomRating}`);
  }
}

module.exports = updateRatingForModel;
