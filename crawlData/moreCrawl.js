const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const puppeteer = require("puppeteer");

const slugify = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processInBatches = async (items, batchSize, callback) => {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(callback));
    console.log(`Processed batch ${i / batchSize + 1}`);
    await sleep(1000); // nghỉ 1s giữa các batch (cho an toàn)
  }
};

function cleanText(text) {
  if (!text) return "";

  let cleaned = text.replace(/[\t\n\r]+/g, " ").trim();

  const parts = cleaned.split(/\s+/).filter((part) => part.length > 0);

  const uniqueParts = [];
  const seen = new Set();

  for (const part of parts) {
    const cleanPart = part.toLowerCase();
    if (!seen.has(cleanPart)) {
      seen.add(cleanPart);
      uniqueParts.push(part);
    }
  }

  return uniqueParts.join(" ");
}

function cleanRoomInfo(text) {
  if (!text) return "";

  let cleaned = text.replace(/[\t\n\r]+/g, " ").trim();

  const parts = cleaned
    .split(/\s{3,}/)
    .filter((part) => part.trim().length > 0);

  if (parts.length > 1) {
    return parts.reduce((shortest, current) =>
      current.trim().length < shortest.trim().length
        ? current.trim()
        : shortest.trim()
    );
  }

  return cleaned;
}

/**
 * Lấy danh sách link khách sạn từ trang chủ
 * @param {string} url - URL trang chủ
 */
async function getLinkHotel(url) {
  try {
    const allResults = [];
    console.log(`🔍 Đang tìm liên kết khách sạn từ: ${url}`);
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const block = $(".block-link").filter(
      (_, el) => $(el).find("h3").text().trim() === "Khách sạn trong nước"
    );

    if (!block.length) {
      console.warn("⚠️ Không tìm thấy khối 'Khách sạn trong nước'");
      return;
    }

    const hrefs = [];
    block.find("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        hrefs.push(`https://www.bestprice.vn${href}`);
      }
    });

    console.log(`✅ Đã tìm thấy ${hrefs.length} liên kết danh mục khách sạn`);

    for (const url of hrefs) {
      try {
        const results = await getDetailLinkHotel(url);
        if (Array.isArray(results)) {
          allResults.push(...results);
        } else {
          console.warn(`Kết quả không hợp lệ từ ${url}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý ${url}:`, error.message);
      }
    }
    fs.writeFileSync(
      "./crawlData/hotels.json",
      JSON.stringify(allResults, null, 2),
      "utf-8"
    );
    console.log("✅ Đã lưu dữ liệu vào hotels.json");
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách khách sạn: ${error.message}`);
  }
}

/**
 * Lấy danh sách chi tiết khách sạn từ trang danh sách
 * @param {string} url - URL trang danh sách khách sạn
 */
async function getDetailLinkHotel(url) {
  console.log(`🔍 Đang xử lý trang danh sách: ${url}`);
  const results = [];
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();

      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log(`   ⏳ Đang tải trang ${url}`);
    await page.goto(url, {
      timeout: 120000, // Tăng timeout lên 120 giây
      waitUntil: "domcontentloaded", // Chờ nhẹ nhàng hơn networkidle2
    });

    let loadMoreCount = 0;
    let noMoreButtonRetries = 0;
    const MAX_LOAD_MORE_ATTEMPTS = 3;

    while (true) {
      try {
        const moreButtonExists = await page.evaluate(() => {
          const button = document.querySelector(".btn-more-list");
          return button && button.offsetParent !== null; // Kiểm tra nút có thấy được không
        });

        if (!moreButtonExists) {
          noMoreButtonRetries++;
          console.log(
            `   ⚠️ Không tìm thấy nút "Xem thêm" (${noMoreButtonRetries}/${MAX_LOAD_MORE_ATTEMPTS})`
          );

          if (noMoreButtonRetries >= MAX_LOAD_MORE_ATTEMPTS) {
            console.log(
              `   ✓ Đã tải tất cả khách sạn hoặc không có nút "Xem thêm"`
            );
            break;
          }

          await page.waitForTimeout(2000);
          continue;
        }

        noMoreButtonRetries = 0;

        await page.evaluate(() => {
          const button = document.querySelector(".btn-more-list");
          if (button) button.click();
        });

        await page.waitForTimeout(2500); // Đợi lâu hơn để trang tải xong
        loadMoreCount++;
        console.log(`   ⏳ Đã nhấp vào nút "Xem thêm" ${loadMoreCount} lần`);

        if (loadMoreCount >= 30) {
          console.log(`   ⚠️ Đã đạt đến giới hạn nhấp tối đa (30)`);
          break;
        }
      } catch (error) {
        console.log(`   ✓ Đã tải tất cả khách sạn - ${error.message}`);
        break;
      }
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    const hotelLinks = new Set();
    $(".deal-item a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("/khach-san/")) {
        hotelLinks.add(`https://www.bestprice.vn${href}`);
      }
    });

    const uniqueLinks = [...hotelLinks];
    console.log(`   ✅ Đã tìm thấy ${uniqueLinks.length} liên kết khách sạn`);

    for (const [index, link] of uniqueLinks.entries()) {
      try {
        console.log(
          `   🏨 Đang xử lý khách sạn ${index + 1}/${
            uniqueLinks.length
          }: ${link}`
        );

        if (link.split("/").pop().indexOf(".html") === -1) {
          console.log(`   ⏩ Bỏ qua link không phải trang chi tiết: ${link}`);
          continue;
        }

        const detail = await getDetail(link);

        if (detail && detail.hotelId && detail.name) {
          results.push(detail);
        } else {
          console.log(`   ⚠️ Không thể lấy thông tin cho khách sạn: ${link}`);
        }
      } catch (error) {
        console.error(
          `   ❌ Lỗi khi xử lý khách sạn ${link}: ${error.message}`
        );
      }
    }
    return results;
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý trang danh sách: ${error.message}`);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Lấy thông tin chi tiết khách sạn
 * @param {string} url - URL chi tiết khách sạn
 * @returns {Object} - Thông tin chi tiết khách sạn
 */
async function getDetail(url) {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const { data } = await axiosInstance.get(url);
      const $ = cheerio.load(data);

      const hotelId = $(".hotel-ids").attr("data-id");
      if (!hotelId) {
        console.warn(`⚠️ Không tìm thấy ID khách sạn cho URL: ${url}`);
        return null;
      }

      const name = $(".header-detail h1").text().trim();
      if (!name) {
        console.warn(`⚠️ Không tìm thấy tên khách sạn cho URL: ${url}`);
        return null;
      }

      const address = $(".item-address").text().trim();

      const starClass = $(".header-detail h1 i").attr("class");
      const starsMatch = starClass?.match(/ico-star-(\d)/);
      const stars = starsMatch ? parseInt(starsMatch[1]) : null;

      const rating = cleanText(
        $(".review-number span.bg-color-very-good").text() ||
          $(".review-number span").first().text()
      );

      const imageUrls = [];
      $("img.owl-lazy-img").each((_, img) => {
        const imgUrl = $(img).attr("data-src");
        if (imgUrl) imageUrls.push(imgUrl);
      });

      if (imageUrls.length === 0) {
        $(".owl-stage img[data-src]").each((_, img) => {
          const imgUrl = $(img).attr("data-src");
          if (imgUrl) imageUrls.push(imgUrl);
        });
      }

      const facilities = [];
      $(".facility .facilities-name").each((_, el) => {
        const facility = $(el).text().trim();
        if (facility) facilities.push(facility);
      });

      const rooms = [];
      $(".room_type__td").each((_, roomEl) => {
        const room = $(roomEl);

        const roomName = cleanText(
          room.find(".room_type__item__img__name p").text()
        );
        if (!roomName) return;

        const image =
          room.find(".room_type__item__img img").attr("data-src") || "";

        const area = cleanRoomInfo(room.find(".ico-square").parent().text());
        const capacity = cleanRoomInfo(room.find(".ico-user").parent().text());
        const view = cleanRoomInfo(room.find(".ico-garden").parent().text());
        const bed = cleanRoomInfo(room.find(".ico-bed").parent().text());

        rooms.push({
          name: roomName,
          area,
          capacity,
          view,
          bed,
          image,
        });
      });

      console.log(`   ✅ Đã lấy thành công thông tin khách sạn: ${name}`);

      return {
        hotelId,
        name,
        address,
        stars,
        rating,
        imageUrls,
        facilities,
        rooms,
        url,
        crawledAt: new Date().toISOString(),
      };
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error(
          `❌ Không thể lấy chi tiết khách sạn sau ${MAX_RETRIES} lần thử: ${url}`
        );
        console.error(`   Lỗi: ${error.message}`);
        return null;
      }
      console.warn(`⚠️ Thử lại (${retries}/${MAX_RETRIES}): ${url}`);

      await new Promise((resolve) => setTimeout(resolve, 3000 * retries));
    }
  }
}

const slugToProvinceName = (slug) => {
  const provinceMap = {
    "ha-noi": "Hà Nội",
    "ho-chi-minh": "Hồ Chí Minh",
    "da-nang": "Đà Nẵng",
    "hai-phong": "Hải Phòng",
    "can-tho": "Cần Thơ",
    "an-giang": "An Giang",
    "ba-ria-vung-tau": "Bà Rịa - Vũng Tàu",
    "bac-giang": "Bắc Giang",
    "bac-kan": "Bắc Kạn",
    "bac-lieu": "Bạc Liêu",
    "bac-ninh": "Bắc Ninh",
    "ben-tre": "Bến Tre",
    "binh-dinh": "Bình Định",
    "binh-duong": "Bình Dương",
    "binh-phuoc": "Bình Phước",
    "binh-thuan": "Bình Thuận",
    "ca-mau": "Cà Mau",
    "cao-bang": "Cao Bằng",
    "dak-lak": "Đắk Lắk",
    "dak-nong": "Đắk Nông",
    "dien-bien": "Điện Biên",
    "dong-nai": "Đồng Nai",
    "dong-thap": "Đồng Tháp",
    "gia-lai": "Gia Lai",
    "ha-giang": "Hà Giang",
    "ha-nam": "Hà Nam",
    "ha-tinh": "Hà Tĩnh",
    "hai-duong": "Hải Dương",
    "hau-giang": "Hậu Giang",
    "hoa-binh": "Hòa Bình",
    "hung-yen": "Hưng Yên",
    "khanh-hoa": "Khánh Hòa",
    "kien-giang": "Kiên Giang",
    "kon-tum": "Kon Tum",
    "lai-chau": "Lai Châu",
    "lam-dong": "Lâm Đồng",
    "lang-son": "Lạng Sơn",
    "lao-cai": "Lào Cai",
    "long-an": "Long An",
    "nam-dinh": "Nam Định",
    "nghe-an": "Nghệ An",
    "ninh-binh": "Ninh Bình",
    "ninh-thuan": "Ninh Thuận",
    "phu-tho": "Phú Thọ",
    "phu-yen": "Phú Yên",
    "quang-binh": "Quảng Bình",
    "quang-nam": "Quảng Nam",
    "quang-ngai": "Quảng Ngãi",
    "quang-ninh": "Quảng Ninh",
    "quang-tri": "Quảng Trị",
    "soc-trang": "Sóc Trăng",
    "son-la": "Sơn La",
    "tay-ninh": "Tây Ninh",
    "thai-binh": "Thái Bình",
    "thai-nguyen": "Thái Nguyên",
    "thanh-hoa": "Thanh Hóa",
    "thua-thien-hue": "Thừa Thiên Huế",
    "tien-giang": "Tiền Giang",
    "tra-vinh": "Trà Vinh",
    "tuyen-quang": "Tuyên Quang",
    "vinh-long": "Vĩnh Long",
    "vinh-phuc": "Vĩnh Phúc",
    "yen-bai": "Yên Bái",
  };

  return provinceMap[slug] || slug;
};

const getProvinceFromUrl = (url) => {
  try {
    const urlParts = url.split("/");
    const provinceSlug = urlParts.find(
      (part) =>
        part.includes("-") &&
        !part.includes("nha-hang") &&
        !part.includes("page=")
    );
    return provinceSlug ? slugToProvinceName(provinceSlug) : "";
  } catch (error) {
    return "";
  }
};

const getProvinceRestaurant = async (url) => {
  try {
    const allDetails = [];
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const provinceNames = [];

    $("#provinceId option").each((i, el) => {
      provinceNames.push($(el).text().trim());
    });

    const slugs = provinceNames.map(slugify);
    const urls = slugs.flatMap((slug) => {
      return Array.from(
        { length: 8 },
        (_, i) => `https://pasgo.vn/${slug}/nha-hang?page=${i + 1}`
      );
    });

    await processInBatches(urls, 5, async (link) => {
      const detail = await getDetailResLinks(link);
      if (Array.isArray(detail)) {
        allDetails.push(...detail);
      } else {
        allDetails.push(detail);
      }
    });

    fs.writeFileSync(
      "./crawlData/restaurants.json",
      JSON.stringify(allDetails, null, 2),
      "utf-8"
    );
    console.log("Done save in file");
  } catch (error) {
    console.log(error);
  }
};

const getDetailResLinks = async (url) => {
  try {
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const links = [];
    const details = [];

    $(".waptop-main a").each((i, elem) => {
      const href = $(elem).attr("href");
      if (href) {
        links.push(href);
      }
    });

    const provinceName = getProvinceFromUrl(url);

    for (const link of links) {
      const detail = await getDetailRes(link, provinceName);
      details.push(detail);
    }

    console.log("Done get detail restaurant links ", url);
    return details;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getDetailRes = async (url, provinceName = "") => {
  try {
    const { data } = await axiosInstance.get(url);
    const $ = cheerio.load(data);
    const imageUrls = [];
    const imgMenu = [];

    $("ul.splide__list img").each((_, img) => {
      const dataSrc = $(img).attr("data-src");
      const src = $(img).attr("src");

      if (dataSrc && dataSrc.startsWith("http")) {
        imageUrls.push(dataSrc);
      } else if (src && src.startsWith("http")) {
        imageUrls.push(src);
      }
    });

    const name = $("h1.star-heading").text().trim();
    let address = $("span.text-address").text().trim();

    if (
      provinceName &&
      address &&
      !address.toLowerCase().includes(provinceName.toLowerCase())
    ) {
      address = `${address}, ${provinceName}`;
    }

    const type = $("span.text_type").text().trim();
    const priceRange = $("span.pasgo-giatrungbinh").text().trim();
    const openingHours = $('div[itemscope] [itemprop="openingHours"]').attr(
      "content"
    );

    const menuImgElements = $(".price-list .items img.c-img-price");
    menuImgElements.each((index, element) => {
      const imageUrl = $(element).attr("data-src");
      imgMenu.push(imageUrl);
    });

    const parking = {
      car: {
        place: $(
          ".content.parking .parking-content p:nth-child(2) strong"
        ).text(),
        fee: $(
          ".content.parking .parking-content p:nth-child(3) strong"
        ).text(),
      },
      motorcycle: {
        place: $(
          ".content.parking .parking-content p:nth-child(5) strong"
        ).text(),
        fee: $(
          ".content.parking .parking-content p:nth-child(6) strong"
        ).text(),
      },
    };

    const utilities = [];
    $(".area-common .util-item .items").each((index, element) => {
      const name = $(element).find("p.text-color-black").text();
      utilities.push(name);
    });

    console.log("Done get detail restaurant ", url);
    return {
      name,
      address,
      type,
      priceRange,
      openingHours,
      imageUrls,
      imgMenu,
      parking,
      utilities,
      province: provinceName,
    };
  } catch (error) {
    console.log(error);
    return {};
  }
};

module.exports = {
  getLinkHotel,
  getDetailLinkHotel,
  getDetail,
  getProvinceRestaurant,
  getDetailResLinks,
  getDetailRes,
};
