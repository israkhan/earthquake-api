const { MAPQUEST_KEY } = require("../secrets");

/**
 * Grabs all earthquakes in the radius provided
 * @param {integer} minLat minimum latitude
 * @param {integer} maxLat maximum latitude
 * @param {integer} minLng minimum longitude
 * @param {integer} maxLng maximum longitude
 * @param {string} startDate
 * @param {string} endDate
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
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&minlongitude=${minLng}&maxlatitude=${maxLat}&maxlongitude=${maxLng}`,
    {
      method: "GET",
    }
  );

  const data = await result.json();
  console.log("EARTH:", data);
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

/**
 *
 * @param {string} locationString
 * @param {integer} distance
 */
const generateLocationQuery = async (locationString, distance) => {
  const latLngObject = await locationToLongLat(locationString);
  console.log(latLngObject, "latlngobj");

  const radius = {
    minLat: latLngObject.lat - 1,
    maxLat: latLngObject.lat + 1,
    minLng: latLngObject.lat - 1,
    maxLng: latLngObject.lat + 1,
  };

  getEarthquakesByLocation(
    radius.minLat,
    radius.maxLat,
    radius.minLng,
    radius.maxLng
  );
};

const getLiveUpdate = () => {
  const text = document.getElementById("isra");

  setInterval(function () {
    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    ).then((response) => {
      return response.json().then((data) => {
        text.textContent = data;
        console.log(data);
      });
    });
  }, 1000);
};

generateLocationQuery("Los Angeles, California");
getLiveUpdate();

document.addEventListener("DOMContentLoaded", function () {});
