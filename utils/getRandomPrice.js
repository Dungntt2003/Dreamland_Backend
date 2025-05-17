function getRandomPriceEnter() {
  const randomPrice =
    Math.floor(Math.random() * (1000000 - 200000 + 1)) + 200000;

  return `${randomPrice.toLocaleString().replace(/,/g, ".")}đ`;
}

function getRandomRoomPrice() {
  const randomPrice =
    Math.floor(Math.random() * (2000000 - 600000 + 1)) + 600000;
  return randomPrice;
}

function getRandomMenuPrice() {
  const randomPrice =
    Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000;
  return randomPrice;
}

function getRandomPriceRange(min = 100000, max = 1000000) {
  const price1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const price2 = Math.floor(Math.random() * (max - min + 1)) + min;

  const lowerPrice = Math.min(price1, price2);
  const higherPrice = Math.max(price1, price2);

  return `${lowerPrice.toLocaleString().replace(/,/g, ".")} - ${higherPrice
    .toLocaleString()
    .replace(/,/g, ".")}`;
}

function getRandomPhoneNumber() {
  const prefixes = ["03", "09"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  let number = "";
  for (let i = 0; i < 8; i++) {
    number += Math.floor(Math.random() * 10);
  }

  return prefix + number;
}

function generateDishDescription(dishName) {
  const adjectives = [
    "ngon miệng",
    "hấp dẫn",
    "đậm đà",
    "béo ngậy",
    "thơm lừng",
    "chuẩn vị",
  ];
  const cookingStyles = [
    "truyền thống",
    "hiện đại",
    "đặc sản vùng miền",
    "tự nhiên",
    "theo phong cách gia đình",
    "phong cách fusion",
  ];
  const impressions = [
    "được nhiều thực khách yêu thích",
    "rất đáng thử",
    "khiến ai ăn cũng phải xuýt xoa",
    "làm hài lòng cả những vị khách khó tính",
    "là lựa chọn hoàn hảo cho bữa ăn sum vầy",
    "kết hợp tinh tế giữa hương vị và cách trình bày",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const style = cookingStyles[Math.floor(Math.random() * cookingStyles.length)];
  const impress = impressions[Math.floor(Math.random() * impressions.length)];

  return `${dishName} là món ăn ${adj}, được chế biến theo kiểu ${style}, ${impress}.`;
}

function getOpenHour(openingHoursStr) {
  const regex = /(\d{1,2})h\d{2}/g;
  const matches = [...openingHoursStr.matchAll(regex)].map((m) =>
    parseInt(m[1])
  );

  if (matches.length === 0) return null;

  return Math.min(...matches);
}

function getCloseHour(openingHoursStr) {
  const regex = /(\d{1,2})h\d{2}/g;
  const matches = [...openingHoursStr.matchAll(regex)].map((m) =>
    parseInt(m[1])
  );

  if (matches.length === 0) return null;

  return Math.max(...matches);
}

module.exports = {
  getRandomPriceEnter,
  getRandomRoomPrice,
  getRandomPriceRange,
  getRandomPhoneNumber,
  getRandomMenuPrice,
  generateDishDescription,
  getOpenHour,
  getCloseHour,
};
