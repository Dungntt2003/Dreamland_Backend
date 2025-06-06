const axios = require("axios");

class MapboxGeocoder {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places";
  }

  async geocode(address) {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `${this.baseUrl}/${encodedAddress}.json?access_token=${this.accessToken}&limit=1`;

      const response = await axios.get(url);

      if (response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return [
          {
            latitude: feature.center[1],
            longitude: feature.center[0],
            formattedAddress: feature.place_name,
          },
        ];
      }

      return [];
    } catch (error) {
      console.error("Mapbox geocoding error:", error.message);
      return [];
    }
  }
}

const geocoder = new MapboxGeocoder(process.env.MAPBOX_ACCESS_TOKEN);

module.exports = geocoder;
