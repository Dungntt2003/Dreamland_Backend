const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const getProvinceFromURL = require("../utils/getProvince");
const { chromium } = require("playwright");
async function crawlReactHotelPage(url) {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  await page.waitForTimeout(5000);

  const elements = await page.$$("a[data-selenium='all-states-link']");
  console.log(`🔍 Tìm thấy ${elements.length} link`);

  if (elements.length === 0) {
    console.error("❌ Không tìm thấy link nào!");
    await browser.close();
    return [];
  }

  const regionLinks = await page.$$eval(
    "a[data-selenium='all-states-link']",
    (links) =>
      links.map((link) => `https://www.agoda.com/${link.getAttribute("href")}`)
  );

  console.log("✅ Danh sách link:", regionLinks);
  await browser.close();
}

async function getHotelReactLink(url) {
  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForSelector('[data-selenium="hotel-card-property-name"] a');

  const hotelLinks = await page.$$eval(
    '[data-selenium="hotel-card-property-name"] a',
    (links) => links.map((link) => link.href)
  );

  const chunks = hotelLinks.slice(0, 5); // Giới hạn 5 khách sạn đầu tiên để test

  const results = await Promise.allSettled(
    chunks.map((url) => crawlReactHotelData(url))
  );

  const allHotelData = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  fs.writeFileSync(
    "./crawlData/hotel_react_data.json",
    JSON.stringify(allHotelData, null, 2),
    "utf-8"
  );
  console.log("Dữ liệu đã được lưu vào hotel_react_data.json");
  await browser.close();
}

async function crawlReactHotelData(url) {
  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForTimeout(5000);

  const imageUrls = await page.$$eval(
    'img[title="Khách sạn Cochin Zen (Cochin Zen Hotel)"]',
    (imgs) => imgs.map((img) => img.getAttribute("src")).filter(Boolean)
  );
  const images = imageUrls.map((img) => `https:${img}`);
  const name = await page.$eval('h1[data-selenium="hotel-header-name"]', (el) =>
    el.textContent.trim()
  );
  const ratingText = await page.$eval(
    'span[data-element-name="mosaic-hotel-rating-container"]',
    (el) => el.getAttribute("aria-label")
  );
  const ratingNumber = ratingText ? ratingText.match(/\d+/)[0] : null;
  const address = await page.$eval(
    'span[data-selenium="hotel-address-map"]',
    (el) => el.textContent.trim()
  );
  const description = await page.$eval("p.fHvoAu", (el) =>
    el.textContent.trim()
  );
  const highlights = await page.$$eval(
    '[data-element-name="property-top-feature"]',
    (items) =>
      items
        .map((el) => {
          const pTag = el.querySelector("p");
          return pTag?.innerText.trim();
        })
        .filter(Boolean)
  );
  const facilities = await page.$$eval(
    '[data-element-name="atf-top-amenities-item"]',
    (items) =>
      items
        .map((el) => {
          const pTag = el.querySelector("p");
          return pTag?.innerText.trim();
        })
        .filter(Boolean)
  );

  const rooms = await page.$$eval(".room", (roomNodes) => {
    return roomNodes.map((room) => {
      const image = room
        .querySelector(".room-image-holder img")
        ?.getAttribute("src");

      const fullImageUrl = image?.startsWith("//") ? "https:" + image : image;
      const name = room
        .querySelector(".room-name-with-ellipsis > div")
        ?.innerText.trim();

      const amenitySpans = room.querySelectorAll(
        ".room-amenities-list .room-amenitylist-item span"
      );
      const amenities = Array.from(amenitySpans).map((span) =>
        span.innerText.trim()
      );

      return { fullImageUrl, name, amenities };
    });
  });

  await browser.close();
  return {
    images,
    name,
    ratingNumber,
    address,
    description,
    highlights,
    facilities,
    rooms,
  };
}

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

async function crawlRestaurants(urls) {
  try {
    let allRestaurants = [];

    for (const url of urls) {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      let restaurants = [];

      const elements = $(".item_restaurant").toArray();

      const pageRestaurants = await Promise.all(
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

      allRestaurants = allRestaurants.concat(pageRestaurants);
    }

    fs.writeFileSync(
      "./crawlData/restaurant_data.json",
      JSON.stringify(allRestaurants, null, 2),
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

async function crawlEnters(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const enterLinks = [];
    const detailLinks = [];
    const detailData = [];
    $(".bpt-sub-menu-content-2 a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        enterLinks.push(href);
      }
    });
    $(".dropdown-menu a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        enterLinks.push(href);
      }
    });
    for (const link of enterLinks) {
      const links = await getDetailEnterLinks(
        `https://www.bestprice.vn${link}`
      );
      detailLinks.push(...links);
    }
    for (const link of detailLinks) {
      const data = await crawlDetailEnter(`https://www.bestprice.vn${link}`);
      if (data) {
        detailData.push(data);
      }
    }
    fs.writeFileSync(
      "./crawlData/entertainment_data.json",
      JSON.stringify(detailData, null, 2),
      "utf-8"
    );
    console.log("Dữ liệu đã được lưu vào entertainment_data.json");
  } catch (error) {
    console.log(error.message);
  }
}

async function getDetailEnterLinks(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const detailLinks = [];
    $(".mktnd_txt_productname a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        detailLinks.push(href);
      }
    });
    return detailLinks;
  } catch (error) {
    console.log(error.message);
  }
}

async function crawlDetailEnter(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const images = [];
    $(".photo-slider .item img").each((index, element) => {
      images.push($(element).attr("src"));
    });
    const placeName = $(".title-detail h1").text().trim();

    const address = $(".address").text().trim();

    let price =
      $(".ticket-des-button div span span").text().trim() ||
      "Chưa có thông tin";

    const services = [];
    $(".list-highlight .highlight-item p").each((index, element) => {
      services.push($(element).text().trim());
    });
    return {
      placeName,
      address,
      price,
      images,
      services,
    };
  } catch (error) {
    console.log(error.message);
  }
}

async function crawlGeneral(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { timeout: 60000 });
  await page.waitForLoadState("networkidle");

  const content = await page.content();
  console.log(content);
  fs.writeFileSync("./crawlData/output.html", content, "utf-8");

  console.log("✅ Đã lưu nội dung vào output.html");
  await browser.close();
}
module.exports = {
  crawlRestaurants,
  crawlMenu,
  crawlHotel,
  crawlRoom,
  crawlReactHotelData,
  crawlDetailHotel,
  crawlReactHotelPage,
  crawlEnters,
  crawlGeneral,
  getHotelReactLink,
};
