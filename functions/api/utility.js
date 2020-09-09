const { MAPQUEST_KEY } = require("../secrets");
const fetch = require("node-fetch");
const { parseEarthquakeFeed } = require("../cron/utility");

/**
 * Grabs all earthquakes in the radius provided
 * @param {integer} minLat minimum latitude
 * @param {integer} maxLat maximum latitude
 * @param {integer} minLng minimum longitude
 * @param {integer} maxLng maximum longitude
 * @param {string} startDate
 * @param {string} endDate
 * @returns {array} array of earthquake objects
 */
const getEarthquakesByLocation = async (
  minLat,
  maxLat,
  minLng,
  maxLng,
  startDate,
  endDate
) => {
  const result = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&minlongitude=${minLng}&maxlatitude=${maxLat}&maxlongitude=${maxLng}&endtime=${endDate}&starttime=${startDate}`,
    {
      method: "GET",
    }
  );

  const data = await result.json();
  const quakeArray = parseEarthquakeFeed(data.features);
  return quakeArray;
};

/**
 *
 * @param {string} locationString string of location to be queried
 * @returns {obj} object with keys lat and lng that corresponds to the latitude and longitude of locationString
 */
const locationToLongLat = async (locationString) => {
  const result = await fetch(
    `http://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_KEY}&location=${locationString}`,
    {
      method: "GET",
    }
  );

  const data = await result.json();
  return data.results[0].locations[0].displayLatLng;
};

const convertRadius = (geoCode, radius) => {
  const r = radius / 3958.8;
  const lngRadians = (geoCode.lng * Math.PI) / 180;
  const latRadians = (geoCode.lat * Math.PI) / 180;

  const latMin = latRadians - r;
  const latMax = latRadians + r;
  const lngMin = lngRadians - r;
  const lngMax = lngRadians + r;

  const latMinDegrees = (latMin * 180) / Math.PI;
  const latMaxDegrees = (latMax * 180) / Math.PI;
  const lngMinDegrees = (lngMin * 180) / Math.PI;
  const lngMaxDegrees = (lngMax * 180) / Math.PI;

  return {
    minLat: latMinDegrees,
    maxLat: latMaxDegrees,
    minLng: lngMinDegrees,
    maxLng: lngMaxDegrees,
  };
};

const convertDate = (date) => {
  const dateParts = date.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
};

module.exports = {
  getEarthquakesByLocation,
  locationToLongLat,
  convertDate,
  convertRadius,
};
