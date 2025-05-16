function getRandomPriceEnter() {
  const randomPrice =
    Math.floor(Math.random() * (1000000 - 200000 + 1)) + 200000;

  return `${randomPrice.toLocaleString().replace(/,/g, ".")}đ`;
}

module.exports = { getRandomPriceEnter };
