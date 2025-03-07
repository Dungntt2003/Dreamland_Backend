const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const getProvinceFromURL = require("../utils/getProvince");

async function crawlData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let destinations = [];
    const province = getProvinceFromURL(url);
    $(".item_box_content_travel").each((i, element) => {
      const title = $(element)
        .find(".item_travel_content_title a")
        .text()
        .trim();
      const link = $(element).find(".item_travel_content_title a").attr("href");
      const description = $(element)
        .find(".item_travel_content_des")
        .text()
        .trim();
      const mainImage = $(element)
        .find(".item_box_content_travel_image img")
        .attr("src");

      let images = [];
      $(element)
        .find(".item_list_image_travel li img")
        .each((i, img) => {
          images.push($(img).attr("src"));
        });

      destinations.push({
        title,
        link,
        description,
        mainImage,
        images,
        province,
      });
    });

    return destinations;
  } catch (error) {
    console.error("❌ Lỗi khi crawl dữ liệu:", error.message);
    return [];
  }
}

async function getTravelLinks(mainUrl) {
  try {
    const { data } = await axios.get(mainUrl);
    const $ = cheerio.load(data);

    let travelLinks = [];

    $(".tab_item_content_you a").each((i, element) => {
      let href = $(element).attr("href");
      if (href) {
        travelLinks.push(href);
      }
    });

    console.log("📌 Danh sách URL địa điểm du lịch:", travelLinks);

    let allDestinations = [];

    // for (let link of travelLinks) {
    //   const destinations = await crawlData(link);
    //   console.log(destinations);
    //   allDestinations.push(...destinations);
    // }
    if (travelLinks.length > 0) {
      const firstLink = travelLinks[1];
      const destinations = await crawlData(firstLink);
      // console.log(destinations);
      allDestinations.push(...destinations);
    } else {
      console.log("Không có link nào trong travelLinks.");
    }

    console.log(
      "✅ Dữ liệu tổng hợp:",
      JSON.stringify(allDestinations, null, 2)
    );
    fs.writeFileSync(
      "./crawlData/travel_data.json",
      JSON.stringify(allDestinations, null, 2),
      "utf-8"
    );
    console.log("📁 Dữ liệu đã được lưu vào travel_data.json");
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách địa điểm:", error.message);
  }
}

async function crawlMenu(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let menu = [];

    $(".js_list_menu_res .item").each((i, element) => {
      const itemName = $(element)
        .find(".item_box_detail_menu_title p")
        .text()
        .trim();
      const image = $(element)
        .find(".item_box_detail_menu_img img")
        .attr("src")
        ?.trim();

      menu.push({ itemName, image });
    });

    console.log("Menu: " + menu);
    menu.forEach((item, index) => {
      console.log(`Món ${index + 1}:`);
      console.log(`- Tên: ${item.itemName}`);
      console.log(`- Ảnh: ${item.image}`);
    });
    return menu;
  } catch (error) {
    console.error(`Lỗi khi crawl menu từ ${url}:`, error.message);
    return [];
  }
}

async function crawlRestaurants(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let restaurants = [];

    const elements = $(".item_restaurant").toArray();

    restaurants = await Promise.all(
      elements.map(async (element) => {
        const name = $(element).find(".item_restaurant_title a").text().trim();
        const link = $(element).find(".item_restaurant_title a").attr("href");
        const mainImage = $(element).find(".js_hotel_img").attr("src");
        const address = $(element)
          .find(".js_item_home_hotel_address")
          .text()
          .trim();
        const rating =
          $(element).find(".rate-product").attr("data-rating") || "N/A";
        const association = $(element)
          .find(".item_home_res_group .group_left")
          .text()
          .trim();
        let images = [];
        $(element)
          .find(".js_box_list_image_detal img")
          .each((i, img) => {
            images.push($(img).attr("src"));
          });

        return {
          name,
          link,
          mainImage,
          address,
          rating,
          association,
          images,
        };
      })
    );

    console.log("Danh sách khách sạn & nhà hàng:", restaurants);
    return restaurants;
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
  }
}

async function crawlHotel(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let restaurants = [];

    const elements = $(".item_restaurant").toArray();

    restaurants = await Promise.all(
      elements.map(async (element) => {
        const name = $(element).find(".item_restaurant_title a").text().trim();
        const link = $(element).find(".item_restaurant_title a").attr("href");
        const mainImage = $(element).find(".js_hotel_img").attr("src");
        const address = $(element)
          .find(".js_item_home_hotel_address")
          .text()
          .trim();
        const rating =
          $(element).find(".rate-product").attr("data-rating") || "N/A";
        const association = $(element)
          .find(".item_home_res_group .group_left")
          .text()
          .trim();
        let images = [];
        $(element)
          .find(".js_box_list_image_detal img")
          .each((i, img) => {
            images.push($(img).attr("src"));
          });

        return {
          name,
          link,
          mainImage,
          address,
          rating,
          association,
          images,
        };
      })
    );

    console.log("Danh sách khách sạn & nhà hàng:", restaurants);
    return restaurants;
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
  }
}

async function crawlRoom(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Lấy thông tin của phòng đầu tiên
    const firstRoom = $(".row.item_list_room").first();

    const roomName = firstRoom.find(".list_room_right h3").text().trim();
    const mainImage = firstRoom.find(".js_hotel_img").attr("src")?.trim();
    const description = firstRoom.find(".item_list_room_des").text().trim();
    let additionalImages = [];
    firstRoom.find(".js_list_hotel_img_room").each((i, element) => {
      additionalImages.push($(element).attr("src")?.trim());
    });

    const roomType = firstRoom
      .find(".list_room_right p span")
      .first()
      .text()
      .replace("Loại phòng  :", "")
      .trim();
    const peopleCapacity = firstRoom
      .find(".fas.fa-user")
      .parent()
      .text()
      .trim();
    const bedCount = firstRoom
      .find(".fas.fa-bed")
      .parent()
      .text()
      .replace("Số giường  :", "")
      .trim();
    const roomSize = firstRoom.find(".far.fa-square").parent().text().trim();
    const roomDirection = firstRoom
      .find(".fas.fa-location-arrow")
      .parent()
      .text()
      .replace("Hướng :", "")
      .trim();

    const price = firstRoom
      .find(".item_room_value_price")
      .first()
      .text()
      .trim();

    // Đưa thông tin vào object
    const roomInfo = {
      roomName,
      description,
      mainImage,
      additionalImages,
      roomType,
      peopleCapacity,
      bedCount,
      roomSize,
      roomDirection,
      price,
    };

    console.log("Thông tin phòng:", JSON.stringify(roomInfo, null, 2));

    return roomInfo;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error.message);
  }
}
module.exports = {
  getTravelLinks,
  crawlRestaurants,
  crawlMenu,
  crawlHotel,
  crawlRoom,
};
