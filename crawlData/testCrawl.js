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

        const menu = await crawlMenu(link);
        const resDetail = await crawlDetailRestaurant(link);

        return {
          name,
          link,
          mainImage,
          address,
          rating,
          association,
          images,
          menu,
          ...resDetail,
        };
      })
    );

    fs.writeFileSync(
      "./crawlData/restaurant_data.json",
      JSON.stringify(restaurants, null, 2),
      "utf-8"
    );
    console.log("Dữ liệu đã được lưu vào restaurant_data.json");
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
  }
}

const crawlDetailRestaurant = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const video = $(".mb_video_detail_detail iframe").attr("src") || "N/A";
    const descriptionText = $(".detail_menu_res_content").text().trim();
    const time = $(".box_detail_open_closed").text().trim();
    return {
      video,
      descriptionText,
      time,
    };
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
    return {};
  }
};

async function crawlHotel(urls) {
  try {
    let allRestaurants = [];

    for (const url of urls) {
      console.log(`🔍 Đang crawl dữ liệu từ: ${url}`);

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const elements = $(".item_restaurant").toArray();

      const restaurants = await Promise.all(
        elements.map(async (element) => {
          const name = $(element)
            .find(".item_restaurant_title a")
            .text()
            .trim();
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

          const detailInfo = await crawlDetailHotel(link);
          const roomInfo = await crawlRoom(link);

          return {
            name,
            link,
            mainImage,
            address,
            rating,
            association,
            images,
            ...detailInfo,
            roomInfo,
          };
        })
      );

      allRestaurants.push(...restaurants);
    }

    fs.writeFileSync(
      "./crawlData/hotel_data.json",
      JSON.stringify(allRestaurants, null, 2),
      "utf-8"
    );

    console.log("✅ Dữ liệu đã được lưu vào hotel_data.json");
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
  }
}

async function crawlDetailHotel(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const description = $("p.item_travel_content_des").text().trim();
    let utilities = [];
    $(".box_item_list_ben_item span.cutTitle").each((_, element) => {
      utilities.push($(element).text().trim());
    });

    const services = utilities.join(", ");
    const result = {
      description,
      services,
    };

    return result;
  } catch (error) {
    console.error("Lỗi khi crawl dữ liệu:", error.message);
  }
}

async function crawlRoom(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const rooms = $(".row.item_list_room")
      .map((_, element) => {
        const room = $(element);

        const roomName = room.find(".list_room_right h3").text().trim();
        const mainImage = room.find(".js_hotel_img").attr("src")?.trim();
        const description = room.find(".item_list_room_des").text().trim();

        let additionalImages = [];
        room.find(".js_list_hotel_img_room").each((i, el) => {
          additionalImages.push($(el).attr("src")?.trim());
        });

        const roomType = room
          .find(".list_room_right p span")
          .first()
          .text()
          .replace("Loại phòng  :", "")
          .trim();
        const peopleCapacity = room.find(".fas.fa-user").parent().text().trim();
        const bedCount = room
          .find(".fas.fa-bed")
          .parent()
          .text()
          .replace("Số giường  :", "")
          .trim();
        const roomSize = room.find(".far.fa-square").parent().text().trim();
        const roomDirection = room
          .find(".fas.fa-location-arrow")
          .parent()
          .text()
          .replace("Hướng :", "")
          .trim();

        const price = room.find(".item_room_value_price").first().text().trim();

        return {
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
      })
      .get();

    return rooms;
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
  crawlDetailHotel,
};
